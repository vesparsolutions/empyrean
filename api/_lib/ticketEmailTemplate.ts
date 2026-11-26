function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildTicketConfirmationEmail(recipientName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const safeName = escapeHtml(recipientName.trim() || 'Delegate');
  const plainName = recipientName.trim() || 'Delegate';

  const subject = 'Your Empyrean 2026 Ticket Is Confirmed!';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.05);">
          <!-- Official Header -->
          <tr>
            <td style="background-color:#0b1839;padding:26px 28px;border-bottom:3px solid #f8c12c;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f8c12c;">
                Indian Institute of Management Jammu
              </p>
              <h1 style="margin:6px 0 0;font-size:22px;line-height:1.25;font-weight:700;color:#ffffff;">
                Empyrean 2026
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:28px 28px 24px;font-size:15px;line-height:1.65;color:#1e293b;">
              <p style="margin:0 0 16px;">Hi ${safeName},</p>

              <p style="margin:0 0 14px;">
                Your registration for <strong>Empyrean 2026 at IIM Jammu</strong> has been confirmed!
              </p>

              <p style="margin:0 0 20px;">
                We&rsquo;re pleased to share your official entry ticket. Please find your ticket PDF attached to this email.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:0 0 22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#0f172a;">
                      A few things to remember:
                    </p>
                    <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.65;color:#334155;">
                      <li style="margin-bottom:6px;">Keep your ticket PDF safe.</li>
                      <li style="margin-bottom:6px;">Carry the ticket on your phone or as a printout.</li>
                      <li style="margin-bottom:6px;">Your ticket contains a unique QR code that will be scanned at the entry gate.</li>
                      <li style="margin-bottom:0;">Each QR code is unique and valid for its assigned ticket only.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;">
                We look forward to welcoming you to Empyrean 2026!
              </p>

              <p style="margin:0;color:#0f172a;">
                Regards,<br />
                <strong>Team Empyrean 2026</strong>
              </p>
            </td>
          </tr>

          <!-- Subtle Secondary Footer Credit -->
          <tr>
            <td style="padding:14px 28px 18px;border-top:1px solid #f1f5f9;background-color:#ffffff;text-align:center;">
              <p style="margin:0;font-size:11px;line-height:1.4;color:#94a3b8;font-style:italic;">
                Powered by Vespar Solutions
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${plainName},

Your registration for Empyrean 2026 at IIM Jammu has been confirmed!

We're pleased to share your official entry ticket. Please find your ticket PDF attached to this email.

A few things to remember:
- Keep your ticket PDF safe.
- Carry the ticket on your phone or as a printout.
- Your ticket contains a unique QR code that will be scanned at the entry gate.
- Each QR code is unique and valid for its assigned ticket only.

We look forward to welcoming you to Empyrean 2026!

Regards,
Team Empyrean 2026

Powered by Vespar Solutions`;

  return { subject, html, text };
}
