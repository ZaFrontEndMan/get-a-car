-- Create clients table similar to vendors table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  date_of_birth DATE,
  driver_license_number TEXT,
  avatar_url TEXT,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  last_booking_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own client record" 
  ON public.clients 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own client record" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own client record" 
  ON public.clients 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all clients" 
  ON public.clients 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically create client record when a user with 'client' role is created
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
    
    -- Get profile data
    INSERT INTO public.clients (
      user_id,
      name,
      email,
      phone,
      address,
      city,
      date_of_birth,
      driver_license_number,
      avatar_url
    )
    SELECT 
      p.user_id,
      COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, ''),
      NEW.email,
      p.phone,
      p.address,
      p.city,
      p.date_of_birth,
      p.driver_license_number,
      p.avatar_url
    FROM public.profiles p
    WHERE p.user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_client_created
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_client_creation();

-- Migrate existing client profiles to clients table
INSERT INTO public.clients (
  user_id,
  name,
  email,
  phone,
  address,
  city,
  date_of_birth,
  driver_license_number,
  avatar_url,
  created_at
)
SELECT 
  p.user_id,
  COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, ''),
  'Email pending', -- Will be updated when we get actual emails
  p.phone,
  p.address,
  p.city,
  p.date_of_birth,
  p.driver_license_number,
  p.avatar_url,
  p.created_at
FROM public.profiles p
WHERE p.role = 'client'
ON CONFLICT (user_id) DO NOTHING;

-- Create a function to get clients data properly
CREATE OR REPLACE FUNCTION public.get_clients_data()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  totalBookings BIGINT,
  totalSpent NUMERIC,
  lastBooking TIMESTAMP WITH TIME ZONE,
  status TEXT,
  joinedDate TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    c.user_id as id,
    c.name,
    c.email,
    c.phone,
    COALESCE(b.booking_count, 0) as totalBookings,
    COALESCE(b.total_spent, 0) as totalSpent,
    b.last_booking as lastBooking,
    c.status,
    c.created_at as joinedDate
  FROM public.clients c
  LEFT JOIN (
    SELECT 
      customer_id,
      COUNT(*) as booking_count,
      SUM(total_amount) as total_spent,
      MAX(created_at) as last_booking
    FROM public.bookings
    GROUP BY customer_id
  ) b ON c.user_id = b.customer_id
  ORDER BY c.created_at DESC;
$$;