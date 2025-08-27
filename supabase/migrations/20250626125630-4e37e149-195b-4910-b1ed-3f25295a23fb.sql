
-- Temporarily make user_id nullable in vendors table (if not already done)
ALTER TABLE public.vendors ALTER COLUMN user_id DROP NOT NULL;

-- Insert default vendor
INSERT INTO public.vendors (
  id,
  name,
  email,
  phone,
  description,
  location,
  website,
  verified,
  rating,
  total_reviews,
  user_id
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Premium Car Rentals',
  'admin@premiumcars.com',
  '+966501234567',
  'Leading car rental service in Saudi Arabia with premium vehicles and excellent customer service.',
  'Riyadh, Saudi Arabia',
  'https://premiumcars.com',
  true,
  4.8,
  156,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert default branches
INSERT INTO public.branches (
  id,
  vendor_id,
  name,
  address,
  city,
  phone,
  email,
  manager_name,
  is_active
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'Riyadh Main Branch',
  'King Fahd Road, Al Olaya District',
  'Riyadh',
  '+966501234567',
  'riyadh@premiumcars.com',
  'Ahmed Al-Rashid',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  'Airport Branch',
  'King Khalid International Airport',
  'Riyadh',
  '+966501234568',
  'airport@premiumcars.com',
  'Sara Al-Mahmoud',
  true
) ON CONFLICT (id) DO NOTHING;

-- Insert default cars
INSERT INTO public.cars (
  id,
  vendor_id,
  branch_id,
  name,
  brand,
  model,
  year,
  type,
  fuel_type,
  transmission,
  seats,
  color,
  license_plate,
  daily_rate,
  weekly_rate,
  monthly_rate,
  deposit_amount,
  mileage_limit,
  is_available,
  is_featured,
  condition
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Toyota Camry 2024',
  'Toyota',
  'Camry',
  2024,
  'sedan',
  'hybrid',
  'automatic',
  5,
  'White',
  'RUH-123',
  150.00,
  900.00,
  3500.00,
  500.00,
  300,
  true,
  true,
  'excellent'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'BMW X5 2023',
  'BMW',
  'X5',
  2023,
  'suv',
  'petrol',
  'automatic',
  7,
  'Black',
  'RUH-456',
  350.00,
  2100.00,
  8000.00,
  1000.00,
  250,
  true,
  true,
  'excellent'
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440003',
  'Hyundai Elantra 2024',
  'Hyundai',
  'Elantra',
  2024,
  'sedan',
  'petrol',
  'automatic',
  5,
  'Silver',
  'RUH-789',
  120.00,
  720.00,
  2800.00,
  400.00,
  350,
  true,
  false,
  'excellent'
) ON CONFLICT (id) DO NOTHING;
