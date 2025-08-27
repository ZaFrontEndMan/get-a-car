
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentWithBooking {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  payment_date: string | null;
  created_at: string;
  booking: {
    booking_number: string;
    car: {
      name: string;
      brand: string;
      model: string;
    };
  };
}

export const usePayments = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          booking:bookings (
            booking_number,
            car:cars (
              name,
              brand,
              model
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentWithBooking[];
    },
  });

  return {
    payments,
    isLoading,
  };
};
