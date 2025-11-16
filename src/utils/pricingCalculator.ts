/**
 * Dynamic pricing calculator for car rentals
 * Handles complex daily/weekly/monthly pricing logic
 */

export interface PricingBreakdown {
  basePrice: number;
  servicesPrice: number;
  totalPrice: number;
  pricingDetails: {
    days: number;
    weeklyPeriods: number;
    monthlyPeriods: number;
    remainingDays: number;
    calculation: string;
  };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
}

export interface CarPricing {
  daily: number;
  weekly: number;
  monthly: number;
}

/**
 * Calculate base rental price based on number of days
 * @param days - Number of rental days
 * @param pricing - Car pricing structure
 * @returns Base price and calculation details
 */
export const calculateBasePrice = (
  days: number,
  pricing: CarPricing
): { price: number; details: any } => {
  if (days <= 0)
    return {
      price: 0,
      details: {
        days: 0,
        weeklyPeriods: 0,
        monthlyPeriods: 0,
        remainingDays: 0,
        calculation: "No days selected",
      },
    };

  const { daily, weekly, monthly } = pricing;
  let totalPrice = 0;
  let weeklyPeriods = 0;
  let monthlyPeriods = 0;
  let remainingDays = days;
  let calculation = "";

  // Calculate monthly periods first
  monthlyPeriods = Math.floor(days / 30);
  remainingDays = days % 30;
  totalPrice += monthlyPeriods * monthly;

  if (monthlyPeriods > 0) {
    calculation += `${monthlyPeriods} monthRate${
      monthlyPeriods > 1 ? "s" : ""
    } × ${monthly} = ${monthlyPeriods * monthly}`;
  }

  // Handle remaining days (0-29)
  if (remainingDays > 0) {
    if (remainingDays >= 7) {
      // Convert to weekly if 7+ days remain
      const weeks = Math.floor(remainingDays / 7);
      const extraDays = remainingDays % 7;

      weeklyPeriods += weeks;
      totalPrice += weeks * weekly;

      if (calculation) calculation += " + ";
      calculation += `${weeks} week${weeks > 1 ? "s" : ""} × ${weekly} = ${
        weeks * weekly
      }`;

      if (extraDays > 0) {
        totalPrice += extraDays * daily;
        calculation += ` + ${extraDays} day${
          extraDays > 1 ? "s" : ""
        } × ${daily} = ${extraDays * daily}`;
      }
    } else {
      // Use daily rate for remaining days
      totalPrice += remainingDays * daily;
      if (calculation) calculation += " + ";
      calculation += `${remainingDays} day${
        remainingDays > 1 ? "s" : ""
      } × ${daily} = ${remainingDays * daily}`;
    }
  }

  return {
    price: totalPrice,
    details: {
      days,
      weeklyPeriods,
      monthlyPeriods,
      remainingDays: remainingDays % 7,
      calculation:
        calculation ||
        `${days} day${days > 1 ? "s" : ""} × ${daily} = ${totalPrice}`,
    },
  };
};

/**
 * Calculate total booking price including services
 * @param days - Number of rental days
 * @param pricing - Car pricing structure
 * @param selectedServices - Array of selected services
 * @returns Complete pricing breakdown
 */
export const calculateBookingPrice = (
  days: number,
  pricing: CarPricing,
  selectedServices: Service[] = []
): PricingBreakdown => {
  const baseCalculation = calculateBasePrice(days, pricing);
  const servicesPrice = selectedServices
    .filter((service) => service.selected)
    .reduce((total, service) => total + service.price, 0);

  return {
    basePrice: baseCalculation.price,
    servicesPrice,
    totalPrice: baseCalculation.price + servicesPrice,
    pricingDetails: baseCalculation.details,
  };
};

/**
 * Get the most cost-effective pricing type for a given number of days
 * @param days - Number of rental days
 * @param pricing - Car pricing structure
 * @returns Most cost-effective pricing type
 */
export const getOptimalPricingType = (
  days: number,
  pricing: CarPricing
): "daily" | "weekly" | "monthly" => {
  const dailyTotal = days * pricing.daily;
  const weeklyTotal = Math.ceil(days / 7) * pricing.weekly;
  const monthlyTotal = Math.ceil(days / 30) * pricing.monthly;

  if (monthlyTotal <= weeklyTotal && monthlyTotal <= dailyTotal)
    return "monthly";
  if (weeklyTotal <= dailyTotal) return "weekly";
  return "daily";
};

/**
 * Format pricing breakdown for display
 * @param breakdown - Pricing breakdown object
 * @param currency - Currency symbol
 * @returns Formatted breakdown strings
 */
export const formatPricingBreakdown = (
  breakdown: PricingBreakdown,
  currency: string = "SAR"
) => {
  return {
    basePrice: `${currency} ${breakdown.basePrice.toLocaleString()}`,
    servicesPrice: `${currency} ${breakdown.servicesPrice.toLocaleString()}`,
    totalPrice: breakdown.totalPrice,
    calculation: breakdown.pricingDetails.calculation,
  };
};
