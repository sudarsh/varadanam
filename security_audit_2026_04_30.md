# Security Audit Report — Varadanam App

**Date:** 2026-04-30
**Audited by:** Claude Code (automated analysis)
**Repos audited:** varadanam-server, varadanam-admin, varadanam-user

---

## Executive Summary

| Severity | Count |
|---|---|
| CRITICAL | 2 |
| HIGH | 3 |
| MEDIUM | 8 |
| LOW | 4 |
| **Total open** | **17** |

| Status | Count |
|---|---|
| Fixed since last audit | 11 |
| Still open | 9 |
| Partially fixed | 3 |
| New issues found | 6 |

---

## Fixed Since Last Audit ✅

| Finding | Detail |
|---|---|
| CV-1 | Razorpay secrets encrypted at rest via `src/lib/crypto.js` |
| CV-2 | Razorpay secrets excluded from public temple API via `SAFE_SELECT` |
| CV-5 | IDOR on order detail — `optionalAuth` middleware + field filtering |
| CV-6 | Send-receipt endpoint — acceptable design for guest use |
| CV-9 | Mass assignment on offering — explicit field destructuring |
| CV-10 | Rate limiting on auth endpoints — 10 attempts / 15 min |
| CV-11 | Email XSS — data sourced from trusted Prisma models |
| CV-12 | Cross-temple data leakage — all controllers scoped to `req.user.templeId` |
| CV-16 | `userId` always from JWT, never from request body |
| CF-4 | Body size limit: `express.json({ limit: '10kb' })` |
| D-1 | nodemailer removed, migrated to Resend SDK |

---

## Still Open 🔴

### CV-3 — No startup validation for JWT_SECRET (HIGH)
- **File:** `varadanam-server/src/index.js`
- **Detail:** No check that `JWT_SECRET` is set or has minimum entropy. If placeholder is used, all JWTs are signed with a known string.
- **Fix:** Add startup guard rejecting values shorter than 32 characters or matching placeholder.

### CV-7 — Legacy `routes/` directory and `index.js` still in repo (MEDIUM)
- **Files:** `varadanam-server/routes/`, `varadanam-server/index.js`
- **Detail:** Legacy entry point has no Helmet, no auth middleware, and CORS open to all origins. Can be started via `node index.js`.
- **Fix:** Delete `routes/` directory and root `index.js` entirely.

### CV-8 — Mass assignment in `temple.create()` (MEDIUM)
- **File:** `varadanam-server/src/controllers/temple.controller.js` line 48
- **Detail:** `prisma.temple.create({ data: req.body })` — attacker can set `isActive`, `plan`, or other sensitive fields.
- **Fix:** Explicitly destructure and whitelist allowed fields on create.

### CV-13 — Timing-unsafe webhook signature comparison (HIGH)
- **Files:**
  - `varadanam-server/src/services/razorpay.service.js` line 20: `return expected === signature`
  - `varadanam-server/src/routes/webhook.routes.js` line 51: `if (expected !== signature)`
- **Detail:** String equality is vulnerable to timing attacks on HMAC verification.
- **Fix:** Use `crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))` in both locations.

### CV-14 — Error handler sends `err.message` verbatim (MEDIUM)
- **File:** `varadanam-server/src/middleware/errorHandler.js` line 4
- **Detail:** Raw error messages (Prisma constraint names, DB paths) sent to client in all environments.
- **Fix:** Return generic `'Internal Server Error'` for 5xx in production; log full error to Sentry only.

### CF-1 — `.env.example` has real DB credentials (MEDIUM)
- **File:** `varadanam-server/.env.example` line 2: `postgresql://postgres:password@localhost:5432/varadanam`
- **Fix:** Replace with `postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/varadanam`.

### CF-2 — Legacy `index.js` entry point (MEDIUM)
- Covered under CV-7 above.

### CF-3 — Morgan always uses `'dev'` format (LOW)
- **File:** `varadanam-server/src/index.js` line 48
- **Detail:** Verbose colored output in production may include sensitive URL params.
- **Fix:** `morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')`

### S-1/S-2/S-3 — Hardcoded seed passwords (HIGH)
- **File:** `varadanam-server/prisma/seed.js`
- **Detail:** `admin123`, `super123`, `user123` hardcoded and printed to console on seed run.
- **Fix:** Source seed passwords from env vars; add production guard to prevent seed running in prod.

---

## Partially Fixed ⚠️

### CV-4 — CORS wildcard fallback when FRONTEND_URL is unset (MEDIUM)
- **File:** `varadanam-server/src/index.js` line 36
- **Detail:** `if (!allowedOrigins) return true` — allows all origins if `FRONTEND_URL` env var is not set.
- **Current state:** FRONTEND_URL is set in Railway, so risk is masked. But code should fail closed.
- **Fix:** Throw startup error if `FRONTEND_URL` is not set in production.

### CV-15 — No logging on auth failures (LOW)
- **File:** `varadanam-server/src/controllers/auth.controller.js`
- **Detail:** Failed login attempts silently return 401 with no audit trail (no IP, email, timestamp logged).
- **Fix:** Log failed attempts with `console.warn` or Sentry breadcrumb including email and IP.

### CV-17 — Minimum password length is 6 characters (LOW)
- **File:** `varadanam-server/src/routes/auth.routes.js` line 22
- **Detail:** `body('password').isLength({ min: 6 })` — NIST recommends minimum 8.
- **Fix:** Change to `min: 8`.

---

## New Issues Found 🆕

### NEW-1 — Resend API key in committed `.env` file (CRITICAL)
- **File:** `varadanam-server/.env` line 13
- **Detail:** `RESEND_API_KEY=re_gJzV6A9N_...` — real key present. If `.env` was ever committed, it is in git history.
- **Fix:** Rotate the Resend API key immediately. Verify `.env` is in `.gitignore`. Clean git history if needed.

### NEW-2 — Cloudinary API secret in committed `.env` file (CRITICAL)
- **File:** `varadanam-server/.env` line 12
- **Detail:** `CLOUDINARY_API_SECRET=l9FwVemj7SIk...` — real secret present.
- **Fix:** Rotate Cloudinary API secret immediately. Same git history check applies.

### NEW-5 — JWT stored in `localStorage` (MEDIUM)
- **Files:**
  - `varadanam-user/src/context/AuthContext.jsx` line 6: `localStorage.getItem('u_token')`
  - `varadanam-admin/src/context/AuthContext.jsx` line 6: `localStorage.getItem('token')`
- **Detail:** Tokens in localStorage are accessible to any JavaScript running on the page. XSS attack can steal them.
- **Fix:** Migrate to `httpOnly` cookies. Requires server-side `/api/auth/refresh` cookie endpoint.

### NEW-7 — Order creation accepts arbitrary `status` from request body (MEDIUM)
- **File:** `varadanam-server/src/controllers/order.controller.js` line 166
- **Detail:** `status: req.body.status || 'CREATED'` — unauthenticated attacker can create orders with `status: 'PAID'` bypassing payment.
- **Fix:** Remove `status` from accepted fields on create; always default to `'CREATED'`.

### NEW-10 — Guest PII stored unencrypted in database (MEDIUM)
- **File:** `varadanam-server/prisma/schema.prisma` lines 213–214
- **Detail:** `contactEmail` and `contactMobile` on `Order` stored as plaintext. GDPR concern.
- **Fix:** Encrypt at application level using the existing `encrypt()`/`decrypt()` functions (already used for Razorpay secrets).

### NEW-6 — No explicit Content Security Policy (LOW)
- **File:** `varadanam-server/src/index.js` line 30: `app.use(helmet())`
- **Detail:** Helmet is enabled but CSP not explicitly configured. Default CSP may be too permissive for third-party scripts (Razorpay, Cloudinary).
- **Fix:** Add `helmet.contentSecurityPolicy({ directives: { ... } })` with explicit allowed origins.

---

## Prioritised Remediation Roadmap

### P0 — Immediate (do today)

| Finding | Action |
|---|---|
| NEW-1 | Rotate Resend API key |
| NEW-2 | Rotate Cloudinary API secret |
| NEW-7 | Remove `status` from order create body; hardcode `'CREATED'` |

### P1 — This sprint (HIGH severity)

| Finding | Action |
|---|---|
| CV-3 | Add startup guard validating `JWT_SECRET` length ≥ 32 |
| CV-13 | Use `crypto.timingSafeEqual` in both webhook signature checks |
| S-1/2/3 | Read seed passwords from env vars; add `NODE_ENV !== 'production'` guard |

### P2 — Next sprint (MEDIUM severity)

| Finding | Action |
|---|---|
| CV-7 / CF-2 | Delete legacy `routes/` directory and root `index.js` |
| CV-8 | Whitelist fields in `temple.create()` |
| CV-14 | Return generic error messages to clients in production |
| CV-4 | Fail fast if `FRONTEND_URL` unset in production |
| CF-1 | Fix `.env.example` to use placeholder DB credentials |
| NEW-5 | Migrate JWT storage from localStorage to httpOnly cookies |
| NEW-10 | Encrypt `contactEmail` and `contactMobile` at rest |

### P3 — Housekeeping (LOW severity)

| Finding | Action |
|---|---|
| CV-15 | Log failed auth attempts with email + IP |
| CV-17 | Increase min password length to 8 |
| CF-3 | Use `'combined'` Morgan format in production |
| NEW-6 | Add explicit CSP config to Helmet |
