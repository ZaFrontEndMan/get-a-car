
-- First, let's check what RLS policies exist for bookings table
-- Looking at the current policies, customers can only SELECT and INSERT their bookings
-- but there's no policy allowing them to UPDATE their bookings

-- Add RLS policy to allow customers to update their own bookings
CREATE POLICY "Customers can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Also ensure the booking status transitions are allowed
-- Add a more specific policy for return requests
CREATE POLICY "Customers can request return for their bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (
    customer_id = auth.uid() 
    AND booking_status IN ('confirmed', 'active', 'in_progress')
  )
  WITH CHECK (
    customer_id = auth.uid() 
    AND booking_status = 'return_requested'
  );
