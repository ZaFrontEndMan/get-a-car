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

// Helper to compactly format calculation string (M=month, W=week, D=day)
const formatCalculationSimple = (
  pricingDetails: PricingBreakdown["pricingDetails"]
) => {
  const lines: string[] = [];
  if (pricingDetails.monthlyPeriods) {
    lines.push(
      `${pricingDetails.monthlyPeriods}M × ${
        pricingDetails.calculation
          .match(/([0-9]+ monthRate.*?= [0-9]+)/)?.[0]
          ?.split("=")[0]
          ?.match(/([0-9]+)/g)[1] || "monthly"
      }`
    );
  }
  if (pricingDetails.weeklyPeriods) {
    lines.push(
      `${pricingDetails.weeklyPeriods}W × ${
        pricingDetails.calculation
          .match(/([0-9]+ week.*?= [0-9]+)/)?.[0]
          ?.split("=")[0]
          ?.match(/([0-9]+)/g)[1] || "weekly"
      }`
    );
  }
  if (pricingDetails.remainingDays) {
    lines.push(
      `${pricingDetails.remainingDays}D × ${
        pricingDetails.calculation
          .match(/([0-9]+ day.*?= [0-9]+)/)?.[0]
          ?.split("=")[0]
          ?.match(/([0-9]+)/g)[1] || "daily"
      }`
    );
  }
  return lines.length ? lines.join(" + ") : pricingDetails.calculation;
};

export const useOfferDetailsState = (initialFilters: InitialFilters = {}) => {
  const { user } = useAuth();

  // Initial state setup
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
  const initialRentalDays =
    initialFilters.pickupDate && initialFilters.dropoffDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(initialFilters.dropoffDate).getTime() -
              new Date(initialFilters.pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const [rentalDays, setRentalDays] = useState(initialRentalDays);
  const calculateTotalPrice = (
    offer: any,
    additionalServices: any[]
  ): PricingBreakdown & { formattedCalculation: string } => {
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
        formattedCalculation: "No offer data",
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
    // Add a formatted calculation string for easy display in UI
    return {
      ...dynamicPricing,
      formattedCalculation: formatCalculationSimple(
        dynamicPricing.pricingDetails
      ),
    };
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
