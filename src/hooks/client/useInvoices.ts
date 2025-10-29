import { invoiceApi } from "@/api/client/clientInvoiceApi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface GetAllInvoicesParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const useGetAllInvoices = (
  params: GetAllInvoicesParams = {},
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const res = await invoiceApi.getAllInvoices(params);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useGetInvoiceById = (
  id: string | number,
  enabled = true,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const res = await invoiceApi.getInvoiceById(id);
      return res.data;
    },
    enabled: Boolean(id) && enabled,
    ...options,
  });
};
