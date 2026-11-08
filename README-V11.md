# Massage POS V11 — MULTI-SHOP TEST PILOT

## What works
- Independent Supabase state per configured shop ID; per-shop PIN checks on state APIs.
- Separate browser cache per shop; select.html login and admin.html shop listing.
- Omise TEST payments remain supported with ONE shared test merchant account; charge creation and status are checked against the shop ID.
- Existing checkout, queue, memberships, dashboard and receipt code preserved.

## Vercel environment setup
Keep OMISE_SECRET_KEY (skey_test_...), SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-only.
Add `POS_SHOPS_JSON` (secret), e.g.:
`[{"id":"pilot-shop","name":"Original Pilot","pin":"CHANGE-TO-A-STRONG-PIN"},{"id":"shop-two","name":"Second Demo","pin":"CHANGE-TO-ANOTHER-STRONG-PIN"}]`
Add `POS_ADMIN_PIN` (secret): a unique random string of at least 12 characters.
Redeploy. Visit `/select.html`, enter shop ID and corresponding PIN. Visit `/admin.html` to list configured shops.
No additional SQL is required if V10 pos_shop_state exists. Existing pilot-shop data is retained.

## IMPORTANT LIMITATIONS — NOT PRODUCTION READY
- Shared shop PIN is a pilot access mechanism, NOT individual staff authentication or true multi-tenant production security. Shop PINs reside in browser session storage and can be shared; use Supabase Auth + roles + RLS before launch.
- Existing slip uploads use a public bucket and hard-coded pilot folder; slips are NOT tenant isolated. Disable slip upload for real shops until private storage and signed URLs are implemented.
- Omise uses ONE shared test merchant account, not separate merchant accounts per shop. Never use live keys in this version.
- The entire shop state is stored as a single JSON document; concurrent edits can conflict and require reload. Migrate to normalized relational tables and transactional writes.
- Platform admin currently lists configured shops; it does NOT yet create shops, show cross-shop sales, manage accounts or bill customers.
- New shops start with the same demo seed state from the app. Do not treat demo data as real transactions.
- The webhook verifies charge state via Omise API, but webhook authenticity and replay controls still require hardening for production.
- Do not store actual personal information, process real payments, or deploy this publicly as a commercial service.
