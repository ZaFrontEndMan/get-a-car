import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import CarFeatures from "./CarFeatures";
import { Star, Users, Fuel, Settings, Calendar, Tag, UserPlus } from "lucide-react";

interface OfferDetailsContentProps {
  offer: {
    discount: number;
    car: {
      id: string;
      name: string;
      brand: string;
      image: string;
      gallery: string[];
      rating: number;
      reviews: number;
      seats: number;
      fuel: string;
      transmission: string;
      year: number;
      features: string[];
      pricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
      originalPricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
    };
    vendor: {
      id: string;
      name: string;
      rating: number;
      image?: string;
      logo_url?: string;
      verified: boolean;
      carsCount: number;
      location?: string;
      phone?: string;
      email?: string;
      website?: string;
      description?: string;
      total_reviews?: number;
    };
  };
  selectedPricing: "daily" | "weekly" | "monthly";
}

const OfferDetailsContent = ({
  offer,
  selectedPricing,
}: OfferDetailsContentProps) => {
  const { t } = useLanguage();

  // Check if there's an active discount
  const hasDiscount = offer?.discount !== 0;
  return (
    <div className="space-y-6">
      {/* Car Info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-start rtl:flex-row-reverse md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {offer.car.name}
            </h1>
            <p className="text-gray-600 text-lg">
              {offer.car.brand} • {offer.car.year}
            </p>
          </div>
          <div className="text-start">
            <div className="flex flex-col md:items-end space-y-2">
              <div className="flex items-center gap-2 rtl:gap-reverse">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {t("sarPerDay")} {offer.car.pricing[selectedPricing]}
                </div>
                {hasDiscount && (
                  <div className="bg-black/40 text-white px-2 py-1 rounded-lg text-sm font-medium">
                    {`${offer.discount}% ${t("discount")} `}
                  </div>
                )}
                {hasDiscount && (
                  <div className="text-lg line-through text-gray-400">
                    {t("currency")} {offer.car.originalPricing[selectedPricing]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Car Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="flex items-center gap-3 rtl:gap-reverse p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.seats}
              </div>
              <div className="text-xs text-gray-500">{t("seats")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rtl:gap-reverse p-3 bg-gray-50 rounded-lg">
            <Fuel className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.fuel}
              </div>
              <div className="text-xs text-gray-500">{t("fuel")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rtl:gap-reverse p-3 bg-gray-50 rounded-lg">
            <Settings className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.transmission}
              </div>
              <div className="text-xs text-gray-500">{t("transmission")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rtl:gap-reverse p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.year}
              </div>
              <div className="text-xs text-gray-500">{t("year")}</div>
            </div>
          </div>
          {offer.rentalCarDetails.withDriver && (
            <div className="flex items-center gap-3 rtl:gap-reverse p-3 bg-gray-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {t("driver")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Car Features */} 

        {/* <CarFeatures features={offer.car.features} /> */}
      </div>
    </div>
  );
};

export default OfferDetailsContent;
