import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createBooking,
  paymentCallback,
  getBookingById,
  getAllBooking,
  getCustomerBookingCar,
  generateInvoicePdf,
  acceptReturnCar,
  addBookingFavourite,
} from "./../../api/client/clientBookings";
import { Booking, ClientBookingsResponse } from "@/types/clientBookings";
import { InvoiceResponse } from "@/types/invoiceDetails";
import { useToast } from "@/components/ui/use-toast";

interface GetAllBookingsParams {
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
  bookingStatus?: string;
}

interface BookingPayload {
  [key: string]: unknown;
}

export const useClientBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useCreateBookingMutation = (
    options?: UseMutationOptions<Booking, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: createBooking,
      ...options,
    });

  const usePaymentCallbackMutation = (
    options?: UseMutationOptions<unknown, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: paymentCallback,
      ...options,
    });

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

  const useGetAllBookings = (
    params: GetAllBookingsParams = {},
    options?: UseQueryOptions<ClientBookingsResponse, Error>
  ) =>
    useQuery({
      queryKey: ["bookings", params],
      queryFn: () => getAllBooking(params),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      ...options,
    });

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

  const useGenerateInvoicePdf = (
    options?: UseMutationOptions<Blob, Error, { invoiceId: number | string }>
  ) =>
    useMutation({
      mutationFn: ({ invoiceId }) => generateInvoicePdf(invoiceId),
      ...options,
    });
  const useAddBookingFavourite = (
    options?: UseMutationOptions<any, Error, AddBookingFavouritePayload>
  ) =>
    useMutation({
      mutationFn: addBookingFavourite,
      onSuccess: () => {
        toast({
          title: "تم التقييم",
          description: "تم حفظ تقييمك بنجاح!",
        });
        // Invalidate or refetch wherever needed:
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      },
      onError: (error: any) => { 
        toast({
          title: "خطأ",
          description: error?.message || "فشل في إرسال التقييم",
          variant: "destructive",
        });
      },
      ...options,
    });
  const useAcceptReturnCar = (
    options?: UseMutationOptions<any, Error, { bookingId: string | number }>
  ) =>
    useMutation({
      mutationFn: ({ bookingId }) => acceptReturnCar(bookingId),
      onSuccess: () => {
        toast({
          title: "تم القبول",
          description: "تم قبول استرجاع السيارة بنجاح",
        });
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking"] });
      },
      onError: (error: any) => {
        toast({
          title: "خطأ",
          description: error?.message || "فشل في قبول استرجاع السيارة",
          variant: "destructive",
        });
      },
      ...options,
    });

  return {
    useCreateBookingMutation,
    usePaymentCallbackMutation,
    useGetBookingById,
    useGetInvoiceDetails,
    useGetAllBookings,
    useGetCustomerBookingCar,
    useGenerateInvoicePdf,
    useAcceptReturnCar,
    useAddBookingFavourite,
  };
};
