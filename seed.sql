-- ============================================================
-- St Michael Car Rentals — Seed Data
-- Run this AFTER schema.sql and rls.sql
-- ============================================================

-- ============================================================
-- SITE SETTINGS
-- ============================================================
insert into public.site_settings (key, value) values
  ('business_name', 'St Michael Car Rentals'),
  ('business_phone', '+233 24 000 0000'),
  ('business_email', 'info@stmichaelcarrentals.com'),
  ('business_whatsapp', '+233240000000'),
  ('business_address', 'East Legon, Accra, Ghana'),
  ('tax_rate', '10'),
  ('service_fee', '5'),
  ('deposit_amount', '500'),
  ('happy_customers', '150'),
  ('vehicles_count', '22'),
  ('min_rental_days', '1'),
  ('max_rental_days', '30'),
  ('cancellation_hours', '24'),
  ('facebook_url', 'https://facebook.com/stmichaelcarrentals'),
  ('instagram_url', 'https://instagram.com/stmichaelcarrentals'),
  ('twitter_url', 'https://x.com/stmichaelcars')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ============================================================
-- VEHICLES (8-10 sample vehicles with realistic GH pricing)
-- ============================================================
insert into public.vehicles (name, brand, model, year, category, price_per_day, transmission, fuel, seats, doors, air_conditioning, luggage, description, images, availability, is_premium)
values
  (
    'Toyota Corolla 2022',
    'Toyota', 'Corolla', 2022, 'Sedan', 180.00,
    'Automatic', 'Petrol', 5, 4, true, 2,
    'A reliable and fuel-efficient sedan perfect for city driving and business travel. Comfortable, well-maintained, and equipped with modern features.',
    ARRAY[
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
    ],
    true, false
  ),
  (
    'Honda CR-V 2023',
    'Honda', 'CR-V', 2023, 'SUV', 320.00,
    'Automatic', 'Petrol', 5, 4, true, 3,
    'A versatile SUV with excellent ground clearance, perfect for navigating Ghana''s varied terrain with comfort and confidence.',
    ARRAY[
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    ],
    true, false
  ),
  (
    'Mercedes-Benz C-Class 2023',
    'Mercedes-Benz', 'C-Class', 2023, 'Luxury', 750.00,
    'Automatic', 'Petrol', 5, 4, true, 2,
    'Experience true luxury in this stunning Mercedes-Benz C-Class. Perfect for executives, VIPs, and special occasions that demand the finest.',
    ARRAY[
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80'
    ],
    true, true
  ),
  (
    'Toyota Hiace Van 2022',
    'Toyota', 'Hiace', 2022, 'Van', 450.00,
    'Manual', 'Diesel', 12, 4, true, 6,
    'Spacious 12-seater minibus ideal for group travel, airport shuttles, tours, and corporate transport across Ghana.',
    ARRAY[
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&q=80'
    ],
    true, false
  ),
  (
    'Toyota Fortuner 2023',
    'Toyota', 'Fortuner', 2023, 'SUV', 480.00,
    'Automatic', 'Diesel', 7, 4, true, 4,
    'The ultimate 4WD SUV for Ghana. Handles rough terrain with ease while delivering luxury interior comfort for all 7 passengers.',
    ARRAY[
      'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&q=80',
      'https://images.unsplash.com/photo-1568844293986-ca9c5ad34d86?w=800&q=80'
    ],
    true, true
  ),
  (
    'Hyundai Elantra 2023',
    'Hyundai', 'Elantra', 2023, 'Economy', 150.00,
    'Automatic', 'Petrol', 5, 4, true, 2,
    'An economical and stylish choice for budget-conscious travelers who don''t want to compromise on comfort and modern features.',
    ARRAY[
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80'
    ],
    true, false
  ),
  (
    'BMW X5 2022',
    'BMW', 'X5', 2022, 'Luxury', 800.00,
    'Automatic', 'Petrol', 5, 4, true, 3,
    'The BMW X5 combines powerful performance with premium luxury. Commanding presence, cutting-edge technology, and effortless comfort.',
    ARRAY[
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1619362280286-4e25a7df9e41?w=800&q=80'
    ],
    true, true
  ),
  (
    'Kia Sportage 2023',
    'Kia', 'Sportage', 2023, 'SUV', 280.00,
    'Automatic', 'Petrol', 5, 4, true, 3,
    'A modern, feature-packed SUV with excellent fuel economy. Great for both city exploration and out-of-town adventures.',
    ARRAY[
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80'
    ],
    true, false
  ),
  (
    'Toyota Land Cruiser 200 2021',
    'Toyota', 'Land Cruiser', 2021, 'Luxury', 650.00,
    'Automatic', 'Diesel', 8, 4, true, 5,
    'The legendary Land Cruiser — unmatched off-road capability combined with first-class cabin luxury. Ghana''s preferred SUV for serious terrain.',
    ARRAY[
      'https://images.unsplash.com/photo-1568844293986-ca9c5ad34d86?w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    ],
    true, true
  ),
  (
    'Nissan Sentra 2023',
    'Nissan', 'Sentra', 2023, 'Economy', 160.00,
    'Automatic', 'Petrol', 5, 4, true, 2,
    'Practical, fuel-efficient, and reliable. The Nissan Sentra is ideal for daily commutes, business travel, and short trips around Accra.',
    ARRAY[
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
    ],
    true, false
  );

-- ============================================================
-- PROMO CODES (4 sample codes for testing)
-- ============================================================
insert into public.promo_codes (code, discount_type, discount_value, start_date, end_date, usage_limit, used_count, minimum_amount, active)
values
  ('WELCOME20', 'percentage', 20.00, '2026-01-01', '2026-12-31', 100, 0, 200.00, true),
  ('SAVE50', 'fixed', 50.00, '2026-01-01', '2026-12-31', 50, 0, 300.00, true),
  ('LUXURY15', 'percentage', 15.00, '2026-06-01', '2026-12-31', 30, 0, 500.00, true),
  ('TESTCODE', 'fixed', 10.00, '2026-01-01', '2026-12-31', null, 0, 0.00, true);

