// Single booking
export interface Booking {
  id: number;
  carName: string;
  clientName: string;
  carImage: string;
  clientId: string;
  bookingNumber: number;
  vendorName: string;
  totalPrice: number;
  fromDate: string;
  toDate: string;
  bookingStatus: string;
}

// A page of bookings with pagination info
export interface BookingPage {
  items: Booking[];
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
export interface ClientBookingsResponse {
  data: BookingPage[];
  isSuccess: boolean;
  customMessage: CustomMessage;
}

// Fallback array of real booking data
export const fallbackBookings: Booking[] = [
  {
    id: 1001,
    carName: "Toyota Camry 2024",
    clientName: "Ahmed Mohamed",
    carImage: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    clientId: "404b8d4a-f0d2-7c14-aa61-360cafa30be2",
    bookingNumber: 4413,
    vendorName: "Al Jazeera Motors",
    totalPrice: 5570.40,
    fromDate: "2023-06-17T10:00:00.000Z",
    toDate: "2023-06-24T10:00:00.000Z",
    bookingStatus: "confirmed"
  },
  {
    id: 1002,
    carName: "Hyundai Elantra 2024",
    clientName: "Mohamed Hassan",
    carImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
    clientId: "abf1eeba-5de8-c47f-01f4-d5b8d00194a6",
    bookingNumber: 9127,
    vendorName: "Al Futtaim",
    totalPrice: 3200.00,
    fromDate: "2023-07-01T09:00:00.000Z",
    toDate: "2023-07-08T09:00:00.000Z",
    bookingStatus: "active"
  },
  {
    id: 1003,
    carName: "BMW X5 2023",
    clientName: "Sara Ali",
    carImage: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e",
    clientId: "bbc64034-7383-8aa3-5f27-e26496727f1c",
    bookingNumber: 4092,
    vendorName: "Elite Cars",
    totalPrice: 8900.00,
    fromDate: "2023-08-10T12:00:00.000Z",
    toDate: "2023-08-17T12:00:00.000Z",
    bookingStatus: "completed"
  },
  {
    id: 1004,
    carName: "Mazda 6 2022",
    clientName: "Fatima Al-Sayed",
    carImage: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8",
    clientId: "2aeae53d-d0fe-f72a-d41e-64bd608d6a61",
    bookingNumber: 6446,
    vendorName: "Mazda Center",
    totalPrice: 2451.22,
    fromDate: "2023-09-05T08:00:00.000Z",
    toDate: "2023-09-12T08:00:00.000Z",
    bookingStatus: "cancelled"
  }
];