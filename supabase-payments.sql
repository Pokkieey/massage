-- Run once in the Supabase SQL editor. No anonymous access policies.
create table if not exists public.pos_gateway_payments (
 charge_id text primary key,
 job_id text not null,
 shop_id text not null,
 amount_satang bigint not null check (amount_satang >= 0),
 currency text not null default 'THB',
 status text not null,
 livemode boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.pos_gateway_payments enable row level security;
-- Only the server-side service role accesses this table.
