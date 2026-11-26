import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './_lib/email.js';
import { buildTicketConfirmationEmail } from './_lib/ticketEmailTemplate.js';
import { generateTicketPdfBuffer, type ServerTicketPassTable } from './_lib/ticketPdf.js';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
}

interface VerifiedRow {
  id: number;
  name: string;
  email: string;
  mobile: string;
  college: string;
  ticket_id: number;
  utr_number: string;
  email_sent: boolean;
  email_sent_at: string | null;
  resend_email_id: string | null;
  email_error: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseBody(rawBody: unknown): Record<string, unknown> {
  if (!rawBody) return {};
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof rawBody === 'object') {
    return rawBody as Record<string, unknown>;
  }
  return {};
}

function resolvePassTableServer(ticketId: number, ticketName?: string): ServerTicketPassTable | null {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      success: false,
      error: 'Supabase environment variables are not configured on the server.',
    });
  }

  // 1. Extract & verify authenticated admin's Supabase JWT using anon key + RLS
  const authHeader = req.headers.authorization || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const jwt = bearerMatch?.[1]?.trim();
  if (!jwt) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: missing admin Bearer token.',
    });
  }

  const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  });

  const { data: authData, error: authError } = await userSupabase.auth.getUser(jwt);
  if (authError || !authData?.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: invalid or expired admin session.',
    });
  }

  // 2. Validate request body
  const body = parseBody(req.body);
  const verifiedId = Number(body.verifiedId);
  const isResend = body.resend === true;

  if (!Number.isInteger(verifiedId) || verifiedId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid positive integer "verifiedId".',
    });
  }

  // 3. Atomic backend duplicate-send & concurrency lock using RLS-enforced admin client
  const lockMarker = `sending:${Date.now()}:${crypto.randomUUID()}`;
  let lockQuery = userSupabase
    .from('verified')
    .update({ email_error: lockMarker })
    .eq('id', verifiedId)
    .or('email_error.is.null,email_error.not.like.sending:%');

  if (!isResend) {
    lockQuery = lockQuery.eq('email_sent', false);
  }

  const { data: lockedRow, error: lockError } = await lockQuery
    .select(
      'id, name, email, mobile, college, ticket_id, utr_number, email_sent, email_sent_at, resend_email_id, email_error'
    )
    .maybeSingle();

  if (lockError) {
    const isPermDenied =
      lockError.code === '42501' || /permission denied|row-level security/i.test(lockError.message);
    return res.status(isPermDenied ? 403 : 500).json({
      success: false,
      error: isPermDenied
        ? 'Forbidden: your account does not have permission to send verified tickets.'
        : `Database error: ${lockError.message}`,
    });
  }

  if (!lockedRow) {
    // Determine whether the row doesn't exist in `verified` (not approved) or was already sent/locked
    const { data: existingRow, error: lookupErr } = await userSupabase
      .from('verified')
      .select('id, email_sent, email_error')
      .eq('id', verifiedId)
      .maybeSingle();

    if (lookupErr) {
      return res.status(403).json({
        success: false,
        error: `Forbidden or inaccessible registration: ${lookupErr.message}`,
      });
    }

    if (!existingRow) {
      return res.status(404).json({
        success: false,
        error: 'Approved registration not found in verified table.',
      });
    }

    if (typeof existingRow.email_error === 'string' && existingRow.email_error.startsWith('sending:')) {
      return res.status(409).json({
        success: false,
        error: 'This ticket email is already being sent. Please wait a moment.',
      });
    }

    if (existingRow.email_sent && !isResend) {
      return res.status(409).json({
        success: false,
        error: 'Ticket email has already been sent. Use Resend Ticket to send again.',
      });
    }

    return res.status(409).json({
      success: false,
      error: 'Could not acquire send lock for this ticket.',
    });
  }

  const record = lockedRow as VerifiedRow;
  const previousError = null;

  const releaseLockWithError = async (message: string | null) => {
    await userSupabase
      .from('verified')
      .update({ email_error: message })
      .eq('id', record.id)
      .eq('email_error', lockMarker);
  };

  try {
    // 4. Validate recipient email stored on the verified registration
    const recipientEmail = (record.email || '').trim();
    if (!recipientEmail || !EMAIL_REGEX.test(recipientEmail)) {
      const msg = 'Registration has an invalid or missing email address.';
      await releaseLockWithError(msg);
      return res.status(400).json({ success: false, error: msg });
    }

    // 5. Resolve ticket type & reuse existing QR token (NEVER generate or regenerate a QR token)
    const { data: ticketRow } = await userSupabase
      .from('tickets')
      .select('id, ticket')
      .eq('id', record.ticket_id)
      .maybeSingle();

    const passTable = resolvePassTableServer(
      record.ticket_id,
      ticketRow?.ticket ? String(ticketRow.ticket) : undefined
    );
    if (!passTable) {
      const msg = `Unknown ticket type (ticket_id=${record.ticket_id}).`;
      await releaseLockWithError(msg);
      return res.status(400).json({ success: false, error: msg });
    }

    const { data: passRow, error: passErr } = await userSupabase
      .from(passTable)
      .select('qr_code_id')
      .eq('verified_id', record.id)
      .maybeSingle();

    if (passErr) {
      const msg = `Could not look up QR pass in ${passTable}: ${passErr.message}`;
      await releaseLockWithError(msg);
      return res.status(500).json({ success: false, error: msg });
    }

    let qrCodeId = passRow?.qr_code_id ? String(passRow.qr_code_id) : '';

    // Issue & save a unique QR token into the pass table if not yet issued (same properties as Download Ticket)
    if (!qrCodeId) {
      const newToken = crypto.randomUUID();
      const { error: insertPassErr } = await userSupabase.from(passTable).insert([
        {
          verified_id: record.id,
          name: record.name,
          email: record.email,
          ticket_id: Number(record.ticket_id),
          qr_code_id: newToken,
        },
      ]);

      if (insertPassErr) {
        const msg = `Failed saving QR pass to ${passTable}: ${insertPassErr.message}`;
        await releaseLockWithError(msg);
        return res.status(500).json({ success: false, error: msg });
      }

      qrCodeId = newToken;
    }

    // 6. Generate exact ticket PDF on server & attach via Resend
    const pdfBuffer = await generateTicketPdfBuffer({
      token: qrCodeId,
      passTable,
    });

    const safeBuyerName =
      record.name
        .trim()
        .replace(/[<>:"/\\|?*]+/g, '')
        .replace(/\s+/g, '_') || 'Delegate';
    const pdfFilename = `${safeBuyerName}_Empyrean.pdf`;

    const { subject, html, text } = buildTicketConfirmationEmail(record.name);
    const sendResult = await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
      ],
    });

    if (!sendResult.success) {
      const errMsg = sendResult.error || 'Resend rejected the email request.';
      await releaseLockWithError(errMsg);
      return res.status(502).json({
        success: false,
        error: errMsg,
      });
    }

    // 7. Record accepted send status, timestamp, and Resend message ID
    const sentAt = new Date().toISOString();
    const { error: updateErr } = await userSupabase
      .from('verified')
      .update({
        email_sent: true,
        email_sent_at: sentAt,
        resend_email_id: sendResult.id || null,
        email_error: null,
      })
      .eq('id', record.id);

    if (updateErr) {
      return res.status(200).json({
        success: true,
        verifiedId: record.id,
        email: recipientEmail,
        qrCodeId,
        resendEmailId: sendResult.id,
        emailSentAt: sentAt,
        warning: `Email accepted by Resend (ID: ${sendResult.id}), but failed saving status: ${updateErr.message}`,
      });
    }

    return res.status(200).json({
      success: true,
      verifiedId: record.id,
      email: recipientEmail,
      qrCodeId,
      resendEmailId: sendResult.id,
      emailSentAt: sentAt,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unexpected server error while sending ticket.';
    await releaseLockWithError(errMsg);
    return res.status(500).json({
      success: false,
      error: errMsg,
    });
  }
}
