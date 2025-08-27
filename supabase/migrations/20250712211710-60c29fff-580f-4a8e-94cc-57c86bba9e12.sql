-- Update a booking to have return_requested status for testing the Accept Return button
UPDATE public.bookings 
SET booking_status = 'return_requested'
WHERE id = '7362773a-c112-4347-afcd-f9680abd829c';