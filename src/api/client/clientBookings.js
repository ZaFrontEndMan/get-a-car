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
        { params: { bookingId } }
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
