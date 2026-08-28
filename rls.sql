-- ============================================================
-- St Michael Car Rentals — Row Level Security Policies
-- Run this AFTER schema.sql in your Supabase SQL Editor
-- ============================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_extras enable row level security;
alter table public.reviews enable row level security;
alter table public.promo_codes enable row level security;
alter table public.notifications enable row level security;
alter table public.site_settings enable row level security;

-- ============================================================
-- Helper: is_admin()
-- ============================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
$$ language sql security definer stable;

-- ============================================================
-- USERS policies
-- ============================================================
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

-- ============================================================
-- VEHICLES policies
-- ============================================================
drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read"
  on public.vehicles for select
  using (true);

drop policy if exists "vehicles_admin_insert" on public.vehicles;
create policy "vehicles_admin_insert"
  on public.vehicles for insert
  with check (public.is_admin());

drop policy if exists "vehicles_admin_update" on public.vehicles;
create policy "vehicles_admin_update"
  on public.vehicles for update
  using (public.is_admin());

drop policy if exists "vehicles_admin_delete" on public.vehicles;
create policy "vehicles_admin_delete"
  on public.vehicles for delete
  using (public.is_admin());

-- ============================================================
-- BOOKINGS policies
-- ============================================================
drop policy if exists "bookings_customer_select" on public.bookings;
create policy "bookings_customer_select"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_customer_insert" on public.bookings;
create policy "bookings_customer_insert"
  on public.bookings for insert
  with check (auth.uid() = user_id);

drop policy if exists "bookings_customer_update_own" on public.bookings;
create policy "bookings_customer_update_own"
  on public.bookings for update
  using (
    (auth.uid() = user_id and status = 'pending')
    or public.is_admin()
  );

-- ============================================================
-- BOOKING EXTRAS policies
-- ============================================================
drop policy if exists "booking_extras_select" on public.booking_extras;
create policy "booking_extras_select"
  on public.booking_extras for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "booking_extras_insert" on public.booking_extras;
create policy "booking_extras_insert"
  on public.booking_extras for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.user_id = auth.uid() or public.is_admin())
    )
  );

-- ============================================================
-- REVIEWS policies
-- ============================================================
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
  on public.reviews for select
  using (true);

drop policy if exists "reviews_auth_insert" on public.reviews;
create policy "reviews_auth_insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete"
  on public.reviews for delete
  using (public.is_admin());

-- ============================================================
-- PROMO CODES policies
-- ============================================================
drop policy if exists "promo_codes_auth_read" on public.promo_codes;
create policy "promo_codes_auth_read"
  on public.promo_codes for select
  using (active = true or public.is_admin());

drop policy if exists "promo_codes_admin_all" on public.promo_codes;
create policy "promo_codes_admin_all"
  on public.promo_codes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- NOTIFICATIONS policies
-- ============================================================
drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own"
  on public.notifications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert"
  on public.notifications for insert
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- SITE SETTINGS policies
-- ============================================================
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

