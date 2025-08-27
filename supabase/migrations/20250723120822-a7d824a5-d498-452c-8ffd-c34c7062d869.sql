
-- Update profiles table to add gender and improve client fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id),
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id);

-- Update vendors table to replace website with gender
ALTER TABLE vendors 
DROP COLUMN IF EXISTS website,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Create clients table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  gender text CHECK (gender IN ('male', 'female')),
  country_id uuid REFERENCES countries(id),
  city_id uuid REFERENCES cities(id),
  date_of_birth date,
  national_id text,
  driver_license_number text,
  national_id_front_image_url text,
  national_id_back_image_url text,
  driving_license_front_image_url text,
  driving_license_back_image_url text,
  address text,
  avatar_url text,
  total_bookings integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_booking_date timestamp with time zone,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can view their own client record" 
ON clients FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own client record" 
ON clients FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own client record" 
ON clients FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all clients" 
ON clients FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
));

-- Update the handle_new_user function to include new fields
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

-- Update the handle_client_creation function
CREATE OR REPLACE FUNCTION public.handle_client_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user has client role and email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL 
     AND OLD.email_confirmed_at IS NULL 
     AND EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE user_id = NEW.id AND role = 'client'
     ) THEN
    
    -- Get profile data and create client record
    INSERT INTO public.clients (
      user_id,
      name,
      email,
      phone,
      gender,
      country_id,
      city_id,
      date_of_birth,
      national_id,
      driver_license_number,
      national_id_front_image_url,
      national_id_back_image_url,
      driving_license_front_image_url,
      driving_license_back_image_url,
      address,
      avatar_url
    )
    SELECT 
      p.user_id,
      COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, ''),
      NEW.email,
      p.phone,
      NEW.raw_user_meta_data->>'gender',
      p.country_id,
      p.city_id,
      p.date_of_birth,
      NEW.raw_user_meta_data->>'national_id',
      p.driver_license_number,
      NEW.raw_user_meta_data->>'national_id_front_image_url',
      NEW.raw_user_meta_data->>'national_id_back_image_url',
      NEW.raw_user_meta_data->>'driving_license_front_image_url',
      NEW.raw_user_meta_data->>'driving_license_back_image_url',
      p.address,
      p.avatar_url
    FROM public.profiles p
    WHERE p.user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for client creation
DROP TRIGGER IF EXISTS on_auth_user_created_client ON auth.users;
CREATE TRIGGER on_auth_user_created_client
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_client_creation();
