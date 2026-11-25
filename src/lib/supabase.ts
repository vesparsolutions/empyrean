import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

/** Returns public URLs for all image files in a given storage bucket. */
export async function getBucketImageUrls(bucket: string = 'Memory'): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error || !data) {
      console.warn('[Supabase] Storage list error:', error?.message);
      return [];
    }

    const urls = data
      .filter((file) => /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name))
      .map((file) => supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl);

    console.log(`[Supabase] Loaded ${urls.length} images from bucket "${bucket}"`);
    return urls;
  } catch (err) {
    console.error('[Supabase] Unexpected error fetching bucket images:', err);
    return [];
  }
}

export interface SupabaseTicketRow {
  id: number;
  ticket: string;
  price: number;
}

/** Fetches available ticket tiers ordered by id from the Supabase `tickets` table. */
export async function fetchFestivalTickets(): Promise<SupabaseTicketRow[]> {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, ticket, price')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as SupabaseTicketRow[];
    }

    // Fallback: if RLS on `tickets` only permits `anon` and caller is signed in as `authenticated`,
    // query `tickets` directly with the public anon key so admin pricing always stays in sync.
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/tickets?select=id,ticket,price&order=id.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const anonRows = (await res.json()) as SupabaseTicketRow[];
        if (Array.isArray(anonRows) && anonRows.length > 0) {
          return anonRows;
        }
      }
    }

    if (error) {
      console.warn('[Supabase] Failed to fetch tickets:', error.message);
    }
    return [];
  } catch (err) {
    console.error('[Supabase] Unexpected error fetching tickets:', err);
    return [];
  }
}

export interface UnverifiedBookingInput {
  name: string;
  email: string;
  mobile: string;
  college: string;
  ticket_id: number;
  utr_number: string;
}

/** Inserts submitted attendee booking rows into the `unverified` table without requiring SELECT privileges. */
export async function insertUnverifiedBookings(
  rows: UnverifiedBookingInput[]
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const { error } = await supabase.from('unverified').insert(rows);
    if (error) {
      console.error('[Supabase] Failed to insert into unverified:', error.message);
      return { success: false, errorMessage: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected network error';
    console.error('[Supabase] Unexpected error inserting booking:', err);
    return { success: false, errorMessage: message };
  }
}

export type AdminTicketTable = 'unverified' | 'verified' | 'rejected';

export interface TicketRecordRow {
  id: number;
  name: string;
  email: string;
  mobile: string;
  college: string;
  ticket_id: number;
  utr_number: string;
}

/** Fetches booking rows from `unverified`, `verified`, or `rejected` for authenticated admins. */
export async function fetchAdminTableRecords(
  table: AdminTicketTable
): Promise<{ rows: TicketRecordRow[]; errorMessage?: string }> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('id, name, email, mobile, college, ticket_id, utr_number')
      .order('id', { ascending: false });

    if (error) {
      return { rows: [], errorMessage: error.message };
    }

    return { rows: (data as TicketRecordRow[]) || [] };
  } catch (err) {
    return {
      rows: [],
      errorMessage: err instanceof Error ? err.message : 'Unexpected network error',
    };
  }
}

/**
 * Moves an entry from `unverified` into `verified` or `rejected`.
 * Deliberately omits `id` on insert so the destination table generates its own auto-increment ID.
 */
export async function moveUnverifiedBooking(
  entry: TicketRecordRow,
  targetTable: 'verified' | 'rejected'
): Promise<{ success: boolean; insertedRow?: TicketRecordRow; errorMessage?: string }> {
  try {
    const payload: UnverifiedBookingInput = {
      name: entry.name,
      email: entry.email,
      mobile: entry.mobile,
      college: entry.college,
      ticket_id: entry.ticket_id,
      utr_number: entry.utr_number,
    };

    const { data: insertedData, error: insertError } = await supabase
      .from(targetTable)
      .insert([payload])
      .select('id, name, email, mobile, college, ticket_id, utr_number')
      .single();

    if (insertError) {
      return { success: false, errorMessage: insertError.message };
    }

    const { error: deleteError } = await supabase
      .from('unverified')
      .delete()
      .eq('id', entry.id);

    if (deleteError) {
      return {
        success: false,
        errorMessage: `Added to ${targetTable} (new ID #${insertedData?.id}), but failed to remove from unverified: ${deleteError.message}`,
      };
    }

    return {
      success: true,
      insertedRow: insertedData as TicketRecordRow,
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: err instanceof Error ? err.message : 'Unexpected network error',
    };
  }
}

/**
 * Deletes an entry from `verified` or `rejected`.
 * For `verified` entries, first removes any linked pass rows (`verified_id`) across
 * all sorted pass tables so foreign-key constraints and scanner access are cleanly revoked.
 */
export async function deleteAdminTicketRecord(
  table: 'verified' | 'rejected',
  entryId: number
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    if (table === 'verified') {
      await Promise.all(
        ALL_TICKET_PASS_TABLES.map(async (passTable) => {
          try {
            await supabase.from(passTable).delete().eq('verified_id', entryId);
          } catch {
            // Ignore tables without rows or delete policies
          }
        })
      );
    }

    const { error } = await supabase.from(table).delete().eq('id', entryId);
    if (error) {
      return { success: false, errorMessage: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage: err instanceof Error ? err.message : 'Unexpected network error',
    };
  }
}

export type TicketPassTable =
  | 'early_birds'
  | 'all_access'
  | 'buy_four_get_one'
  | 'couple'
  | 'day_1'
  | 'day_2'
  | 'day_3';

export const ALL_TICKET_PASS_TABLES: TicketPassTable[] = [
  'early_birds',
  'all_access',
  'buy_four_get_one',
  'couple',
  'day_1',
  'day_2',
  'day_3',
];

export function resolvePassTable(ticketId: number, ticketName?: string): TicketPassTable | null {
  const lower = (ticketName || '').toLowerCase();
  if (lower.includes('early')) return 'early_birds';
  if (lower.includes('all')) return 'all_access';
  if (lower.includes('buy 4') || lower.includes('4 get 1')) return 'buy_four_get_one';
  if (lower.includes('couple')) return 'couple';
  if (lower.includes('day 1')) return 'day_1';
  if (lower.includes('day 2')) return 'day_2';
  if (lower.includes('day 3')) return 'day_3';

  switch (Number(ticketId)) {
    case 1:
      return 'all_access';
    case 2:
      return 'day_1';
    case 3:
      return 'day_2';
    case 4:
      return 'day_3';
    case 5:
      return 'couple';
    case 6:
      return 'buy_four_get_one';
    case 7:
      return 'early_birds';
    default:
      return null;
  }
}

function generateUniqueQrToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 UUID fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Fetches map of `verified_id -> qr_code_id` across all 6 sorted pass tables. */
export async function fetchIssuedQrTokens(): Promise<Record<number, string>> {
  const issued: Record<number, string> = {};
  await Promise.all(
    ALL_TICKET_PASS_TABLES.map(async (table) => {
      try {
        const { data } = await supabase.from(table).select('verified_id, qr_code_id');
        if (Array.isArray(data)) {
          data.forEach((row: { verified_id?: number; qr_code_id?: string }) => {
            if (row.verified_id && row.qr_code_id) {
              issued[Number(row.verified_id)] = row.qr_code_id;
            }
          });
        }
      } catch {
        // Ignore tables not yet permitted
      }
    })
  );
  return issued;
}

/**
 * Ensures a unique `qr_code_id` token exists for a verified entry in its sorted ticket table
 * (`all_access`, `buy_four_get_one`, `couple`, `day_1`, `day_2`, `day_3`), keeping the record in `verified`.
 */
export async function ensureAndSaveTicketQrToken(
  entry: TicketRecordRow,
  ticketName?: string
): Promise<{
  success: boolean;
  qrCodeId?: string;
  table?: TicketPassTable;
  alreadyIssued?: boolean;
  errorMessage?: string;
}> {
  const targetTable = resolvePassTable(entry.ticket_id, ticketName);
  if (!targetTable) {
    return {
      success: false,
      errorMessage: `Unknown ticket type (ticket_id=${entry.ticket_id}).`,
    };
  }

  try {
    // Check if QR token was already issued for this verified user to prevent duplicates
    const { data: existing, error: lookupError } = await supabase
      .from(targetTable)
      .select('id, qr_code_id')
      .eq('verified_id', entry.id)
      .maybeSingle();

    if (lookupError) {
      return {
        success: false,
        table: targetTable,
        errorMessage: `Error checking ${targetTable}: ${lookupError.message}`,
      };
    }

    if (existing?.qr_code_id) {
      return {
        success: true,
        qrCodeId: existing.qr_code_id,
        table: targetTable,
        alreadyIssued: true,
      };
    }

    const newToken = generateUniqueQrToken();
    const { error: insertError } = await supabase.from(targetTable).insert([
      {
        verified_id: entry.id,
        name: entry.name,
        email: entry.email,
        ticket_id: Number(entry.ticket_id),
        qr_code_id: newToken,
      },
    ]);

    if (insertError) {
      return {
        success: false,
        table: targetTable,
        errorMessage: `Failed saving to ${targetTable}: ${insertError.message}`,
      };
    }

    return {
      success: true,
      qrCodeId: newToken,
      table: targetTable,
      alreadyIssued: false,
    };
  } catch (err) {
    return {
      success: false,
      table: targetTable,
      errorMessage: err instanceof Error ? err.message : 'Unexpected network error',
    };
  }
}

export type ScannerDay = 1 | 2 | 3;

export const DAY_ACCESS_BY_TABLE: Record<TicketPassTable, ScannerDay[]> = {
  early_birds: [1, 2, 3],
  all_access: [1, 2, 3],
  buy_four_get_one: [1, 2, 3],
  couple: [1, 2, 3],
  day_1: [1],
  day_2: [2],
  day_3: [3],
};

export const PASS_TABLE_LABELS: Record<TicketPassTable, string> = {
  early_birds: 'Early Birds Pass',
  all_access: 'All Access Pass',
  buy_four_get_one: 'Buy 4 Get 1 FREE',
  couple: 'Couple Entry',
  day_1: 'Day 1 Pass',
  day_2: 'Day 2 Pass',
  day_3: 'Day 3 Pass',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseAllowedPeopleNames(rawName: string, table: TicketPassTable): string[] {
  const trimmed = (rawName || '').trim();
  if (!trimmed) return ['Delegate'];

  if (table === 'couple' && trimmed.includes('&')) {
    const parts = trimmed
      .split('&')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts;
  }

  if (table === 'buy_four_get_one') {
    const bundleMatch = trimmed.match(/^(.+?)\s*\(\+\s*(.+)\)$/);
    if (bundleMatch) {
      const lead = bundleMatch[1].trim();
      const companions = bundleMatch[2]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return [lead, ...companions];
    }
  }

  return [trimmed];
}

export interface QrScanVerificationResult {
  valid: boolean;
  status: 'checked-in' | 'wrong-day' | 'already-scanned' | 'not-found' | 'invalid-format' | 'error';
  day: ScannerDay;
  qrCodeId: string;
  table?: TicketPassTable;
  ticketLabel?: string;
  attendeeName?: string;
  allowedNames?: string[];
  email?: string;
  reason: string;
}

/**
 * Looks up a scanned QR UUID across all 6 ticket tables, checks day validity and
 * duplicate check-in state, and sets `check_in_day_<day> = true` on valid entry.
 */
export async function verifyAndCheckInQr(
  rawToken: string,
  selectedDay: ScannerDay
): Promise<QrScanVerificationResult> {
  const token = rawToken.trim();
  if (!UUID_REGEX.test(token)) {
    return {
      valid: false,
      status: 'invalid-format',
      day: selectedDay,
      qrCodeId: token,
      reason: 'Invalid QR code — this code is not a valid Empyrean ticket pass.',
    };
  }

  try {
    const permissionErrors: string[] = [];

    const matches = await Promise.all(
      ALL_TICKET_PASS_TABLES.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('qr_code_id', token)
          .maybeSingle();

        if (error) {
          permissionErrors.push(`${table}: ${error.message}`);
          return null;
        }
        if (data) {
          return { table, row: data as Record<string, unknown> };
        }
        return null;
      })
    );

    const found = matches.find(
      (m): m is { table: TicketPassTable; row: Record<string, unknown> } => m !== null
    );

    if (!found) {
      if (permissionErrors.length === ALL_TICKET_PASS_TABLES.length) {
        return {
          valid: false,
          status: 'error',
          day: selectedDay,
          qrCodeId: token,
          reason: `Database permission error: ${permissionErrors[0]}`,
        };
      }
      return {
        valid: false,
        status: 'not-found',
        day: selectedDay,
        qrCodeId: token,
        reason: 'Pass not found. This QR code is not registered in any verified ticket list.',
      };
    }

    const { table, row } = found;
    const ticketLabel = PASS_TABLE_LABELS[table];
    const attendeeName = String(row.name || 'Delegate');
    const allowedNames = parseAllowedPeopleNames(attendeeName, table);
    const email = row.email ? String(row.email) : undefined;

    // 1. Check whether this ticket table grants access for the currently selected fest day
    const allowedDays = DAY_ACCESS_BY_TABLE[table];
    if (!allowedDays.includes(selectedDay)) {
      const validForText = allowedDays.map((d) => `Day ${d}`).join(', ');
      return {
        valid: false,
        status: 'wrong-day',
        day: selectedDay,
        qrCodeId: token,
        table,
        ticketLabel,
        attendeeName,
        allowedNames,
        email,
        reason: `Not valid for Day ${selectedDay} — this ${ticketLabel} only allows entry on ${validForText}.`,
      };
    }

    // 2. Check whether this pass was already scanned for the selected day
    const checkInCol = `check_in_day_${selectedDay}`;
    if (row[checkInCol] === true) {
      return {
        valid: false,
        status: 'already-scanned',
        day: selectedDay,
        qrCodeId: token,
        table,
        ticketLabel,
        attendeeName,
        allowedNames,
        email,
        reason: `QR already scanned for today (Day ${selectedDay} check-in was already completed).`,
      };
    }

    // 3. Mark day check-in as TRUE (guarded against concurrent duplicate scans)
    const { data: updated, error: updateError } = await supabase
      .from(table)
      .update({ [checkInCol]: true })
      .eq('id', row.id as number)
      .or(`${checkInCol}.eq.false,${checkInCol}.is.null`)
      .select('id')
      .maybeSingle();

    if (updateError) {
      return {
        valid: false,
        status: 'error',
        day: selectedDay,
        qrCodeId: token,
        table,
        ticketLabel,
        attendeeName,
        allowedNames,
        email,
        reason: `Failed to record Day ${selectedDay} check-in: ${updateError.message}`,
      };
    }

    if (!updated) {
      return {
        valid: false,
        status: 'already-scanned',
        day: selectedDay,
        qrCodeId: token,
        table,
        ticketLabel,
        attendeeName,
        allowedNames,
        email,
        reason: `QR already scanned for today (Day ${selectedDay} check-in was already completed).`,
      };
    }

    return {
      valid: true,
      status: 'checked-in',
      day: selectedDay,
      qrCodeId: token,
      table,
      ticketLabel,
      attendeeName,
      allowedNames,
      email,
      reason: `Successfully checked in for Day ${selectedDay}.`,
    };
  } catch (err) {
    return {
      valid: false,
      status: 'error',
      day: selectedDay,
      qrCodeId: token,
      reason: err instanceof Error ? err.message : 'Unexpected network error while verifying QR.',
    };
  }
}

export interface TicketStatusLookupResult {
  status: 'verified' | 'unverified' | 'rejected' | 'not-found' | 'error';
  email: string;
  entries?: { name: string; ticket_id: number }[];
  errorMessage?: string;
}

/**
 * Searches for a user's email address across `verified`, `unverified`, and `rejected`.
 * Tries the privacy-safe RPC `check_ticket_status_by_email` first, then falls back
 * to direct table queries if `anon` SELECT is granted.
 */
export async function checkTicketStatusByEmail(
  rawEmail: string
): Promise<TicketStatusLookupResult> {
  const email = rawEmail.trim();
  if (!email) {
    return { status: 'error', email, errorMessage: 'Please enter a valid email address.' };
  }

  try {
    // 1. Privacy-preserving RPC if configured in Supabase
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'check_ticket_status_by_email',
      { lookup_email: email }
    );

    if (!rpcError && rpcData) {
      const payload = rpcData as {
        status?: 'verified' | 'unverified' | 'rejected' | 'not-found';
        entries?: { name: string; ticket_id: number }[];
      };
      if (
        payload.status === 'verified' ||
        payload.status === 'unverified' ||
        payload.status === 'rejected' ||
        payload.status === 'not-found'
      ) {
        return {
          status: payload.status,
          email,
          entries: payload.entries || [],
        };
      }
    }

    // 2. Direct `verified`, `unverified`, & `rejected` email lookup fallback
    const [verRes, unvRes, rejRes] = await Promise.all([
      supabase.from('verified').select('id, name, email, ticket_id').ilike('email', email),
      supabase.from('unverified').select('id, name, email, ticket_id').ilike('email', email),
      supabase.from('rejected').select('id, name, email, ticket_id').ilike('email', email),
    ]);

    if (verRes.error && unvRes.error && rejRes.error) {
      return {
        status: 'error',
        email,
        errorMessage: verRes.error.message,
      };
    }

    if (verRes.data && verRes.data.length > 0) {
      return {
        status: 'verified',
        email,
        entries: verRes.data.map((r) => ({ name: r.name, ticket_id: Number(r.ticket_id) })),
      };
    }

    if (unvRes.data && unvRes.data.length > 0) {
      return {
        status: 'unverified',
        email,
        entries: unvRes.data.map((r) => ({ name: r.name, ticket_id: Number(r.ticket_id) })),
      };
    }

    if (rejRes.data && rejRes.data.length > 0) {
      return {
        status: 'rejected',
        email,
        entries: rejRes.data.map((r) => ({ name: r.name, ticket_id: Number(r.ticket_id) })),
      };
    }

    if (verRes.error) {
      return { status: 'error', email, errorMessage: verRes.error.message };
    }
    if (unvRes.error) {
      return { status: 'error', email, errorMessage: unvRes.error.message };
    }
    if (rejRes.error) {
      return { status: 'error', email, errorMessage: rejRes.error.message };
    }

    return { status: 'not-found', email };
  } catch (err) {
    return {
      status: 'error',
      email,
      errorMessage: err instanceof Error ? err.message : 'Unexpected network error',
    };
  }
}
