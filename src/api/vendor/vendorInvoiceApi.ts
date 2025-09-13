import axiosInstance from "../../utils/axiosInstance";

// Get all invoices
export const getAllInvoices = async () => {
  const { data } = await axiosInstance.get("/api/Vendor/Invoice/GetAllInvoices");
  return data;
};

// Get invoice by ID
export const getInvoiceById = async (invoiceId: string) => {
  const { data } = await axiosInstance.get(`/api/Vendor/Invoice/GetInvoiceById/${invoiceId}`);
  return data;
};