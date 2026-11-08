-- V13 PILOT: run in existing Supabase SQL editor. No existing POS tables are dropped.
create table if not exists public.pos_businesses (
 id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 90),
 active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.pos_managed_branches (
 id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
 business_id uuid not null references public.pos_businesses(id),
 name text not null, shop_name text not null,
 plan text not null default 'standard' check (plan in ('standard','professional')),
 active boolean not null default true,
 pin_hash text not null check (char_length(pin_hash)=64),
 created_at timestamptz not null default now()
);
create index if not exists pos_managed_branches_business_idx on public.pos_managed_branches(business_id);
alter table public.pos_businesses enable row level security;
alter table public.pos_managed_branches enable row level security;
-- No anon/authenticated policies: service role via server API only.
