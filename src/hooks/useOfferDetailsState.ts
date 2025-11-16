import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  calculateBookingPrice,
  Service,
  PricingBreakdown,
} from "../utils/pricingCalculator";

interface InitialFilters {
  pickupLocation?: string;
  dropOffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
}

export const useOfferDetailsState = (initialFilters: InitialFilters = {}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Initial state with support for passed-in values or fallback to empty string
  const [selectedPickup, setSelectedPickup] = useState(
    initialFilters.pickupLocation || ""
  );
  const [selectedDropoff, setSelectedDropoff] = useState(
    initialFilters.dropOffLocation || ""
  );
  const [pickupDate, setPickupDate] = useState(initialFilters.pickupDate || "");
  const [dropoffDate, setDropoffDate] = useState(
    initialFilters.dropoffDate || ""
  );

  const [selectedPricing, setSelectedPricing] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);

  const calculateTotalPrice = (
    offer: any,
    additionalServices: any[]
  ): PricingBreakdown => {
    if (!offer) {
      return {
        basePrice: 0,
        servicesPrice: 0,
        totalPrice: 0,
        pricingDetails: {
          days: 0,
          weeklyPeriods: 0,
          monthlyPeriods: 0,
          remainingDays: 0,
          calculation: "No offer data",
        },
      };
    }

    const services: Service[] = additionalServices.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      selected: selectedServices.includes(service.id),
    }));

    const dynamicPricing = calculateBookingPrice(
      rentalDays,
      offer.car.pricing,
      services
    );
    return dynamicPricing;
  };

  const handleBookNow = () => {
    setIsBookingOpen(true);
    setIsLoginOpen(!user);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsBookingOpen(true);
  };

  return {
    selectedPricing,
    setSelectedPricing,
    selectedServices,
    setSelectedServices,
    selectedPickup,
    setSelectedPickup,
    selectedDropoff,
    setSelectedDropoff,
    pickupDate,
    setPickupDate,
    dropoffDate,
    setDropoffDate,
    isBookingOpen,
    setIsBookingOpen,
    isLoginOpen,
    setIsLoginOpen,
    rentalDays,
    setRentalDays,
    calculateTotalPrice,
    handleBookNow,
    handleLoginSuccess,
  };
};
