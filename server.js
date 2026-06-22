/**
 * FF Diamonds — Email Backend (Gmail SMTP via Nodemailer)
 * Run: node server.js
 * Requires: npm install express nodemailer cors
 */

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your frontend

// Serve static frontend files
app.use(express.static(path.join(__dirname, "ffdiamonds")));

// ─── Gmail SMTP transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.GMAIL_USER || "khushaltaneja2001@gmail.com",
    pass: process.env.GMAIL_PASS || "yenc etqc ajee qorz", // App Password (16-digit)
  },
});

// Verify connection on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err.message);
  } else {
    console.log("✅ Gmail SMTP connected — ready to send emails");
  }
});

// ─── Route: Welcome email on signup ──────────────────────────────────────────
app.post("/api/send-welcome", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  try {
    await transporter.sendMail({
      from: `"FF Diamonds" <khushaltaneja2001@gmail.com>`,
      to: email,
      subject: "Welcome to FF Diamonds! 💎",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:520px;margin:auto;background:#0d0d0d;color:#e0e0e0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#ff4d00,#00e5ff);padding:32px;text-align:center;">
            <h1 style="margin:0;font-size:28px;color:#fff;letter-spacing:1px;">💎 FF Diamonds</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#00e5ff;margin-top:0;">Welcome, ${name}! 🎮</h2>
            <p>Your account has been created successfully. You can now top up Free Fire diamonds instantly.</p>
            <a href="https://yoursite.com/login.html"
               style="display:inline-block;margin-top:16px;padding:12px 28px;background:linear-gradient(135deg,#ff4d00,#ff7a00);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">
              Go to Dashboard →
            </a>
            <hr style="border-color:#333;margin:28px 0;">
            <p style="font-size:13px;color:#888;">If you didn't create this account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: "Welcome email sent!" });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// ─── Route: Order confirmation email ─────────────────────────────────────────
app.post("/api/send-order", async (req, res) => {
  const { name, email, package: pkg, amount, orderId } = req.body;

  if (!email || !orderId) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    await transporter.sendMail({
      from: `"FF Diamonds" <khushaltaneja2001@gmail.com>`,
      to: email,
      subject: `Order Confirmed — ${pkg} 💎 | FF Diamonds`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:520px;margin:auto;background:#0d0d0d;color:#e0e0e0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#ff4d00,#00e5ff);padding:32px;text-align:center;">
            <h1 style="margin:0;font-size:28px;color:#fff;">💎 Order Confirmed</h1>
          </div>
          <div style="padding:32px;">
            <p>Hi <strong>${name || "Player"}</strong>,</p>
            <p>Your diamond order has been received and will be delivered shortly!</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr style="border-bottom:1px solid #333;">
                <td style="padding:10px 0;color:#888;">Order ID</td>
                <td style="padding:10px 0;text-align:right;font-family:monospace;color:#00e5ff;">${orderId}</td>
              </tr>
              <tr style="border-bottom:1px solid #333;">
                <td style="padding:10px 0;color:#888;">Package</td>
                <td style="padding:10px 0;text-align:right;">${pkg}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;">Amount Paid</td>
                <td style="padding:10px 0;text-align:right;color:#ff4d00;font-weight:700;">₹${amount}</td>
              </tr>
            </table>
            <p style="font-size:13px;color:#888;margin-top:24px;">Diamonds are typically delivered within 5–10 minutes. Contact us on WhatsApp if you face any issues.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: "Order confirmation sent!" });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// ─── Route: OTP / verification email ─────────────────────────────────────────
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  try {
    await transporter.sendMail({
      from: `"FF Diamonds" <khushaltaneja2001@gmail.com>`,
      to: email,
      subject: `Your OTP — ${otp} | FF Diamonds`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;background:#0d0d0d;color:#e0e0e0;border-radius:12px;padding:32px;text-align:center;">
          <h2 style="color:#00e5ff;margin-top:0;">Verification Code</h2>
          <p>Use this OTP to verify your email:</p>
          <div style="font-size:42px;font-family:monospace;letter-spacing:10px;color:#ff4d00;margin:24px 0;font-weight:700;">${otp}</div>
          <p style="font-size:13px;color:#888;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FF Diamonds server running at http://localhost:${PORT}`);
});
