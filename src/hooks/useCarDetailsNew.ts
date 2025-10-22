import { useCarDetailsById } from "./website/useWebsiteCars";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Hook to fetch and transform car details from the new API endpoint
 *
 * @param carId - The car ID from the URL parameter
 * @returns Transformed car data compatible with existing CarDetails components
 *
 * Usage:
 * const { car, loading, additionalServices } = useCarDetailsNew(carId);
 */
export const useCarDetailsNew = (carId: number) => {
  const { t } = useLanguage();
  const { data: apiResponse, isLoading, error } = useCarDetailsById(carId);

  // Transform the API response to match the expected car format
  const transformedCar = apiResponse?.data
    ? {
        id: apiResponse.data.carId.toString(),
        name: apiResponse.data.name,
        brand: apiResponse.data.type || "",
        model: apiResponse.data.model,
        year: new Date().getFullYear(), // Default to current year
        color: "", // Not provided in API
        images: apiResponse.data.imageURLs?.filter(
          (url) => url && url.trim() !== ""
        ) || ["/placeholder.svg"],
        daily_rate: apiResponse.data.pricePerDay,
        weekly_rate: apiResponse.data.pricePerWeek,
        monthly_rate: apiResponse.data.pricePerMonth,
        vendor_id: apiResponse.data.vendorId,
        vendor_name: apiResponse.data.vendorName,
        company_logo: apiResponse.data.companyLogo,
        seats: parseInt(apiResponse.data.doors) || 4,
        fuel_type: apiResponse.data.fuelType,
        transmission: apiResponse.data.transmission,
        type: apiResponse.data.type,
        description: apiResponse.data.description,
        liter: apiResponse.data.liter,
        doors: apiResponse.data.doors,
        rating: apiResponse.data.isGoodRating || 4.5,
        reviews: apiResponse.data.ratingCount || 0,
        is_wishlist: apiResponse.data.isWishList,
        is_offered_car: apiResponse.data.isOfferedCar,
        with_driver: apiResponse.data.withDriver,
        with_driver_price_per_day: apiResponse.data.withDriverPricePerDay,
        start_date_available_booking:
          apiResponse.data.startDateAvailableBooking,
        end_date_available_booking: apiResponse.data.endDateAvailableBooking,
        deposit_amount: 2000, // Default value
        mileage_limit: 250, // Default value
        condition: "Excellent", // Default value
        features: [], // Default empty array
        pickup_locations: apiResponse.data.pickUpLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"], // Default fallback
        dropoff_locations: apiResponse.data.dropOffLocationDto?.map(
          (loc) => loc.address || `Location ${loc.id}`
        ) || ["Main Branch"], // Default fallback
        // Additional data from the new API
        carDetails: {
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
        // Vendor information
        vendor: {
          id: apiResponse.data.vendorId,
          name: apiResponse.data.vendorName || "Unknown Vendor",
          rating: 4.8,
          totalReviews: 0,
          image:
            apiResponse.data.companyLogo ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
          verified: true,
          location: "Main Branch", // Default value
          phone: "",
          email: "",
          website: "",
          carsCount: 10, // Default value
        },
        // Branches information (for compatibility)
        branches:
          apiResponse.data.pickUpLocationDto?.map((loc) => ({
            name: loc.address || `Location ${loc.id}`,
            address: loc.address || "",
            city: "", // Not provided in API
          })) || [],
        // Vendors information (for compatibility) - this should be an object with name property
        vendors: {
          name: apiResponse.data.vendorName || "Unknown Vendor",
          email: "",
          phone: "",
        },
      }
    : null;

  // Debug logging for transformed car
  console.log("useCarDetailsNew - transformedCar:", transformedCar);

  // Transform additional services from optional extras
  const additionalServices =
    apiResponse?.data?.optionalExtras?.map((extra, index) => ({
      id: extra.id,
      name: extra.name,
      description: extra.description,
      price: extra.price,
      category: "premium",
      selected: false,
      is_active: true,
    })) || [];

  return {
    car: transformedCar,
    loading: isLoading,
    error,
    additionalServices,
  };
};
