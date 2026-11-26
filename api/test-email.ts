import type { IncomingMessage, ServerResponse } from 'node:http';
import { DEFAULT_FROM, sendEmail } from './_lib/email.js';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  // Optional shared-secret guard when TEST_EMAIL_SECRET is configured in Vercel
  const configuredSecret = process.env.TEST_EMAIL_SECRET?.trim();
  if (configuredSecret) {
    const providedSecret = req.headers['x-test-email-secret'];
    if (providedSecret !== configuredSecret) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: invalid or missing x-test-email-secret header.',
      });
    }
  }

  const body = parseBody(req.body);
  const to = typeof body.to === 'string' ? body.to.trim() : '';
  const customSubject = typeof body.subject === 'string' ? body.subject.trim() : '';

  if (!to || !EMAIL_REGEX.test(to)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid recipient email address in "to".',
    });
  }

  const subject = customSubject || 'Empyrean 2026 — Resend Email Delivery Test';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #0b1839;">Empyrean 2026 • IIM Jammu</h2>
      <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #334155;">
        This is a test email confirming that automated email delivery via <strong>Resend</strong> is configured and working properly.
      </p>
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        Sender: ${DEFAULT_FROM.replace('<', '&lt;').replace('>', '&gt;')}
      </p>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html,
    text: 'Empyrean 2026 (IIM Jammu) — Test email confirming Resend delivery is configured and working.',
  });

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to send test email.',
    });
  }

  return res.status(200).json({
    success: true,
    id: result.id,
    from: DEFAULT_FROM,
    to,
  });
}
