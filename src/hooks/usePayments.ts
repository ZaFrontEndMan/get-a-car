
import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../api/client/clientPayments';
import { Payment } from '../types/payments';

export const usePayments = () => {
  const { data: paymentsResponse, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => getPayments(),
  });

  // Transform the API response to match the component's expected format
  const payments = paymentsResponse?.data?.items?.map((payment: Payment) => ({
    id: payment.invoiceId.toString(),
    amount: payment.totalPrice,
    payment_method: 'credit_card', // Default payment method
    payment_status: payment.status,
    transaction_id: `TXN-${payment.invoiceId}`,
    payment_date: payment.fromDate,
    created_at: payment.fromDate,
    booking: {
      booking_number: `BK-${payment.invoiceId}`,
      car: {
        name: payment.carName,
        brand: payment.carName.split(' ')[0], // Extract brand from car name
        model: payment.carName.split(' ').slice(1).join(' '), // Extract model from car name
      },
    },
  })) || [];

  return {
    payments,
    isLoading,
    totalRecords: paymentsResponse?.data?.totalRecords || 0,
    pageNumber: paymentsResponse?.data?.pageNumber || 1,
    pageSize: paymentsResponse?.data?.pageSize || 10,
    totalPages: paymentsResponse?.data?.totalPages || 1,
  };
};
