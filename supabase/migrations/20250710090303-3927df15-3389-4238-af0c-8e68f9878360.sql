
-- Create admin_settings table to store site configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'GetCar Rental',
  site_description TEXT DEFAULT 'Premium car rental service in Saudi Arabia',
  contact_email TEXT DEFAULT 'info@getcar.sa',
  support_phone TEXT DEFAULT '+966 11 123 4567',
  address TEXT DEFAULT '123 King Fahd Road, Riyadh, Saudi Arabia',
  city TEXT DEFAULT 'Riyadh',
  country TEXT DEFAULT 'Saudi Arabia',
  website TEXT DEFAULT 'https://getcar.sa',
  facebook_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view settings
CREATE POLICY "Admins can view admin settings" 
  ON public.admin_settings 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Create policy for admins to update settings
CREATE POLICY "Admins can update admin settings" 
  ON public.admin_settings 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Create policy for admins to insert settings
CREATE POLICY "Admins can insert admin settings" 
  ON public.admin_settings 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Create policy for public read access (so frontend can display contact info)
CREATE POLICY "Public can view admin settings" 
  ON public.admin_settings 
  FOR SELECT 
  USING (true);

-- Insert default settings row
INSERT INTO public.admin_settings (
  site_name,
  site_description,
  contact_email,
  support_phone,
  address,
  city,
  country,
  website
) VALUES (
  'GetCar Rental',
  'Premium car rental service in Saudi Arabia',
  'info@getcar.sa',
  '+966 11 123 4567',
  '123 King Fahd Road, Riyadh, Saudi Arabia',
  'Riyadh',
  'Saudi Arabia',
  'https://getcar.sa'
);
