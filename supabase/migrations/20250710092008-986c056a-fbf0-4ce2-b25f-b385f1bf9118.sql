
-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
  car_id UUID REFERENCES public.cars(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percentage NUMERIC(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS policies for blogs
CREATE POLICY "Public can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage blogs" 
  ON public.blogs 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  ));

-- Enable RLS for offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS policies for offers
CREATE POLICY "Public can view published offers" 
  ON public.offers 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Vendors can manage their offers" 
  ON public.offers 
  FOR ALL 
  USING (is_vendor_owner(vendor_id, auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX idx_offers_vendor_id ON public.offers(vendor_id);
CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_offers_valid_until ON public.offers(valid_until);
