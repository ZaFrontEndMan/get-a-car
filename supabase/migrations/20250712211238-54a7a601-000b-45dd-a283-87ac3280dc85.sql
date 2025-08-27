-- Insert missing profile for the vendor user
INSERT INTO public.profiles (user_id, role, first_name, last_name, phone) 
VALUES (
  '5d7c63cc-3ea3-4e52-bce7-e27ce1afcc94',
  'vendor',
  'Getcar',
  'Vendor',
  '01007419344'
);