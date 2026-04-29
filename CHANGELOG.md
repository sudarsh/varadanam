# Changelog

All notable changes to Varadanam will be documented here.
Format: `[version] - date` → bullet per feature/fix.

---

## [v0.1.0] - 2026-04-24

### Server
- JWT authentication for admin and super admin roles
- Temple CRUD with slug-based multi-tenant routing
- Offerings CRUD with Cloudinary image upload
- Orders — create, list, detail, multi-item support
- Devotees and Users CRUD with soft delete
- Categories system (DB-backed, replaces hardcoded enum)
- Email receipts via Resend
- Razorpay payment integration — initiate and verify payment
- Razorpay webhook handler for missed payments
- Encrypt Razorpay secrets at rest (AES-256-CBC)
- Rate limiting on auth endpoints
- Multi-tenant isolation across all admin controllers

### Admin app
- Login page with JWT auth
- Dashboard with revenue and order stats
- Offerings management (create, edit, deactivate, image upload)
- Orders list with status filter and detail view
- Devotees management with search
- Settings — general, timings, contact, banner, payment (Razorpay keys)
- Counter billing / POS screen
- Thermal receipt printing (80mm)

### User app
- Temple home page — hero, offerings grid, about section, timings, footer
- Booking flow — person details sheet, multiple sevas, basket
- Checkout with Razorpay payment modal
- Receipt page with email delivery
- Slug-based multi-tenant routing (VITE_TEMPLE_SLUG for local dev)

### Tests
- Playwright E2E tests — home, basket, checkout, receipt (POM pattern)
- GitHub Actions CI pipeline — smoke on PR, regression on push/nightly
