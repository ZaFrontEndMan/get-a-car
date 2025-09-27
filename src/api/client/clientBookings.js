import axiosInstance from "../../utils/axiosInstance";


export const createBooking = async (payload) => {
    const { data } = await axiosInstance.post(
        "/Client/Booking/CreateBooking",
        payload
    );
    return data;
};


export const paymentCallback = async (payload) => {
    const { data } = await axiosInstance.post(
        "/Client/Booking/PaymentCallback",
        payload
    );
    return data;
};


export const getBookingById = async (bookingId) => {
    const { data } = await axiosInstance.get(
        `/Client/Booking/GetBookingById`,
        { params: { id: bookingId } }
    );
    return data;
};


export const getAllBooking = async (params) => {
    const { data } = await axiosInstance.get("/Client/Booking/GetAllBooking", {
        params,
    });
    return data;
};


export const getCustomerBookingCar = async (carId) => {
    const { data } = await axiosInstance.post(
        `/Client/Booking/GetCustomerBookingCar`,
        { carId }
    );
    return data;
};

// Generate Invoice PDF
// Example endpoint: Booking/GenerateInvoicePdf?InvoiceId=22418337
export const generateInvoicePdf = async (invoiceId) => {
    const response = await axiosInstance.get(
        `/Client/Booking/GenerateInvoicePdf`,
        {
            params: { InvoiceId: invoiceId },
            responseType: "blob",
        }
    );
    return response.data;
};

// Accept Return Car
// Example endpoint: Client/Booking/AcceptReturnCar/4
export const acceptReturnCar = async (bookingId) => {
    try {
        const { data } = await axiosInstance.put(
            `/Client/Booking/AcceptReturnCar/${bookingId}`
        );
        // unwrap common API envelope if present
        const env = data;
        if (env && typeof env === "object" && ("isSuccess" in env || "data" in env)) {
            if (env.isSuccess === false) {
                const msg = env.customMessage || env.message || "Failed to accept car return";
                throw new Error(msg);
            }
            return env.data ?? data;
        }
        return data;
    } catch (error) {
        const msg = error?.response?.data?.customMessage || error?.message || "Failed to accept car return";
        throw new Error(msg);
    }
};
