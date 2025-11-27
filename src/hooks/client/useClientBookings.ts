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
import { useLanguage } from "@/contexts/LanguageContext"; // ✅ add this

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

// adjust type if you have it defined elsewhere
interface AddBookingFavouritePayload {
  [key: string]: unknown;
}

export const useClientBookings = () => {
  const { toast } = useToast();
  const { t } = useLanguage(); // ✅ use translations
  const queryClient = useQueryClient();

  const extractErrorMessage = (error: any) => {
    return (
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      ""
    );
  };

  const useCreateBookingMutation = (
    options?: UseMutationOptions<Booking, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: createBooking,
      onSuccess: (data, variables, context) => {
        toast({ description: t("success") }); // ✅ success toast
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        const message = extractErrorMessage(error);
        toast({ description: message, variant: "destructive" });
        options?.onError?.(error, variables, context);
      },
    });

  const usePaymentCallbackMutation = (
    options?: UseMutationOptions<unknown, Error, BookingPayload>
  ) =>
    useMutation({
      mutationFn: paymentCallback,
      onSuccess: (data, variables, context) => {
        toast({ description: t("success") }); // ✅ success toast
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        const message = extractErrorMessage(error);
        toast({ description: message, variant: "destructive" });
        options?.onError?.(error, variables, context);
      },
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
      onSuccess: (data, variables, context) => {
        toast({ description: t("success") }); // ✅ success toast
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        const message = extractErrorMessage(error);
        toast({ description: message, variant: "destructive" });
        options?.onError?.(error, variables, context);
      },
    });

  const useAddBookingFavourite = (
    options?: UseMutationOptions<any, Error, AddBookingFavouritePayload>
  ) =>
    useMutation({
      mutationFn: addBookingFavourite,
      onSuccess: (data, variables, context) => {
        toast({ description: t("success") }); // ✅ success toast
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error: any, variables, context) => {
        const message = extractErrorMessage(error);
        toast({
          description: message,
          variant: "destructive",
        });
        options?.onError?.(error, variables, context);
      },
    });

  const useAcceptReturnCar = (
    options?: UseMutationOptions<any, Error, { bookingId: string | number }>
  ) =>
    useMutation({
      mutationFn: ({ bookingId }) => acceptReturnCar(bookingId),
      onSuccess: (data, variables, context) => {
        toast({ description: t("success") }); // ✅ success toast
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking"] });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error: any, variables, context) => {
        const message = extractErrorMessage(error);
        toast({
          description: message,
          variant: "destructive",
        });
        options?.onError?.(error, variables, context);
      },
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
