import { useQuery } from "@tanstack/react-query";
import {
  getAllInvoices,
  getInvoiceById,
} from "../../api/vendor/vendorInvoiceApi";

// Query keys
const VENDOR_INVOICE_QUERY_KEYS = {
  all: ["vendor", "invoices"] as const,
  lists: () => [...VENDOR_INVOICE_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...VENDOR_INVOICE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_INVOICE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_INVOICE_QUERY_KEYS.details(), id] as const,
};

// Get all invoices
export const useGetAllInvoices = () => {
  return useQuery({
    queryKey: VENDOR_INVOICE_QUERY_KEYS.lists(),
    queryFn: getAllInvoices,
  });
};

// Get invoice by ID
export const useGetInvoiceById = (invoiceId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_INVOICE_QUERY_KEYS.detail(invoiceId),
    queryFn: () => getInvoiceById(invoiceId),
    enabled: enabled && !!invoiceId,
  });
};