
import { BookingWithCar } from '@/hooks/useBookings';

export const getStatusCounts = (bookings: BookingWithCar[]) => {
  const counts = bookings.reduce((acc, booking) => {
    const status = booking.booking_status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return counts;
};
