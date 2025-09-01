// Single payment item
export interface Payment {
  invoiceId: number;
  vendorName: string;
  carName: string;
  totalPrice: number;
  fromDate: string;
  toDate: string;
  status: string;
}

// Pagination info
export interface PaymentPage {
  items: Payment[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Custom message from API
export interface CustomMessage {
  httpStatus: number;
  code: number;
  messageKey: string;
}

// The full API response
export interface PaymentsResponse {
  data: PaymentPage;
  isSuccess: boolean;
  customMessage: CustomMessage;
}
