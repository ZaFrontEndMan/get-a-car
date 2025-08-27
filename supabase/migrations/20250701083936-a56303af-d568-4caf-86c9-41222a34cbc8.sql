
-- Add role column to profiles table with enum type
CREATE TYPE user_role AS ENUM ('admin', 'client', 'vendor');

-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'client';

-- Update existing admin profile
UPDATE profiles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'talalkhomri@gmail.com'
);

-- Create function to automatically set role based on user metadata during profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.email = 'talalkhomri@gmail.com' THEN 'admin'::user_role
      WHEN NEW.raw_user_meta_data->>'user_type' = 'vendor' THEN 'vendor'::user_role
      ELSE 'client'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
