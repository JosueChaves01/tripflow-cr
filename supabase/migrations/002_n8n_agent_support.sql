-- ============================================================
-- TripFlow CR — Hotels, Restaurants, and Execution Logs
-- Run this after schema.sql to support the n8n AI Agent workflow.
-- ============================================================

-- Hotels table
create table if not exists public.hotels (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  name text not null,
  description text,
  price_per_night numeric(10,2) not null,
  location text,
  stars integer check (stars >= 1 and stars <= 5),
  category text,
  available boolean default true,
  images text[] default '{}',
  amenities text[] default '{}',
  policies text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);
alter table public.hotels enable row level security;
create policy "Public can view available hotels"
  on public.hotels for select using (available = true);
create policy "Providers manage own hotels"
  on public.hotels for all
  using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- Restaurants table
create table if not exists public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  name text not null,
  description text,
  price_range text check (price_range in ('budget', 'moderate', 'expensive', 'luxury')),
  location text,
  cuisine text,
  category text,
  available boolean default true,
  images text[] default '{}',
  specialties text[] default '{}',
  schedule text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);
alter table public.restaurants enable row level security;
create policy "Public can view available restaurants"
  on public.restaurants for select using (available = true);
create policy "Providers manage own restaurants"
  on public.restaurants for all
  using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- Execution logs table for n8n workflow monitoring
create table if not exists public.execution_logs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id text not null,
  run_id text,
  timestamp timestamptz default now(),
  user_id uuid,
  input_summary text,
  output_summary text,
  status text check (status in ('success', 'error', 'partial')),
  action text,
  error_message text,
  duration_ms numeric
);
alter table public.execution_logs enable row level security;
create policy "Public can view execution logs"
  on public.execution_logs for select using (true);
create policy "System can insert execution logs"
  on public.execution_logs for insert with check (true);