import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import PricingOptions from "./PricingOptions";
import { Plus } from "lucide-react";
import {
  formatPricingBreakdown,
  PricingBreakdown,
} from "../utils/pricingCalculator";
import { Button } from "./ui/button";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  selected: boolean;
}

interface OfferDetailsSidebarProps {
  offer: {
    car: {
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
    locations: string[];
    dropoffLocations?: string[];
    discount: string;
    discountPercentage: number;
  };
  selectedPricing: "daily" | "weekly" | "monthly";
  onPricingSelect: (option: "daily" | "weekly" | "monthly") => void;
  additionalServices: Service[];
  selectedServices: string[];
  onServicesChange: (selected: string[]) => void;
  selectedPickup: string;
  selectedDropoff: string;
  onPickupChange: (location: string) => void;
  onDropoffChange: (location: string) => void;
  rentalDays: number;
  onRentalDaysChange: (days: number) => void;
  pricingBreakdown: PricingBreakdown;
  onBookNow: () => void;
}

const OfferDetailsSidebar = ({
  offer,
  selectedPricing,
  onPricingSelect,
  additionalServices,
  selectedServices,
  onServicesChange,
  selectedPickup,
  selectedDropoff,
  onPickupChange,
  onDropoffChange,
  pricingBreakdown,
  onBookNow,
}: OfferDetailsSidebarProps) => {
  const { t } = useLanguage();

  const formattedPricing = formatPricingBreakdown(
    pricingBreakdown,
    t("currency")
  );

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter((id) => id !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pricing Options */}
      <PricingOptions pricing={offer.car.pricing} selected={selectedPricing} />

      {/* Location Picker */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <span>{t("pickupAndDropoff")}</span>
        </h3>

        <div className="space-y-6">
          {/* Pickup Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("pickupLocation")}
            </h4>
            <div className="space-y-2">
              {offer.locations.map((location, index) => (
                <div
                  key={`pickup-${index}`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="pickupLocation"
                    value={location}
                    checked={selectedPickup === location}
                    onChange={() => onPickupChange(location)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 ml-3 rtl:mr-3"
                  />
                  <span className="text-gray-900 px-3">{location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dropoff Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("dropoffLocation")}
            </h4>
            <div className="space-y-2">
              {(offer.dropoffLocations || offer.locations).map(
                (location, index) => (
                  <div
                    key={`dropoff-${index}`}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="dropoffLocation"
                      value={location}
                      checked={selectedDropoff === location}
                      onChange={() => onDropoffChange(location)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 ml-3 rtl:mr-3"
                    />
                    <span className="text-gray-900 px-3">{location}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <Plus className="h-5 w-5 text-primary" />
          <span>{t("additionalServices")}</span>
        </h3>

        <div className="space-y-3">
          {additionalServices && additionalServices.length > 0 ? (
            additionalServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900 px-[7px]">
                      {service.name}
                    </span>
                    {service.description && (
                      <p className="text-xs text-gray-600 px-[7px]">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-primary font-semibold">
                  +{t("currency")} {service.price}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t("noAdditionalServices")}
            </div>
          )}
        </div>
      </div>

      {/* Total & Book Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t("basePrice")}:</span>
            <span className="text-sm font-medium">
              {formattedPricing.basePrice}
            </span>
          </div>

          {pricingBreakdown.servicesPrice > 0 && (
            <div 
              key={`services-${pricingBreakdown.servicesPrice}`}
              className="flex justify-between items-center animate-in slide-in-from-top-2 fade-in duration-200 ease-out"
            >
              <span className="text-sm text-gray-600">
                {t("additionalServices")}:
              </span>
              <span className="text-sm font-medium animate-in zoom-in-50 duration-300 delay-200">
                +{formattedPricing.servicesPrice}
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{t("total")}:</span>
              <span className="text-2xl font-bold text-primary">
                {formattedPricing.totalPrice}
              </span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onBookNow}>
          {t("bookThisOffer")}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {t("freeCancellation")}
        </p>
      </div>
    </div>
  );
};

export default OfferDetailsSidebar;
