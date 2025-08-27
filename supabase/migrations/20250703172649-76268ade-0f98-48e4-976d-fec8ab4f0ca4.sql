-- Create a function to get clients data properly
CREATE OR REPLACE FUNCTION public.get_clients_data()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  totalBookings BIGINT,
  totalSpent NUMERIC,
  lastBooking TIMESTAMP WITH TIME ZONE,
  status TEXT,
  joinedDate TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    c.user_id as id,
    c.name,
    c.email,
    c.phone,
    COALESCE(b.booking_count, 0) as totalBookings,
    COALESCE(b.total_spent, 0) as totalSpent,
    b.last_booking as lastBooking,
    c.status,
    c.created_at as joinedDate
  FROM public.clients c
  LEFT JOIN (
    SELECT 
      customer_id,
      COUNT(*) as booking_count,
      SUM(total_amount) as total_spent,
      MAX(created_at) as last_booking
    FROM public.bookings
    GROUP BY customer_id
  ) b ON c.user_id = b.customer_id
  ORDER BY c.created_at DESC;
$$;