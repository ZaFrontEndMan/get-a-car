import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookingById,
  getAllBookings,
  getBookingsStatistics,
  acceptReturnCarBooking,
} from "@/api/vendor/vendorBookingApi";

// Hook: Get booking by ID
export const useGetBookingById = (bookingId: string) => {
  return useQuery({
    queryKey: ["vendorBooking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });
};

// Hook: Get all bookings
export const useGetAllBookings = (params?: {
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
  bookingStatus?: string;
}) => {
  return useQuery({
    queryKey: ["vendorBookings", params],
    queryFn: () => getAllBookings(params),
  });
};

// Hook: Get bookings statistics
export const useGetBookingsStatistics = () => {
  return useQuery({
    queryKey: ["vendorBookingsStatistics"],
    queryFn: getBookingsStatistics,
  });
};

// Hook: Accept return car booking
export const useAcceptReturnCarBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptReturnCarBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["vendorBookingsStatistics"] });
    },
  });
};