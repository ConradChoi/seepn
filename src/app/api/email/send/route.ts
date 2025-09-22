import nodemailer from 'nodemailer';

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

    if (!host || !user || !pass || !from) {
      return new Response(JSON.stringify({ error: 'Email environment not configured' }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({ from, to, subject, html });

    return new Response(JSON.stringify({ messageId: info.messageId }), { status: 200 });
  } catch (err) {
    console.error('Email send failed', err);
    return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 });
  }
}


