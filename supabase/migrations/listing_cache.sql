-- =============================================================================
-- listing_cache — server-side snapshot of active MLS inventory
--
-- Run this once in the Supabase SQL editor:
--   Dashboard → SQL Editor → New query → paste → Run
--
-- Why: city pages loaded listings client-side, so AI crawlers (which don't run
-- JavaScript) saw zero homes. This table lets pages render real listings into
-- their HTML. A cron refreshes it hourly, so Bridge API cost is fixed per
-- interval instead of one call per visitor.
-- =============================================================================

create table if not exists public.listing_cache (
  listing_key text        not null,
  zip         text        not null,
  list_price  bigint      not null default 0,
  fetched_at  timestamptz not null default now(),
  payload     jsonb       not null,
  primary key (listing_key, zip)
);

-- The read path filters by zip + freshness and sorts by price
create index if not exists listing_cache_zip_fetched_idx
  on public.listing_cache (zip, fetched_at desc);

create index if not exists listing_cache_price_idx
  on public.listing_cache (list_price desc);

-- Row Level Security: only the service role touches this table. Pages read it
-- server-side through the admin client, never from the browser, so no public
-- policy is granted. MLS data must not be exposed as a raw public endpoint.
alter table public.listing_cache enable row level security;

comment on table public.listing_cache is
  'Hourly snapshot of active Stellar MLS listings by ZIP. Written by /api/cron/refresh-listings. Rows older than 12h are ignored at read time for IDX freshness compliance.';
