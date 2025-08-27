
-- Drop the existing problematic RLS policies for vendor_users
DROP POLICY IF EXISTS "Vendor owners can manage users" ON public.vendor_users;
DROP POLICY IF EXISTS "Users can view their own vendor associations" ON public.vendor_users;

-- Drop problematic policies for branches that reference vendor_users
DROP POLICY IF EXISTS "Vendor staff can view branches" ON public.branches;
DROP POLICY IF EXISTS "Vendor managers can manage branches" ON public.branches;

-- Create a security definer function to check vendor ownership without recursion
CREATE OR REPLACE FUNCTION public.is_vendor_owner(_vendor_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE id = _vendor_id AND user_id = _user_id
  );
$$;

-- Create simplified RLS policies for vendor_users
CREATE POLICY "Users can view their own vendor associations" 
ON public.vendor_users
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Vendor owners can manage vendor users" 
ON public.vendor_users
FOR ALL 
USING (
  public.is_vendor_owner(vendor_id, auth.uid()) OR user_id = auth.uid()
);

-- Create simplified RLS policies for branches
CREATE POLICY "Allow branches access for vendor owners" 
ON public.branches
FOR ALL 
USING (
  public.is_vendor_owner(vendor_id, auth.uid())
);

-- Also update cars and bookings policies to use the same pattern
DROP POLICY IF EXISTS "Vendor staff can view cars" ON public.cars;
DROP POLICY IF EXISTS "Vendor staff can manage cars" ON public.cars;
DROP POLICY IF EXISTS "Vendor staff can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Vendor staff can update bookings" ON public.bookings;

CREATE POLICY "Allow cars access for vendor owners" 
ON public.cars
FOR ALL 
USING (
  public.is_vendor_owner(vendor_id, auth.uid())
);

CREATE POLICY "Allow bookings access for vendor owners" 
ON public.bookings
FOR ALL 
USING (
  public.is_vendor_owner(vendor_id, auth.uid())
);
