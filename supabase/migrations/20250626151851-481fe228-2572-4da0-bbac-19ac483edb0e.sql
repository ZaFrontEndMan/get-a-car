
-- Drop the problematic RLS policies first
DROP POLICY IF EXISTS "Vendor owners can view their vendor users" ON public.vendor_users;
DROP POLICY IF EXISTS "Vendor owners can create vendor users" ON public.vendor_users;
DROP POLICY IF EXISTS "Vendor owners can update their vendor users" ON public.vendor_users;
DROP POLICY IF EXISTS "Vendor owners can delete their vendor users" ON public.vendor_users;

DROP POLICY IF EXISTS "Vendor owners can view their cars" ON public.cars;
DROP POLICY IF EXISTS "Vendor owners can create cars" ON public.cars;
DROP POLICY IF EXISTS "Vendor owners can update their cars" ON public.cars;
DROP POLICY IF EXISTS "Vendor owners can delete their cars" ON public.cars;

DROP POLICY IF EXISTS "Vendor owners can view their branches" ON public.branches;
DROP POLICY IF EXISTS "Vendor owners can create branches" ON public.branches;
DROP POLICY IF EXISTS "Vendor owners can update their branches" ON public.branches;
DROP POLICY IF EXISTS "Vendor owners can delete their branches" ON public.branches;

-- Create a security definer function to check vendor ownership without recursion
CREATE OR REPLACE FUNCTION public.is_vendor_owner(vendor_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE id = vendor_id_param AND user_id = auth.uid()
  );
$$;

-- Recreate RLS policies using the security definer function
-- Vendor Users policies
CREATE POLICY "Vendor owners can view their vendor users" 
  ON public.vendor_users 
  FOR SELECT 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can create vendor users" 
  ON public.vendor_users 
  FOR INSERT 
  WITH CHECK (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can update their vendor users" 
  ON public.vendor_users 
  FOR UPDATE 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can delete their vendor users" 
  ON public.vendor_users 
  FOR DELETE 
  USING (public.is_vendor_owner(vendor_id));

-- Cars policies
CREATE POLICY "Vendor owners can view their cars" 
  ON public.cars 
  FOR SELECT 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can create cars" 
  ON public.cars 
  FOR INSERT 
  WITH CHECK (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can update their cars" 
  ON public.cars 
  FOR UPDATE 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can delete their cars" 
  ON public.cars 
  FOR DELETE 
  USING (public.is_vendor_owner(vendor_id));

-- Branches policies
CREATE POLICY "Vendor owners can view their branches" 
  ON public.branches 
  FOR SELECT 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can create branches" 
  ON public.branches 
  FOR INSERT 
  WITH CHECK (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can update their branches" 
  ON public.branches 
  FOR UPDATE 
  USING (public.is_vendor_owner(vendor_id));

CREATE POLICY "Vendor owners can delete their branches" 
  ON public.branches 
  FOR DELETE 
  USING (public.is_vendor_owner(vendor_id));
