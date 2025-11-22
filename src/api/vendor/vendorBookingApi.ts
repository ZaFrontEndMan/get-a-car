import axiosInstance from "../../utils/axiosInstance";

// Get booking by ID
export const getBookingById = async (bookingId: string) => {
  const { data } = await axiosInstance.get(`/Vendor/Booking/GetBookingById?Id=${bookingId}`);
  return data;
};

// Get all bookings for vendor
export const getAllBookings = async (params?: {
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
  bookingStatus?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.bookingStatus) queryParams.append('bookingStatus', params.bookingStatus);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/Vendor/Booking/GetAllBooking?${queryString}` : '/Vendor/Booking/GetAllBooking';
  
  const { data } = await axiosInstance.get(url);
  return data;
};

// Get bookings statistics
export const getBookingsStatistics = async () => {
  const { data } = await axiosInstance.get("/Vendor/Booking/GetBookingsStatistics");
  return data;
};

// Accept return car booking
export const acceptReturnCarBooking = async (bookingId: string) => {
  const { data } = await axiosInstance.put(`/Vendor/Booking/AcceptReturnCarBooking/${bookingId}`);
  return data;
};