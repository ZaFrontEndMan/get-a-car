-- Create missing profile for the vendor user
INSERT INTO public.profiles (user_id, first_name, last_name, phone, role)
VALUES (
  '1c180d8b-620b-4ab7-878e-62c1094bed47',
  'Mohamed',
  'Khan',
  '+20700003484',
  'vendor'::user_role
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;