import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { addDays } from "date-fns";
import {
  calculateBookingPrice,
  Service,
  PricingBreakdown,
  getOptimalPricingType,
} from "../utils/pricingCalculator";

// Helper to format calculation string with translations
const formatCalculationWithTranslations = (
  pricingDetails: PricingBreakdown["pricingDetails"],
  t: (key: string) => string
) => {
  const calc = pricingDetails.calculation;

  // Replace "day" and "days" with translated versions
  let formatted = calc;

  // Replace singular "day" (when preceded by "1 " or at start with "1")
  formatted = formatted.replace(/(\b1\s+)day(\s|×)/g, `$1${t("day")}$2`);

  // Replace plural "days" (when preceded by a number > 1)
  formatted = formatted.replace(/(\d+)\s+days(\s|×)/g, (match, num) => {
    return `${num} ${t("days")}${match.includes("×") ? " ×" : ""}`;
  });

  return formatted;
};

interface InitialFilters {
  pickupLocation?: string;
  dropOffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
}

// Helper to compactly format calculation string (kept for backward compatibility)
const formatCalculationSimple = (
  pricingDetails: PricingBreakdown["pricingDetails"]
) => {
  // If calculation already contains formatted string, use it directly
  // Otherwise parse and format it
  const calc = pricingDetails.calculation;

  // Check if it's already in the new format (e.g., "7 days × 3,780 = 26,460")
  if (calc.includes("days ×") || calc.includes("day ×")) {
    return calc;
  }

  // Otherwise, try to parse the old format
  const lines: string[] = [];
  if (pricingDetails.monthlyPeriods) {
    const match = calc.match(/(\d+)\s+monthRate.*?=\s+(\d+)/);
    if (match) {
      lines.push(
        `${match[1]} month${match[1] !== "1" ? "s" : ""} × ${parseInt(
          match[2]
        ).toLocaleString()} = ${(
          pricingDetails.monthlyPeriods * parseInt(match[2])
        ).toLocaleString()}`
      );
    }
  }
  if (pricingDetails.weeklyPeriods) {
    const match = calc.match(/(\d+)\s+week.*?=\s+(\d+)/);
    if (match) {
      lines.push(
        `${match[1]} week${match[1] !== "1" ? "s" : ""} × ${parseInt(
          match[2]
        ).toLocaleString()} = ${(
          pricingDetails.weeklyPeriods * parseInt(match[2])
        ).toLocaleString()}`
      );
    }
  }
  if (pricingDetails.remainingDays) {
    const match = calc.match(/(\d+)\s+day.*?=\s+(\d+)/);
    if (match) {
      lines.push(
        `${match[1]} day${match[1] !== "1" ? "s" : ""} × ${parseInt(
          match[2]
        ).toLocaleString()} = ${parseInt(match[2]).toLocaleString()}`
      );
    }
  }
  return lines.length ? lines.join(" + ") : calc;
};

export const useOfferDetailsState = (initialFilters: InitialFilters = {}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

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

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Calculate initial rental days from URL params
  const calculateDaysFromDates = (pickup: string, dropoff: string): number => {
    if (!pickup || !dropoff) return 1;
    try {
      const pickupDate = new Date(pickup);
      const dropoffDate = new Date(dropoff);
      const diffTime = dropoffDate.getTime() - pickupDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    } catch {
      return 1;
    }
  };

  const initialRentalDays = calculateDaysFromDates(
    initialFilters.pickupDate || "",
    initialFilters.dropoffDate || ""
  );

  const [rentalDays, setRentalDays] = useState(initialRentalDays);

  // Auto-select pricing type based on initial rental days
  const getInitialPricingType = (
    days: number
  ): "daily" | "weekly" | "monthly" => {
    if (days >= 30) return "monthly";
    if (days >= 7) return "weekly";
    return "daily";
  };

  const [selectedPricing, setSelectedPricing] = useState<
    "daily" | "weekly" | "monthly"
  >(getInitialPricingType(initialRentalDays));

  // Update pricing type when rental days change significantly
  useEffect(() => {
    const optimalType = getOptimalPricingType(rentalDays, {
      daily: 0,
      weekly: 0,
      monthly: 0,
    });
    // Only auto-update if current selection doesn't match optimal
    if (optimalType !== selectedPricing) {
      // Check if current selection is still valid
      if (selectedPricing === "weekly" && rentalDays < 7) {
        setSelectedPricing(optimalType);
      } else if (selectedPricing === "monthly" && rentalDays < 30) {
        setSelectedPricing(optimalType);
      }
    }
  }, [rentalDays]);

  // Update dropoff date when pricing type changes and days need adjustment
  useEffect(() => {
    if (!pickupDate) return;

    let requiredDays = rentalDays;

    // Determine minimum days based on pricing type
    if (selectedPricing === "weekly" && rentalDays < 7) {
      requiredDays = 7;
      setRentalDays(7);
    } else if (selectedPricing === "monthly" && rentalDays < 30) {
      requiredDays = 30;
      setRentalDays(30);
    }

    // Update dropoff date based on pickup date and required days
    if (requiredDays !== rentalDays || !dropoffDate) {
      try {
        const pickup = new Date(pickupDate);
        const newDropoff = addDays(pickup, requiredDays);
        const newDropoffString = newDropoff.toISOString().split("T")[0];
        if (newDropoffString !== dropoffDate) {
          setDropoffDate(newDropoffString);
        }
      } catch (error) {
        console.error("Error updating dropoff date:", error);
      }
    }
  }, [selectedPricing]);
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

    // Pass selectedPricing to calculateBookingPrice
    const dynamicPricing = calculateBookingPrice(
      rentalDays,
      offer.car.pricing,
      services,
      selectedPricing
    );
    // Add a formatted calculation string for easy display in UI with translations
    return {
      ...dynamicPricing,
      formattedCalculation: formatCalculationWithTranslations(
        dynamicPricing.pricingDetails,
        t
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
