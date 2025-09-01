import { Booking } from "@/types/clientBookings";

export const getStatusCounts = (bookings: Booking[]) => {
  const counts = bookings.reduce((acc, booking) => {
    const status = booking.bookingStatus || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return counts;
};
