import { Resend } from 'resend';

export const DEFAULT_FROM_NAME = 'Empyrean 2026';
export const DEFAULT_FROM_ADDRESS = 'empyrean@vesparsolutions.in';
export const DEFAULT_FROM = `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_ADDRESS}>`;

export interface SendEmailAttachment {
  filename: string;
  content: Buffer | string;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: SendEmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

let cachedResend: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not configured.');
  }
  if (!cachedResend) {
    cachedResend = new Resend(apiKey);
  }
  return cachedResend;
}

/**
 * Reusable server-side email sender powered by Resend.
 * Must only be imported by server-side `/api` functions.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
      attachments: params.attachments,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Resend failed to send email.',
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected error sending email.',
    };
  }
}
