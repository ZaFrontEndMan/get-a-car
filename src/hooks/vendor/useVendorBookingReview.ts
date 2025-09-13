import { useQuery } from "@tanstack/react-query";
import {
  getAllBookingReviews,
  getCarReviewDetailsById,
} from "@/api/vendor/vendorBookingReviewApi";

// Hook: Get all booking reviews
export const useGetAllBookingReviews = () => {
  return useQuery({
    queryKey: ["vendorBookingReviews"],
    queryFn: getAllBookingReviews,
  });
};

// Hook: Get car review details by ID
export const useGetCarReviewDetailsById = (reviewId: string) => {
  return useQuery({
    queryKey: ["vendorCarReviewDetails", reviewId],
    queryFn: () => getCarReviewDetailsById(reviewId),
    enabled: !!reviewId,
  });
};