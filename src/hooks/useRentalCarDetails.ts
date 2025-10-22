import { useRentalCarDetails as useRentalCarDetailsApi } from "./website/useWebsiteCars";
import { useLanguage } from "../contexts/LanguageContext";
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
  const { t } = useLanguage();
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useRentalCarDetailsApi(carId, offerId);

  // Transform the API response to match the expected offer format
  const transformedOffer = apiResponse?.data
    ? {
        id: apiResponse.data.carId.toString(),
        title: apiResponse.data.name,
        title_ar: apiResponse.data.name, // Using same name for now
        description: apiResponse.data.description,
        description_ar: apiResponse.data.description, // Using same description for now
        discount: "0%", // No discount in rental car details
        discountPercentage: 0,
        validUntil:
          apiResponse.data.endDateAvailableBooking ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now if not provided
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
          rating: apiResponse.data.isGoodRating || 4.5,
          reviews: apiResponse.data.ratingCount || 0,
          seats: parseInt(apiResponse.data.doors) || 4,
          fuel: apiResponse.data.fuelType || "Petrol",
          transmission: apiResponse.data.transmission || "Automatic",
          type: apiResponse.data.type || "Sedan",
          condition: "Excellent",
          mileageLimit: 250,
          features: [],
          pricing: {
            daily: apiResponse.data.pricePerDay,
            weekly: apiResponse.data.pricePerWeek,
            monthly: apiResponse.data.pricePerMonth,
          },
          originalPricing: {
            daily: apiResponse.data.pricePerDay,
            weekly: apiResponse.data.pricePerWeek,
            monthly: apiResponse.data.pricePerMonth,
          },
          daily_rate: apiResponse.data.pricePerDay,
          original_daily_rate: apiResponse.data.pricePerDay,
          vendor_id: apiResponse.data.vendorId,
          deposit_amount: 2000, // Default value
        },
        vendor: {
          id: apiResponse.data.vendorId,
          name: apiResponse.data.vendorName || "Unknown Vendor",
          rating: 4.8,
          totalReviews: 0,
          image: getImageUrl(
            apiResponse.data.companyLogo,
            DEFAULT_IMAGES.vendor
          ),
          verified: true,
          location: "Main Branch", // Default value
          phone: "",
          email: "",
          website: "",
          carsCount: 10, // Default value
        },
        locations: apiResponse.data.pickUpLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"],
        dropoffLocations: apiResponse.data.dropOffLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"],
        policies: [
          ...(apiResponse.data.cancellationPoliciesDto?.map(
            (policy) => policy.description
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
        },
        // Additional properties for compatibility
        branch: apiResponse.data.vendorName || "Main Branch",
        fuelType: apiResponse.data.fuelType,
        transmission: apiResponse.data.transmission,
        type: apiResponse.data.type,
        model: apiResponse.data.model,
        companyLogo: apiResponse.data.companyLogo,
        vendorId: apiResponse.data.vendorId,
      }
    : null;

  // Transform additional services from optional extras
  const additionalServices =
    apiResponse?.data?.optionalExtras?.map((extra, index) => ({
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
