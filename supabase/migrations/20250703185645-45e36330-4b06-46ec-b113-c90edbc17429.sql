-- Update user roles for existing vendors
UPDATE public.profiles 
SET role = 'vendor'::public.user_role
WHERE user_id IN (
  SELECT DISTINCT user_id 
  FROM public.vendors 
  WHERE user_id IS NOT NULL
) AND role != 'admin'::public.user_role;