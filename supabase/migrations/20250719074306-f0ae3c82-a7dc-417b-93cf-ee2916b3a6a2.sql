-- Add RLS policy to allow admins to update all vendor fields
CREATE POLICY "Admins can update all vendor fields" 
ON public.vendors 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Also ensure admins can view all vendor data
CREATE POLICY "Admins can view all vendors" 
ON public.vendors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);