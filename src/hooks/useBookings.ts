
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookingWithCar {
  id: string;
  booking_number: string;
  booking_status: string;
  payment_status: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_amount: number;
  daily_rate: number;
  total_days: number;
  created_at: string;
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    images: string[] | null;
  };
  vendor: {
    name: string;
    phone: string | null;
    email: string;
  };
}

export const useBookings = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:cars (
            id,
            name,
            brand,
            model,
            images
          ),
          vendor:vendors (
            name,
            phone,
            email
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BookingWithCar[];
    },
  });

  return {
    bookings,
    isLoading,
  };
};
