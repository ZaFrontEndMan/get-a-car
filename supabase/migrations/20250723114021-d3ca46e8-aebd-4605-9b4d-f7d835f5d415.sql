-- Add new columns to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS national_id TEXT,
ADD COLUMN IF NOT EXISTS national_id_front_image_url TEXT,
ADD COLUMN IF NOT EXISTS national_id_back_image_url TEXT,
ADD COLUMN IF NOT EXISTS license_id TEXT,
ADD COLUMN IF NOT EXISTS license_id_front_image_url TEXT,
ADD COLUMN IF NOT EXISTS license_id_back_image_url TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia',
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create countries table with cities
CREATE TABLE IF NOT EXISTS public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid REFERENCES public.countries(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on countries and cities tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to countries and cities
CREATE POLICY "Public can view active countries" 
ON public.countries 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active cities" 
ON public.cities 
FOR SELECT 
USING (is_active = true);

-- Admin policies for managing countries and cities
CREATE POLICY "Admins can manage countries" 
ON public.countries 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage cities" 
ON public.cities 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Insert Saudi Arabia and its major cities
INSERT INTO public.countries (name_en, name_ar, code) 
VALUES ('Saudi Arabia', 'المملكة العربية السعودية', 'SA');

-- Get the Saudi Arabia country ID and insert cities
WITH saudi_country AS (
  SELECT id FROM public.countries WHERE code = 'SA'
)
INSERT INTO public.cities (country_id, name_en, name_ar)
SELECT 
  saudi_country.id,
  city_data.name_en,
  city_data.name_ar
FROM saudi_country,
(VALUES 
  ('Riyadh', 'الرياض'),
  ('Jeddah', 'جدة'),
  ('Mecca', 'مكة المكرمة'),
  ('Medina', 'المدينة المنورة'),
  ('Dammam', 'الدمام'),
  ('Khobar', 'الخبر'),
  ('Dhahran', 'الظهران'),
  ('Tabuk', 'تبوك'),
  ('Buraidah', 'بريدة'),
  ('Khamis Mushait', 'خميس مشيط'),
  ('Hail', 'حائل'),
  ('Hafar Al-Batin', 'حفر الباطن'),
  ('Jubail', 'الجبيل'),
  ('Al Qatif', 'القطيف'),
  ('Abha', 'أبها'),
  ('Taif', 'الطائف'),
  ('Najran', 'نجران'),
  ('Yanbu', 'ينبع'),
  ('Al Kharj', 'الخرج'),
  ('Sakaka', 'سكاكا')
) AS city_data(name_en, name_ar);