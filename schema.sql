-- ============================================================
-- St Michael Car Rentals — Supabase Schema
-- Run this in your Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
create table if not exists public.users (
  id        uuid references auth.users primary key,
  name      text not null,
  email     text not null,
  phone     text,
  role      text default 'customer' check (role in ('customer', 'admin', 'super_admin')),
  created_at timestamptz default now()
);

-- ============================================================
-- VEHICLES TABLE
-- ============================================================
create table if not exists public.vehicles (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  brand           text not null,
  model           text not null,
  year            integer,
  category        text check (category in ('Economy','Sedan','SUV','Luxury','Van')),
  price_per_day   numeric(10,2) not null,
  transmission    text check (transmission in ('Automatic','Manual')),
  fuel            text check (fuel in ('Petrol','Diesel','Electric','Hybrid')),
  seats           integer,
  doors           integer,
  air_conditioning boolean default true,
  luggage         integer,
  description     text,
  images          text[],
  availability    boolean default true,
  is_premium      boolean default false,
  created_at      timestamptz default now()
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  booking_reference     text unique not null,
  user_id               uuid references public.users(id),
  vehicle_id            uuid references public.vehicles(id),
  pickup_location       text not null,
  return_location       text not null,
  pickup_date           date not null,
  pickup_time           time not null,
  return_date           date not null,
  return_time           time not null,
  status                text default 'pending' check (status in ('pending','confirmed','active','completed','cancelled','rejected')),
  payment_status        text default 'unpaid' check (payment_status in ('unpaid','pending','paid','refunded')),
  subtotal              numeric(10,2),
  extras_total          numeric(10,2) default 0,
  taxes                 numeric(10,2),
  service_fee           numeric(10,2),
  total                 numeric(10,2),
  promo_code            text,
  discount              numeric(10,2) default 0,
  notes                 text,
  admin_notes           text,
  full_name             text not null,
  email                 text not null,
  phone                 text not null,
  country               text,
  company_name          text,
  driver_license_status text,
  driver_age            integer,
  additional_driver     boolean default false,
  additional_driver_name text,
  created_at            timestamptz default now()
);

-- Index for booking availability checks
create index if not exists idx_bookings_vehicle_dates
  on public.bookings (vehicle_id, pickup_date, return_date, status);

-- ============================================================
-- BOOKING EXTRAS TABLE
-- ============================================================
create table if not exists public.booking_extras (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  extra_name text not null,
  price      numeric(10,2) not null
);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id),
  vehicle_id  uuid references public.vehicles(id),
  booking_id  uuid references public.bookings(id),
  rating      integer check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now()
);

-- One review per booking per user
create unique index if not exists idx_reviews_booking_user
  on public.reviews (booking_id, user_id);

-- ============================================================
-- PROMO CODES TABLE
-- ============================================================
create table if not exists public.promo_codes (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  discount_type   text check (discount_type in ('percentage','fixed')),
  discount_value  numeric(10,2) not null,
  start_date      date,
  end_date        date,
  usage_limit     integer,
  used_count      integer default 0,
  minimum_amount  numeric(10,2) default 0,
  active          boolean default true,
  created_at      timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id),
  title       text not null,
  message     text not null,
  type        text,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- SITE SETTINGS TABLE
-- ============================================================
create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- ============================================================
-- TRIGGER: Auto-create user profile on auth signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

