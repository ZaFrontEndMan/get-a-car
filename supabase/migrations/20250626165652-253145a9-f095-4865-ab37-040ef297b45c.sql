
-- Add foreign key constraint to link bookings.customer_id to profiles.user_id
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_customer_id_profiles_user_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
