import axiosInstance from "../../utils/axiosInstance";

export const createBooking = async (payload: any) => {
  const { data } = await axiosInstance.post(
    "/Client/Booking/CreateBooking",
    payload
  );
  return data;
};

export const paymentCallback = async (payload: any) => {
  const { data } = await axiosInstance.post(
    "/Client/Booking/PaymentCallback",
    payload
  );
  return data;
};

export const getBookingById = async (bookingId: string) => {
  const { data } = await axiosInstance.get(`/Client/Booking/GetBookingById`, {
    params: { id: bookingId },
  });
  return data;
};

export const getAllBooking = async (params: {
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
  bookingStatus?: string;
}) => {
  const { data } = await axiosInstance.get("/Client/Booking/GetAllBooking", {
    params,
  });
  return data;
};

export const getCustomerBookingCar = async (carId: string) => {
  const { data } = await axiosInstance.post(
    `/Client/Booking/GetCustomerBookingCar`,
    { carId }
  );
  return data;
};
export const addBookingFavourite = (data: {
  ratingVendor: number;
  ratingBooking: number;
  ratingWebsite: number;
  ratingCar: number;
  comment: string;
  bookingId: number | string;
}) =>
  axiosInstance
    .post("/Client/BookingReview/AddBookingReview", data)
    .then((res) => res.data);
export const generateInvoicePdf = async (
  invoiceId: number | string
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `/Client/Booking/GenerateInvoicePdf`,
    {
      params: { InvoiceId: invoiceId },
      responseType: "blob",
    }
  );
  return response.data;
};

export const acceptReturnCar = async (bookingId: string | number) => {
  try {
    const { data } = await axiosInstance.put(
      `/Client/Booking/AcceptReturnCar/${bookingId}`
    );
    const env = data;
    if (
      env &&
      typeof env === "object" &&
      ("isSuccess" in env || "data" in env)
    ) {
      if (env.isSuccess === false) {
        const msg =
          env.customMessage || env.message || "Failed to accept car return";
        throw new Error(msg);
      }
      return env.data ?? data;
    }
    return data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.customMessage ||
      error?.message ||
      "Failed to accept car return";
    throw new Error(msg);
  }
};
