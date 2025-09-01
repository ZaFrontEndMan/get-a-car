// src/hooks/client/useInvoices.ts
import { invoiceApi } from "@/api/client/clientInvoiceApi";
import { useQuery } from "@tanstack/react-query";

// Fetch all invoices
export const useGetAllInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await invoiceApi.getAllInvoices();
      return res.data;
    },
  });
};

// Fetch single invoice by id
export const useGetInvoiceById = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const res = await invoiceApi.getInvoiceById(id);
      return res.data;
    },
    enabled: Boolean(id) && enabled, // only run if id is provided
  });
};
