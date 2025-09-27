import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useMostPopularCars } from "@/hooks/website/useWebsiteOffers";
import CarCard from "./CarCard";
import { SectionSkeleton } from "./ui/SkeletonLoaders";
import SectionHeader from "./ui/SectionHeader";
import { getImageUrl, DEFAULT_IMAGES } from "@/utils/imageUtils";

const PopularCarsSection = () => {
  const { t, language } = useLanguage();

  // Use the new API hook for popular cars
  const { data: apiResponse, isLoading } = useMostPopularCars();

  // Transform API response to match the expected format for CarCard
  const cars =
    apiResponse?.data?.map((car) => ({
      id: car.carID,
      name: car.name,
      brand: car.model,
      image: getImageUrl(car.image, DEFAULT_IMAGES.car),
      price: car.pricePerDay,
      weeklyPrice: car.pricePerWeek,
      monthlyPrice: car.pricePerMonth,
      rating: car.isGoodRating ? 4.5 : 4.0,
      features: [],
      isWishList: car?.isWishList,
      seats: parseInt(car.doors) || 4,
      fuel: car.liter || "Petrol",
      transmission: "Automatic", // Default value, API doesn't provide this
      vendor: {
        id: car.carID,
        name: "Vendor", // Default value, API doesn't provide vendor info
        logo_url: undefined,
      },
    })) || [];

  if (isLoading) {
    return <SectionSkeleton type="cars" count={8} />;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("popularCars")}
          viewAllLink="/cars"
          showViewAll={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCarsSection;
