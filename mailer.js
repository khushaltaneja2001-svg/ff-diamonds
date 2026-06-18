// mailer.js
// Sends password-reset emails via Gmail SMTP using Nodemailer.
// Credentials come ONLY from environment variables (.env) — never hardcode them.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,   // e.g. khushaltaneja2001@gmail.com
    pass: process.env.SMTP_PASS    // the Gmail App Password (16 chars, no spaces)
  }
});

async function sendResetEmail(toEmail, fullName, resetLink) {
  const mailOptions = {
    from: `"FF Diamonds" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset your FF Diamonds password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#111;">Reset your password</h2>
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>We received a request to reset your FF Diamonds account password.
           This link will expire in 30 minutes.</p>
        <p style="margin:28px 0;">
          <a href="${resetLink}"
             style="background:#0ea5e9;color:#fff;padding:12px 22px;border-radius:6px;
                    text-decoration:none;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p style="color:#666;font-size:13px;">
          If you didn't request this, you can safely ignore this email —
          your password will not change.
        </p>
        <p style="color:#999;font-size:12px;word-break:break-all;">
          Or copy this link: ${resetLink}
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = { sendResetEmail };
