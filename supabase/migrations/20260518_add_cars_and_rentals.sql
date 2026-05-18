-- Migration: add cars and car_rentals tables
-- Created: 2026-05-18

create extension if not exists "uuid-ossp";

-- ============================================================
-- Cars
-- ============================================================
create table if not exists public.cars (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  make text,
  model text,
  year integer,
  seats integer,
  transmission text,
  price_per_day numeric(10,2) not null,
  location text,
  available boolean default true,
  images text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);

alter table public.cars enable row level security;
create policy "Public can view available cars"
  on public.cars for select using (available = true);
create policy "Providers manage own cars"
  on public.cars for all using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- ============================================================
-- Car rentals
-- ============================================================
create table if not exists public.car_rentals (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  total_price numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

alter table public.car_rentals enable row level security;
create policy "Users manage own car rentals"
  on public.car_rentals for all using (auth.uid() = user_id);
create policy "Providers view rentals for their cars"
  on public.car_rentals for select using (car_id in (
    select id from public.cars where provider_id in (
      select id from public.providers where user_id = auth.uid()
    )
  ));
