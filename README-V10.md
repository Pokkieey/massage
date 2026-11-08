# Massage POS V10 — Cloud Pilot (TEST ONLY)

## What changed
- Added `api/pos-state.js`: server-side Supabase JSON state with optimistic revision checks.
- Added `supabase-v10.sql` to create `pos_shop_state` with RLS enabled.
- On opening POS, pilot shop data loads from Supabase. Existing local demo data is imported **only if the cloud record does not yet exist**.
- Changes are queued to Supabase; conflicting writes stop sync instead of silently overwriting another device.
- Existing Omise PromptPay test API, webhook, POS UI, memberships, queues, receipts, and commissions remain.

## Deploy
1. Run `supabase-v10.sql` in the **correct** Supabase project SQL editor.
2. Upload all V10 files including the `api` folder to the root of the existing GitHub repo.
3. Keep existing Vercel environment variables: `OMISE_SECRET_KEY` (test), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `POS_TEST_PIN`.
4. Redeploy in Vercel. Refresh the site. Enter the test PIN when prompted.
5. Confirm the status shows `Cloud synced (pilot)` and `pos_shop_state` has one `pilot-shop` row.
6. Use a **second device** to confirm state loads. Avoid simultaneous edits during this pilot.

## Important limitations — NOT production-ready
- This is a single-shop **test pilot**, NOT secure multi-shop SaaS. Shared test PIN is not per-user authentication, authorization, or tenant isolation.
- The POS still maintains a local copy; cloud writes are asynchronous. A device can show a change before cloud persistence succeeds. Never use this for live transactions.
- Optimistic revision checks prevent silent overwrites but do not merge concurrent edits. Two devices editing simultaneously can trigger a conflict; reload and reconcile manually.
- Omise remains test-only; webhook signature validation, replay protection, authorization of payment records, idempotent checkout and refunds require a production security review.
- Existing slip bucket access and owner UI also require proper access controls.
- This version does NOT implement per-merchant gateway accounts, online booking, or production-ready multi-shop access.
- Never upload keys or real customer data to this demo.
