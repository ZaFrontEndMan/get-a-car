-- Update the Accept Return functionality to work properly for all bookings
-- Create a function to handle car return acceptance
CREATE OR REPLACE FUNCTION accept_car_return(booking_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update booking status from return_requested to completed
  UPDATE public.bookings 
  SET 
    booking_status = 'completed',
    updated_at = now()
  WHERE 
    id = booking_id_param 
    AND booking_status = 'return_requested'
    AND EXISTS (
      SELECT 1 FROM public.vendors v 
      WHERE v.id = bookings.vendor_id 
      AND v.user_id = auth.uid()
    );
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or not authorized to accept return';
  END IF;
END;
$$;