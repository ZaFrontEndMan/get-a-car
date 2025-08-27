
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useBookingReturn = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const returnCarMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log('=== RETURN CAR REQUEST START ===');
      console.log('Requesting return for booking:', bookingId);
      console.log('Current user ID:', user?.id);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // First verify the booking exists and belongs to the user
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('id, customer_id, booking_status, vendor_id')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        throw new Error('Booking not found: ' + fetchError.message);
      }

      if (!existingBooking) {
        console.error('No booking found');
        throw new Error('Booking not found');
      }

      console.log('Found booking:', existingBooking);

      // Verify ownership
      if (existingBooking.customer_id !== user.id) {
        console.error('Booking ownership verification failed');
        throw new Error('Not authorized to modify this booking');
      }

      // Check if booking is in a valid state for return request
      const validStatuses = ['confirmed', 'active', 'in_progress'];
      if (!validStatuses.includes(existingBooking.booking_status)) {
        console.error(`Invalid booking status: ${existingBooking.booking_status}`);
        throw new Error(`Cannot request return for booking with status: ${existingBooking.booking_status}`);
      }

      console.log('Updating booking status to return_requested...');

      // Direct update with proper error handling - now should work with new RLS policies
      const { data: updateData, error: updateError } = await supabase
        .from('bookings')
        .update({ 
          booking_status: 'return_requested',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('customer_id', user.id)
        .select();

      if (updateError) {
        console.error('Update failed:', updateError);
        throw new Error('Failed to update booking: ' + updateError.message);
      }

      if (!updateData || updateData.length === 0) {
        console.error('No rows were updated - this should not happen with the new RLS policies');
        throw new Error('Update operation failed - please try again or contact support');
      }

      const updatedBooking = updateData[0];
      console.log('Update successful:', updatedBooking);
      console.log('=== RETURN CAR REQUEST SUCCESS ===');
      
      return updatedBooking;
    },
    onSuccess: (data) => {
      console.log('Return request mutation success:', data);
      
      // Invalidate all relevant queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      
      // Also refetch immediately
      queryClient.refetchQueries({ queryKey: ['bookings'] });
      queryClient.refetchQueries({ queryKey: ['vendor-bookings'] });
      
      console.log('Return request sent successfully for booking:', data.id);
      toast.success('Return request sent successfully! The vendor will be notified.');
    },
    onError: (error) => {
      console.error('=== RETURN CAR REQUEST FAILED ===');
      console.error('Return request failed:', error);
      toast.error(`Failed to send return request: ${error.message}`);
    }
  });

  const handleReturnCar = (bookingId: string) => {
    if (!user?.id) {
      toast.error('Please log in to request car return');
      return;
    }
    console.log('Initiating return request for booking:', bookingId);
    returnCarMutation.mutate(bookingId);
  };

  return {
    handleReturnCar,
    isReturning: returnCarMutation.isPending
  };
};
