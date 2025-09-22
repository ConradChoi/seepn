// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - types provided via local declaration for bundler resolution
import nodemailer from 'nodemailer';

// Ensure Node.js runtime for nodemailer compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const from = process.env.EMAIL_FROM || user;

    const missing: string[] = [];
    if (!host) missing.push('EMAIL_HOST');
    if (!process.env.EMAIL_PORT) missing.push('EMAIL_PORT');
    if (!user) missing.push('EMAIL_USER');
    if (!pass) missing.push('EMAIL_PASS');
    if (!from) missing.push('EMAIL_FROM');
    if (missing.length > 0) {
      return new Response(JSON.stringify({ error: 'Email environment not configured', missing }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({ from, to, subject, html });

    return new Response(JSON.stringify({ messageId: (info as any)?.messageId ?? null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Email send failed', err);
    return new Response(JSON.stringify({ error: 'Email send failed', message: err?.message || null }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


