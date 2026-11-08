-- V12 pilot: server-only branch heartbeat storage.
create table if not exists public.pos_branch_heartbeats (
 shop_id text primary key,
 last_seen_at timestamptz not null default now(),
 app_version text not null default 'v12-pilot'
);
alter table public.pos_branch_heartbeats enable row level security;
-- Do not add anonymous read/write policies. Server-side service credential only.
