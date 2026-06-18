# FF Diamonds — Website Template

A front-end demo for a Free-Fire-style diamond top-up store: homepage, sign up, login, and a customer dashboard, plus a WhatsApp floating contact button.

## What's included
- `index.html` — homepage with package pricing, how-it-works, trust strip, FAQ
- `login.html` / `signup.html` — auth pages
- `dashboard.html` — logged-in customer's own profile + order history
- `style.css` — shared design system (ember/cyan "cut diamond" theme)
- `script.js` — shared logic + WhatsApp button injection

## ⚠️ Important: this demo auth is NOT production-ready
The login/signup forms currently store accounts in the browser's `localStorage` with **plaintext passwords** and no real server. This is fine for previewing the UI, but before you let real users sign up:

1. **Never ship plaintext passwords.** Use a real backend that hashes passwords (e.g. bcrypt/argon2) — Firebase Auth, Supabase Auth, Auth0, or your own Node/Express + database all handle this for you.
2. **Don't build a custom "approve logins" admin dashboard that lists other users' credentials or IDs.** A page where an admin "accepts" people's Google/Facebook logins is not how OAuth works and is a major red flag for phishing — it would expose real user accounts. Each user's dashboard should only ever show *their own* data.

## How to connect real Google / Facebook login
The "Continue with Google/Facebook" buttons are currently placeholders (they show an explainer alert). To make them real:

**Easiest path — Firebase Authentication (free tier available):**
1. Create a project at the Firebase console and enable the Google and Facebook sign-in providers.
2. For Facebook, you'll also need a Meta for Developers app with a Facebook Login product configured.
3. Add the Firebase JS SDK to your pages and replace `ffdSocialDemo()` with calls to `signInWithPopup(auth, googleProvider)` / `...facebookProvider`.
4. Firebase returns a verified user object (name, email, provider) — store that, and skip your own password fields entirely for social sign-ins.

**Alternative:** Auth0 or Supabase Auth work similarly and also support email/password + social providers out of the box, with proper hashing and session handling already built in.

In every case, the real flow is: your page redirects to Google/Facebook → the person logs in **on Google/Facebook's own site** → the provider redirects back with a verified token. Your site never sees or stores their password.

## WhatsApp button
Edit the `phone` variable in `script.js` (`ffdInjectWhatsApp` function) to your real WhatsApp Business number, in international format with no `+`, spaces, or dashes (e.g. `919876543210`).

## Customizing
- Colors/fonts: edit the `:root` variables at the top of `style.css`.
- Packages/prices: edit the `.shard-card` blocks in `index.html`.
- Branding name "FF Diamonds": replace via find-and-replace across all HTML files.
