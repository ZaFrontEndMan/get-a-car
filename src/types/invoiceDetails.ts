// Invoice API Response Types
export interface InvoiceDetails {
  id: number;
  totalAmount: number;
  charges: {
    carRentCharge: number;
    protectionFee: number;
  };
  paymentInfoDetalis: PaymentInfoDetail[];
}

export interface PaymentInfoDetail {
  id: number;
  bookingId: number;
  carServiceName: string;
  carServicePrice: number;
}

export interface CustomerDetails {
  id: string;
  fullName: string;
  email: string;
  image: string;
  isActived: boolean;
  phoneNumber: string;
  location: string;
  licenseNumber: string;
  idNumber: string;
  personalIDFace: string;
  personalIDBack: string;
}

export interface OrderDetails {
  id: number;
  bookingNumber: number;
  creationdate: string;
  status: string;
  rentDays: number;
  dateFrom: string;
  dateTo: string;
  pickupLocation: string;
  dropOffLocation: string;
  totalPrice: number;
}

export interface VendorDetails {
  id: string;
  name: string;
  logo: string;
  email: string;
  phoneNumber: string;
  location: string;
}

export interface CarDetails {
  id: number;
  imageURLsCar: string[];
  model: string;
  transmission: string;
  carName: string;
  liter: string;
  doors: string;
  type: string;
}

export interface InvoiceResponse {
  data: {
    invoiceDetails: InvoiceDetails;
    customerDetails: CustomerDetails;
    orderDetails: OrderDetails;
    vendorDetails: VendorDetails;
    carDetails: CarDetails;
  };
  isSuccess: boolean;
  customMessage: {
    httpStatus: number;
    code: number;
    messageKey: string;
  };
}
