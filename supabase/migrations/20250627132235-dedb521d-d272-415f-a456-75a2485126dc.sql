
-- Create additional_services table
CREATE TABLE public.additional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default additional services
INSERT INTO public.additional_services (name, description, price, category) VALUES
('Full Insurance', 'Comprehensive insurance coverage for your rental', 50, 'insurance'),
('GPS Navigation', 'Built-in GPS navigation system', 25, 'electronics'),
('Personal Driver', 'Professional driver service', 200, 'service'),
('Car Delivery', 'We deliver the car to your location', 75, 'service'),
('Child Seat', 'Safety child seat installation', 30, 'safety'),
('WiFi Hotspot', 'Mobile WiFi hotspot device', 15, 'electronics');

-- Create car_additional_services junction table to link cars with their available services
CREATE TABLE public.car_additional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL,
  service_id UUID NOT NULL,
  custom_price NUMERIC, -- Optional custom price for this car-service combination
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(car_id, service_id)
);

-- Add some sample data linking cars to services (you can modify this based on your needs)
INSERT INTO public.car_additional_services (car_id, service_id)
SELECT 
  c.id as car_id,
  s.id as service_id
FROM public.cars c
CROSS JOIN public.additional_services s
WHERE c.id = '74494b63-be75-44d5-aa33-facddf34dac7'
AND s.name IN ('Full Insurance', 'GPS Navigation', 'Personal Driver', 'Car Delivery');

-- Enable RLS for security
ALTER TABLE public.additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_additional_services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since these are general services)
CREATE POLICY "Everyone can view additional services" 
  ON public.additional_services 
  FOR SELECT 
  USING (true);

CREATE POLICY "Everyone can view car additional services" 
  ON public.car_additional_services 
  FOR SELECT 
  USING (true);
