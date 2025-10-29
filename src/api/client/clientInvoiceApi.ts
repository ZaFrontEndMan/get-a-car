import axiosInstance from "./../../utils/axiosInstance";

interface GetAllInvoicesParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const invoiceApi = {
  getAllInvoices: (params?: GetAllInvoicesParams) =>
    axiosInstance.get("/Client/Invoice/GetAllInvoices", { params }),

  getInvoiceById: (id: string | number) =>
    axiosInstance.get(`/Client/Invoice/GetInvoiceById/${id}`),
};
