-- Add new fields to vendors table for admin control
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_on_website boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS can_create_offers boolean DEFAULT true;

-- Update existing vendors to have default values
UPDATE public.vendors 
SET 
  is_active = true,
  show_on_website = true,
  can_create_offers = true
WHERE 
  is_active IS NULL 
  OR show_on_website IS NULL 
  OR can_create_offers IS NULL;