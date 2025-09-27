import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarCard from "./CarCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useSimilarCars } from "@/hooks/website/useWebsiteCars";

interface SimilarCarsSliderProps {
  /** The car object to find similar cars for */
  car: {
    id: string | number;
    name?: string;
    brand?: string;
    model?: string;
    image?: string;
    price?: number;
    weeklyPrice?: number;
    monthlyPrice?: number;
    rating?: number;
    features?: string[];
    seats?: number;
    fuel?: string;
    transmission?: string;
    isOffer?: boolean;
    discount?: string | null;
    type?: string;
    originalPricing?: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    isWishList: boolean;
    pickUpLocations?: Array<{ address: string; id: number }>;
  };
}

/**
 * SimilarCarsSlider component displays a carousel of similar cars based on the provided car object.
 * It uses the car's type, pricing, and pickup locations to find relevant similar cars.
 */
const SimilarCarsSlider = ({ car }: SimilarCarsSliderProps) => {
  const { t } = useLanguage();

  // Prepare request body for similar cars API
  const requestBody = useMemo(() => {
    const maxPrice = car.originalPricing?.daily
      ? Math.round(car.originalPricing.daily * 1.1)
      : 20000; // +10%
    const types = car.type ? [car.type] : [];
    const pickUpLocations =
      car.pickUpLocations?.map((loc) => loc.address).filter(Boolean) || [];

    return {
      types,
      pickUpLocations,
      maxPrice,
    };
  }, [car.originalPricing, car.type, car.pickUpLocations]);

  // Use the similar cars API
  const {
    data: similarCarsResponse,
    isLoading,
    error,
    isError,
  } = useSimilarCars(requestBody);

  // Transform API data to match CarCard format
  const similarOffers = useMemo(() => {
    if (
      !similarCarsResponse?.data ||
      !Array.isArray(similarCarsResponse.data)
    ) {
      return [];
    }

    return similarCarsResponse.data
      .filter(
        (carData) =>
          carData.carID.toString() !== car.id.toString() && carData.availability
      )
      .slice(0, 4) // Limit to 4 cars
      .map((carData) => ({
        id: carData.carID.toString(),
        title: carData.name || "Unknown Car",
        brand: carData.branch || "Unknown",
        image:
          carData.image || "/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png",
        price: carData.pricePerDay || 0,
        weeklyPrice: carData.pricePerWeek || 0,
        monthlyPrice: carData.pricePerMonth || 0,
        rating: 4.7, // Default rating
        features: [],
        isWishList: car?.isWishList,

        seats: parseInt(carData.doors) || 4,
        fuel: carData.fuelType || "Unknown",
        transmission: carData.transmission || "Automatic",
        isOffer: false,
        discount: null,
      }));
  }, [similarCarsResponse, car.id]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {t("similarCars")}
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {t("similarCars")}
        </h3>
        <p className="text-red-600 text-center py-8">
          {t("errorLoadingSimilarCars") || "Error loading similar cars"}
        </p>
      </div>
    );
  }

  if (similarOffers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {t("similarCars")}
        </h3>
        <p className="text-gray-600 text-center py-8">
          {t("noSimilarCarsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {t("similarCars")}
      </h3>

      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {similarOffers.map((car) => (
            <CarouselItem
              key={car.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <CarCard car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="px-0 mx-[12px]" />
        <CarouselNext className="mx-[13px]" />
      </Carousel>
    </div>
  );
};

export default SimilarCarsSlider;
