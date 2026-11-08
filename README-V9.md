# Massage POS V9 — Omise PromptPay TEST prototype

## Deploy
1. Run `supabase-payments.sql` in your Supabase project's SQL editor.
2. In the **massage-pos** Vercel project, set server-side **Secret** environment variables:
   - `OMISE_SECRET_KEY` = Omise `skey_test_...` (already entered by you; confirm deployment scope)
   - `POS_TEST_PIN` = a long random pilot password used by the POS test screen
   - `SUPABASE_URL` = your project's Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase server-side service-role key (NEVER put this in browser code)
3. Deploy the folder contents (including `api/`) via GitHub/Vercel. Redeploy after changing variables.
4. In Omise **test mode**, enable PromptPay with Omise support if not enabled. Set webhook URL to `https://YOUR-MASSAGE-POS-DOMAIN/api/omise-webhook`.
5. Open checkout → QR → create QR. On Omise test dashboard → Charges → select charge → Actions → mark successful. The POS polls every 3.5 seconds and finalizes locally after independently verifying the charge.

## IMPORTANT LIMITATIONS — NOT PRODUCTION READY
- This is **test-only**; endpoints explicitly reject live Omise keys. No real payments.
- POS jobs, staff, memberships, cash, and sales **still live in localStorage**, not Supabase. Gateway payment records alone are centralized in `pos_gateway_payments`. Do not use on multiple devices or for real sales.
- The no-login POS has no trustworthy user/shop authentication. A shared test PIN is only a temporary test gate. A malicious staff/browser can alter checkout totals. Do NOT accept live payments before adding authentication, per-shop authorization, server-calculated order totals, idempotent settlement, and proper central order ledger.
- If the browser closes after Omise payment succeeds, the gateway record persists, but local POS sale may remain unfinalized. Reconciliation and order recovery are required before live use.
- Each shop must eventually have its own Omise merchant account/keys and server-side shop mapping.
- Payment amounts include QR-paid tips only; cash tips remain separate. Test that membership/discount changes are blocked after QR creation.
- Webhook events are treated as untrusted hints: the backend retrieves charge status directly from Omise before recording it. The endpoint is public, so configure network/rate controls and monitoring for production.
