# FF Diamonds — Full-Stack Demo (Node + Express + SQLite)

A diamond top-up storefront with **real signup/login/password-reset** backed by a
SQLite database and email-based password recovery.

## What changed from the static template
- Added a Node/Express server (`server.js`) with a SQL (SQLite) database.
- Passwords are hashed with **bcrypt** — never stored in plaintext.
- Added `/api/signup`, `/api/login`, `/api/forgot-password`, `/api/reset-password`.
- Added `forgot-password.html` and `reset-password.html` pages.
- `script.js` now calls the real API instead of `localStorage`.

## Project structure
```
ffd-backend/
├── server.js              # Express app entry point
├── mailer.js              # Nodemailer / Gmail SMTP setup
├── db/
│   └── database.js        # SQLite schema (users, password_resets)
├── routes/
│   └── auth.js             # signup / login / forgot / reset endpoints
├── public/                 # your front-end (served as static files)
│   ├── index.html, login.html, signup.html, dashboard.html
│   ├── forgot-password.html, reset-password.html
│   ├── style.css, script.js
├── .env.example
└── package.json
```

## Setup

1. **Install dependencies** (requires Node.js 18+):
   ```bash
   cd ffd-backend
   npm install
   ```

2. **Create your `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   PORT=3000
   APP_BASE_URL=http://localhost:3000
   SMTP_USER=khushaltaneja2001@gmail.com
   SMTP_PASS=your16charapppassword
   ```

   ⚠️ **About the Gmail App Password:** never paste it into chat, code, or commits.
   Generate one at **myaccount.google.com/apppasswords** (requires 2-Step Verification
   to be turned on for your Google account), and put it only in `.env`. Your `.gitignore`
   already excludes `.env` so it won't accidentally get committed.

3. **Run the server:**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` — the SQLite file `db/ffdiamonds.db` is created
   automatically on first run.

## How password reset works
1. User submits their email on `forgot-password.html`.
2. Server checks if an account exists. **Either way it returns the same message**
   ("If an account exists, a reset link has been sent") — this prevents someone
   from using the form to discover which emails are registered.
3. If the account exists, a random token is generated, **its hash** is stored in
   `password_resets` with a 30-minute expiry, and the raw token is emailed as a link.
4. The user clicks the link → `reset-password.html?token=...&id=...` → submits a
   new password → server verifies the token's hash matches, hasn't expired, and
   hasn't been used, then updates the password hash and marks the token used.

## Security notes
- Passwords: hashed with bcrypt (cost factor 12), never logged or returned by the API.
- Reset tokens: only a SHA-256 hash is stored, single-use, 30-minute expiry.
- Login/forgot-password responses are intentionally vague (don't reveal whether
  an email is registered).
- `.env` (your real SMTP credentials) is git-ignored — only `.env.example` (no
  real secrets) should ever be committed.

## Still TODO before this is a real production app
- Add rate-limiting on `/api/login` and `/api/forgot-password` (e.g. `express-rate-limit`)
  to slow down brute-force / email-bombing attempts.
- Add CSRF protection and HTTPS (via a reverse proxy like Nginx + Let's Encrypt, or
  a host that provides TLS) before handling real payments or real user data.
- Real Google/Facebook login: see the OAuth section below — still placeholders for now.
- A real orders table + payment gateway integration (currently the dashboard shows
  a static placeholder).

## How to connect real Google / Facebook login
The "Continue with Google/Facebook" buttons are still placeholders.

**Easiest path — Firebase Authentication (free tier available):**
1. Create a project at the Firebase console and enable Google + Facebook sign-in.
2. For Facebook, set up a Meta for Developers app with Facebook Login configured.
3. Add the Firebase JS SDK and replace `ffdSocialDemo()` with
   `signInWithPopup(auth, googleProvider)` / `...facebookProvider`.
4. Firebase returns a verified user object — store that (e.g. upsert into the
   `users` table with `provider = 'google'`), skipping the password field entirely.

In every case, the real flow is: your page redirects to Google/Facebook → the
person logs in **on Google/Facebook's own site** → the provider redirects back
with a verified token. Your site never sees their password.

## Customizing
- Colors/fonts: edit the `:root` variables at the top of `public/style.css`.
- Packages/prices: edit the `.shard-card` blocks in `public/index.html`.
- WhatsApp number: edit the `phone` variable in `public/script.js`
  (`ffdInjectWhatsApp` function).
