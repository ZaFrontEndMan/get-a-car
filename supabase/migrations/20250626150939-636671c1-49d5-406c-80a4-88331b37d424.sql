
-- Add RLS policies for vendor_users table
-- Allow vendor owners to manage their vendor users
CREATE POLICY "Vendor owners can view their vendor users" 
  ON public.vendor_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_users.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can create vendor users" 
  ON public.vendor_users 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_users.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can update their vendor users" 
  ON public.vendor_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_users.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can delete their vendor users" 
  ON public.vendor_users 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vendor_users.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Add RLS policies for cars table
CREATE POLICY "Vendor owners can view their cars" 
  ON public.cars 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = cars.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can create cars" 
  ON public.cars 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = cars.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can update their cars" 
  ON public.cars 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = cars.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can delete their cars" 
  ON public.cars 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = cars.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Add RLS policies for branches table
CREATE POLICY "Vendor owners can view their branches" 
  ON public.branches 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = branches.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can create branches" 
  ON public.branches 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = branches.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can update their branches" 
  ON public.branches 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = branches.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendor owners can delete their branches" 
  ON public.branches 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = branches.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Add RLS policies for vendors table
CREATE POLICY "Users can view their own vendor profile" 
  ON public.vendors 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own vendor profile" 
  ON public.vendors 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Enable RLS on all tables
ALTER TABLE public.vendor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
