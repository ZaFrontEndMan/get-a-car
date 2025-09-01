import axiosInstance from "./../../utils/axiosInstance";
export const invoiceApi = {
  getAllInvoices: () => axiosInstance.get("/Client/Invoice/GetAllInvoices"),

  getInvoiceById: (id: string | number) =>
    axiosInstance.get(`/Client/Invoice/GetInvoiceById/${id}`),
};
