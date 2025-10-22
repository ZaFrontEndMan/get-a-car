import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  calculateBookingPrice,
  Service,
  CarPricing,
  PricingBreakdown,
} from "../utils/pricingCalculator";

export const useOfferDetailsState = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPricing, setSelectedPricing] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedDropoff, setSelectedDropoff] = useState("");
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

    // Convert additional services to the format expected by pricing calculator
    const services: Service[] = additionalServices.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      selected: selectedServices.includes(service.id),
    }));
    console.log(services);

    // Use dynamic pricing calculation based on rental days
    const dynamicPricing = calculateBookingPrice(
      rentalDays,
      offer.car.pricing,
      services
    );

    return dynamicPricing;
  };

  const handleBookNow = () => {
    setIsBookingOpen(true);
    if (!user) {
      setIsLoginOpen(true);
    } else {
      setIsLoginOpen(false);
    }
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
