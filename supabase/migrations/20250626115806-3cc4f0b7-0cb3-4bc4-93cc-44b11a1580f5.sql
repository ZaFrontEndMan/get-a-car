
-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  logo_url TEXT,
  description TEXT,
  location TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  manager_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL, -- sedan, suv, hatchback, etc
  fuel_type TEXT NOT NULL, -- petrol, diesel, electric, hybrid
  transmission TEXT NOT NULL, -- manual, automatic
  seats INTEGER NOT NULL,
  color TEXT,
  license_plate TEXT UNIQUE,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  mileage_limit INTEGER, -- km per day
  features TEXT[], -- array of features
  images TEXT[], -- array of image URLs
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  condition TEXT DEFAULT 'excellent', -- excellent, good, fair
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  car_id UUID REFERENCES public.cars(id) NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
  customer_id UUID REFERENCES auth.users NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  return_location TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  additional_services JSONB DEFAULT '[]',
  service_fees DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_paid DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending', -- pending, partial, paid, refunded
  booking_status TEXT DEFAULT 'pending', -- pending, confirmed, active, completed, cancelled
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_users table for managing vendor staff
CREATE TABLE public.vendor_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff', -- owner, manager, staff
  permissions JSONB DEFAULT '[]', -- array of permissions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors table
CREATE POLICY "Vendors can view their own data" ON public.vendors
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = vendors.id AND user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can create vendor profiles" ON public.vendors
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Vendors can update their own data" ON public.vendors
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = vendors.id AND user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true)
  );

-- RLS Policies for branches table
CREATE POLICY "Vendor staff can view branches" ON public.branches
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = branches.vendor_id AND user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Vendor managers can manage branches" ON public.branches
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = branches.vendor_id AND user_id = auth.uid() AND role IN ('owner', 'manager') AND is_active = true)
  );

-- RLS Policies for cars table
CREATE POLICY "Vendor staff can view cars" ON public.cars
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = cars.vendor_id AND user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Vendor staff can manage cars" ON public.cars
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = cars.vendor_id AND user_id = auth.uid() AND is_active = true)
  );

-- RLS Policies for bookings table
CREATE POLICY "Vendor staff can view bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = bookings.vendor_id AND user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Vendor staff can update bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = bookings.vendor_id AND user_id = auth.uid() AND is_active = true)
  );

-- RLS Policies for vendor_users table
CREATE POLICY "Vendor owners can manage users" ON public.vendor_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendor_users vu WHERE vu.vendor_id = vendor_users.vendor_id AND vu.user_id = auth.uid() AND vu.role = 'owner' AND vu.is_active = true)
  );

CREATE POLICY "Users can view their own vendor associations" ON public.vendor_users
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX idx_branches_vendor_id ON public.branches(vendor_id);
CREATE INDEX idx_cars_vendor_id ON public.cars(vendor_id);
CREATE INDEX idx_cars_branch_id ON public.cars(branch_id);
CREATE INDEX idx_bookings_vendor_id ON public.bookings(vendor_id);
CREATE INDEX idx_bookings_car_id ON public.bookings(car_id);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_vendor_users_vendor_id ON public.vendor_users(vendor_id);
CREATE INDEX idx_vendor_users_user_id ON public.vendor_users(user_id);

-- Create function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'GC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking numbers
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_number();
