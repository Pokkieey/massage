-- Run in Supabase SQL Editor for V10 pilot cloud state.
-- All access is server-side only. No anon/authenticated policies are added.
create table if not exists public.pos_shop_state (
  shop_id text primary key,
  revision bigint not null default 0 check (revision >= 0),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.pos_shop_state enable row level security;
-- The service role bypasses RLS. Never expose service role credentials to the browser.
