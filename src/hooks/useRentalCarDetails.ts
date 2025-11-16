import { useRentalCarDetails as useRentalCarDetailsApi } from "./website/useWebsiteCars";
import { getImageUrl, DEFAULT_IMAGES } from "../utils/imageUtils";

/**
 * Hook to fetch and transform rental car details from the new API endpoint
 *
 * @param carId - The car ID from the URL parameter
 * @param offerId - The offer ID from the URL parameter (can be same as carId)
 * @returns Transformed offer data compatible with existing OfferDetailsPage components
 *
 * Usage:
 * const { offer, loading, additionalServices } = useRentalCarDetails(carId, offerId);
 */
export const useRentalCarDetails = (carId: number, offerId: number) => {
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useRentalCarDetailsApi(carId, offerId);

  // Calculate discount percentage helper function
  const calculateDiscountPercentage = (
    oldPrice: number,
    newPrice: number
  ): number => {
    if (!oldPrice || oldPrice <= 0) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  // Transform the API response to match the expected offer format
  const transformedOffer = apiResponse?.data
    ? {
        id: apiResponse.data.carId.toString(),
        title: apiResponse.data.name,
        title_ar: apiResponse.data.name, // Using same name for now
        description: apiResponse.data.description || "",
        description_ar: apiResponse.data.description || "", // Using same description for now

        // Calculate discount from daily rate
        discountPercentage: calculateDiscountPercentage(
          apiResponse.data.oldpricePerDay,
          apiResponse.data.pricePerDay
        ),
        discount: apiResponse?.data?.offerCollectionForCars?.totalPrice || 0,

        // Offer collection data
        offerImage: getImageUrl(
          apiResponse?.data?.offerCollectionForCars?.offerImage
        ),
        offerTitle: apiResponse.data.offerCollectionForCars?.offerTitle,
        offerDescription:
          apiResponse.data.offerCollectionForCars?.offerDescription,

        validUntil:
          apiResponse.data.offerCollectionForCars?.endDate ||
          apiResponse.data.endDateAvailableBooking ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

        car: {
          id: apiResponse.data.carId.toString(),
          name: apiResponse.data.name,
          brand: apiResponse.data.type || "",
          model: apiResponse.data.model,
          year: new Date().getFullYear(),
          color: "",
          image: getImageUrl(
            apiResponse.data.imageURLs?.[0],
            DEFAULT_IMAGES.car
          ),
          gallery:
            apiResponse.data.imageURLs?.map((url) => getImageUrl(url)) || [],
          rating: apiResponse.data.isGoodRating || 0,
          reviews: apiResponse.data.ratingCount || 0,
          seats: parseInt(apiResponse.data.doors) || 4,
          fuel: apiResponse.data.fuelType?.trim() || "Petrol",
          transmission: apiResponse.data.transmission?.trim() || "Automatic",
          type: apiResponse.data.type || "Sedan",
          condition: "Excellent",
          mileageLimit: 250,
          features: [],

          // Current pricing (discounted)
          pricing: {
            daily: apiResponse.data.pricePerDay,
            weekly: apiResponse.data.pricePerWeek,
            monthly: apiResponse.data.pricePerMonth,
          },

          // Original pricing (before discount)
          originalPricing: {
            daily: apiResponse.data.oldpricePerDay,
            weekly: apiResponse.data.oldpricePerWeek,
            monthly: apiResponse.data.oldpricePerMonth,
          },

          daily_rate: apiResponse.data.pricePerDay,
          original_daily_rate: apiResponse.data.oldpricePerDay,
          vendor_id: apiResponse.data.vendorId,
          vendor_percentage: apiResponse.data.vendorPercentage,
          deposit_amount: 2000, // Default value
        },

        vendor: {
          id: apiResponse.data.vendorId,
          name: apiResponse.data.vendorName || "Unknown Vendor",
          image: getImageUrl(
            apiResponse.data.companyLogo,
            DEFAULT_IMAGES.vendor
          ),
          verified: true,
          percentage: apiResponse.data.vendorPercentage,
        },

        locations: apiResponse.data.pickUpLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"],

        dropoffLocations: apiResponse.data.dropOffLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"],

        policies: [
          ...(apiResponse.data.cancellationPoliciesDto?.map(
            (policy) => `${policy.name}: ${policy.description}`
          ) || []),
          ...(apiResponse.data.protectionsDto?.protections?.map(
            (protection) => protection.description
          ) || []),
        ],

        // Additional data from the new API
        rentalCarDetails: {
          liter: apiResponse.data.liter,
          doors: apiResponse.data.doors,
          isWishList: apiResponse.data.isWishList,
          isOfferedCar: apiResponse.data.isOfferedCar,
          withDriver: apiResponse.data.withDriver,
          withDriverPricePerDay: apiResponse.data.withDriverPricePerDay,
          cancellationPolicies: apiResponse.data.cancellationPoliciesDto,
          protections: apiResponse.data.protectionsDto,
          pickUpLocations: apiResponse.data.pickUpLocationDto,
          dropOffLocations: apiResponse.data.dropOffLocationDto,
          optionalExtras: apiResponse.data.optionalExtras,
          startDateAvailableBooking: apiResponse.data.startDateAvailableBooking,
          endDateAvailableBooking: apiResponse.data.endDateAvailableBooking,
          offerCollection: apiResponse.data.offerCollectionForCars,
        },

        // Additional properties for compatibility
        branch: apiResponse.data.vendorName || "Main Branch",
        fuelType: apiResponse.data.fuelType?.trim(),
        transmission: apiResponse.data.transmission?.trim(),
        type: apiResponse.data.type,
        model: apiResponse.data.model,
        companyLogo: apiResponse.data.companyLogo,
        vendorId: apiResponse.data.vendorId,
      }
    : null;

  // Transform additional services from optional extras
  const additionalServices =
    apiResponse?.data?.optionalExtras?.map((extra) => ({
      id: extra.id,
      name: extra.name,
      description: extra.description,
      price: extra.price,
      category: "premium",
      selected: false,
    })) || [];

  return {
    offer: transformedOffer,
    loading: isLoading,
    error,
    additionalServices,
    similarOffers: [], // Will be handled separately if needed
  };
};
