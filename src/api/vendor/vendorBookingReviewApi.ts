import axiosInstance from "../../utils/axiosInstance";

// Get all booking reviews for vendor
export const getAllBookingReviews = async () => {
  const { data } = await axiosInstance.get("/api/Vendor/BookingReview/GetAllBookingReviews");
  return data;
};

// Get car review details by ID
export const getCarReviewDetailsById = async (reviewId: string) => {
  const { data } = await axiosInstance.get(`/api/Vendor/BookingReview/GetCarReviewDetailsById/${reviewId}`);
  return data;
};