-- ============================================================
-- TripFlow CR — Supabase Schema
-- Run this entire file in the Supabase SQL editor against your project.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Profiles (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'tourist' check (role in ('tourist','provider','admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- Providers
-- ============================================================
create table public.providers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  business_name text not null,
  description text,
  contact_email text,
  phone text,
  verified boolean default false,
  created_at timestamptz default now()
);
alter table public.providers enable row level security;
create policy "Public can view providers"
  on public.providers for select using (true);
create policy "Providers manage own record"
  on public.providers for all using (auth.uid() = user_id);

-- ============================================================
-- Activities
-- ============================================================
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  location text,
  duration_minutes integer,
  category text,
  available boolean default true,
  images text[] default '{}',
  included text[] default '{}',
  requirements text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);
alter table public.activities enable row level security;
create policy "Public can view available activities"
  on public.activities for select using (available = true);
create policy "Providers manage own activities"
  on public.activities for all
  using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- ============================================================
-- Reviews
-- ============================================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);
alter table public.reviews enable row level security;
create policy "Public can view reviews"
  on public.reviews for select using (true);
create policy "Users can manage own reviews"
  on public.reviews for all using (auth.uid() = user_id);

-- ============================================================
-- Itineraries
-- ============================================================
create table public.itineraries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  preferences jsonb not null,
  days jsonb not null,
  total_cost numeric(10,2),
  created_at timestamptz default now()
);
alter table public.itineraries enable row level security;
create policy "Users manage own itineraries"
  on public.itineraries for all using (auth.uid() = user_id);

-- ============================================================
-- Bookings
-- ============================================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  activity_id uuid references public.activities(id) not null,
  itinerary_id uuid references public.itineraries(id),
  status text default 'pending'
    check (status in ('pending','confirmed','cancelled','completed')),
  date date not null,
  group_size integer default 1,
  total_price numeric(10,2) not null,
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);
alter table public.bookings enable row level security;
create policy "Users manage own bookings"
  on public.bookings for all using (auth.uid() = user_id);
create policy "Providers view bookings for their activities"
  on public.bookings for select
  using (activity_id in (
    select a.id from public.activities a
    join public.providers p on a.provider_id = p.id
    where p.user_id = auth.uid()
  ));

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
