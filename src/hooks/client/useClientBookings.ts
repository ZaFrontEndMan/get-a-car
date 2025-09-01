import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  createBooking,
  paymentCallback,
  getBookingById,
  getAllBooking,
  getCustomerBookingCar,
} from "./../../api/client/clientBookings";
import { Booking, ClientBookingsResponse } from "@/types/clientBookings";
import { InvoiceResponse } from "@/types/invoiceDetails";

// Query params for fetching bookings
interface GetAllBookingsParams {
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
  bookingStatus?: string;
}

// Payload when creating a booking
interface BookingPayload {
  [key: string]: unknown;
}

export const useClientBookings = () => {
  // 🔹 Create Booking
  const useCreateBookingMutation = (
    options?: UseMutationOptions<Booking, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: createBooking,
      ...options,
    });

  // 🔹 Payment Callback
  const usePaymentCallbackMutation = (
    options?: UseMutationOptions<unknown, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: paymentCallback,
      ...options,
    });

  // 🔹 Get Booking By ID
  const useGetBookingById = (
    bookingId: string,
    options?: UseQueryOptions<Booking, Error>
  ) =>
    useQuery({
      queryKey: ["booking", bookingId],
      queryFn: () => getBookingById(bookingId),
      enabled: !!bookingId,
      ...options,
    });

  // 🔹 Get Invoice Details By Booking ID
  const useGetInvoiceDetails = (
    bookingId: string,
    options?: UseQueryOptions<InvoiceResponse, Error>
  ) =>
    useQuery({
      queryKey: ["invoice", bookingId],
      queryFn: () => getBookingById(bookingId) as Promise<InvoiceResponse>,
      enabled: !!bookingId,
      ...options,
    });

  // 🔹 Get All Bookings (paged response)
  const useGetAllBookings = (
    params: GetAllBookingsParams = {},
    options?: UseQueryOptions<ClientBookingsResponse, Error>
  ) =>
    useQuery({
      queryKey: ["bookings", params],
      queryFn: () => getAllBooking(params),
      ...options,
    });

  // 🔹 Get Bookings for a Customer's Car
  const useGetCustomerBookingCar = (
    carId: string,
    options?: UseQueryOptions<Booking[], Error>
  ) =>
    useQuery({
      queryKey: ["customerBookingCar", carId],
      queryFn: () => getCustomerBookingCar(carId),
      enabled: !!carId,
      ...options,
    });

  return {
    useCreateBookingMutation,
    usePaymentCallbackMutation,
    useGetBookingById,
    useGetInvoiceDetails,
    useGetAllBookings,
    useGetCustomerBookingCar,
  };
};
