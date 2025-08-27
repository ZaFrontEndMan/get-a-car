
-- Create an admin function to get all bookings data bypassing RLS
CREATE OR REPLACE FUNCTION public.get_all_bookings_admin()
RETURNS TABLE(
  id uuid,
  booking_number text,
  car_id uuid,
  vendor_id uuid,
  customer_id uuid,
  customer_name text,
  customer_email text,
  customer_phone text,
  pickup_date timestamp with time zone,
  return_date timestamp with time zone,
  total_amount numeric,
  booking_status text,
  payment_status text,
  created_at timestamp with time zone,
  total_days integer,
  car_name text,
  car_brand text,
  car_model text,
  vendor_name text
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    b.id,
    b.booking_number,
    b.car_id,
    b.vendor_id,
    b.customer_id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    b.pickup_date,
    b.return_date,
    b.total_amount,
    b.booking_status,
    b.payment_status,
    b.created_at,
    b.total_days,
    c.name as car_name,
    c.brand as car_brand,
    c.model as car_model,
    v.name as vendor_name
  FROM public.bookings b
  LEFT JOIN public.cars c ON b.car_id = c.id
  LEFT JOIN public.vendors v ON b.vendor_id = v.id
  ORDER BY b.created_at DESC;
$$;
