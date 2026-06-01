-- =============================================================================
-- nowtb-next database schema
-- Tables: profiles, favorites, saved_searches, search_alerts
-- =============================================================================

-- Profiles — extends Supabase auth.users with display info
-- Auto-created when a user signs up via trigger
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'client',  -- 'client' or 'agent'
  fub_person_id integer,                -- Follow Up Boss person ID for syncing
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security so clients can only see their own data
alter table public.profiles enable row level security;

-- Clients can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Agents (Barrett) can see all profiles
create policy "Agents can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'agent'
    )
  );

-- Favorites — listings a client saved/hearted
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  listing_key text not null,            -- Bridge API ListingKey
  listing_data jsonb,                   -- Snapshot of listing at time of save (address, price, etc.)
  created_at timestamptz not null default now(),
  unique(user_id, listing_key)          -- Can't favorite the same listing twice
);

alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Agents can see all favorites (so Barrett can see what clients like)
create policy "Agents can view all favorites"
  on public.favorites for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'agent'
    )
  );

-- Saved Searches — search criteria that auto-run and email new matches
create table if not exists public.saved_searches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  created_by uuid references public.profiles,  -- Who created it (agent or self)
  name text not null,                    -- "Valrico Homes Under $400K"
  -- Search filters (match Bridge API query params)
  city text,
  zip text,
  min_price integer,
  max_price integer,
  beds integer,
  baths integer,
  property_type text,                    -- Residential, Land, etc.
  property_sub_type text,                -- Single Family, Condo, etc.
  status text not null default 'Active', -- MLS status to match
  -- Alert settings
  frequency text not null default 'daily',  -- 'instant', 'daily', 'weekly'
  is_active boolean not null default true,
  last_run_at timestamptz,               -- When we last checked for new listings
  last_sent_at timestamptz,              -- When we last emailed the client
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.saved_searches enable row level security;

create policy "Users can view own searches"
  on public.saved_searches for select
  using (auth.uid() = user_id);

create policy "Users can create own searches"
  on public.saved_searches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own searches"
  on public.saved_searches for update
  using (auth.uid() = user_id);

create policy "Users can delete own searches"
  on public.saved_searches for delete
  using (auth.uid() = user_id);

-- Agents can manage all saved searches (create for clients, etc.)
create policy "Agents can view all searches"
  on public.saved_searches for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'agent'
    )
  );

create policy "Agents can create searches for clients"
  on public.saved_searches for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'agent'
    )
  );

create policy "Agents can update any search"
  on public.saved_searches for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'agent'
    )
  );

-- Search Alerts — log of emails sent for saved searches
create table if not exists public.search_alerts (
  id uuid default gen_random_uuid() primary key,
  saved_search_id uuid references public.saved_searches on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  listings_count integer not null default 0,
  listing_keys text[] not null default '{}',  -- Which listings were included
  sent_at timestamptz not null default now()
);

alter table public.search_alerts enable row level security;

create policy "Users can view own alerts"
  on public.search_alerts for select
  using (auth.uid() = user_id);

-- Trigger: auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
