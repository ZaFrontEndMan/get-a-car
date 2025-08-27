
-- Enable RLS on cars table if not already enabled
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all available cars
CREATE POLICY "Public can view all cars" 
ON public.cars 
FOR SELECT 
USING (true);

-- Enable RLS on vendors table if not already enabled  
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to vendors
CREATE POLICY "Public can view vendors"
ON public.vendors 
FOR SELECT 
USING (true);
