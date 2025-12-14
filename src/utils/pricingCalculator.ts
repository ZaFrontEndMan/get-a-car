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
 * @param pricingType - Selected pricing type (optional, for manual selection)
 * @param t - Translation function (optional, for localized calculation strings)
 * @returns Base price and calculation details
 */
export const calculateBasePrice = (
  days: number,
  pricing: CarPricing,
  pricingType?: "daily" | "weekly" | "monthly",
  t?: (key: string) => string
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

  // If a specific pricing type is selected, use that logic
  if (pricingType === "weekly") {
    // Weekly pricing: minimum 7 days
    // Calculate: full weeks × weeklyPrice + remaining days × dailyPrice
    if (days < 7) {
      // Enforce minimum 7 days
      const adjustedDays = 7;
      const fullWeeks = Math.floor(adjustedDays / 7);
      const remainingDays = adjustedDays % 7;
      totalPrice = fullWeeks * weekly + remainingDays * daily;
      
      const weekLabel = t 
        ? (fullWeeks !== 1 ? (t("weeks") || "weeks") : (t("week") || "week"))
        : (fullWeeks !== 1 ? "weeks" : "week");
      const dayLabel = remainingDays !== 1 
        ? (t ? (t("days") || "days") : "days")
        : (t ? (t("day") || "day") : "day");
      
      calculation = `${fullWeeks} ${weekLabel} × ${weekly.toLocaleString()}`;
      if (remainingDays > 0) {
        calculation += ` + ${remainingDays} ${dayLabel} × ${daily.toLocaleString()}`;
      }
      calculation += ` = ${totalPrice.toLocaleString()}`;
      
      return {
        price: totalPrice,
        details: {
          days: adjustedDays,
          weeklyPeriods: fullWeeks,
          monthlyPeriods: 0,
          remainingDays: remainingDays,
          calculation,
        },
      };
    } else {
      // Calculate full weeks and remaining days
      const fullWeeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      totalPrice = fullWeeks * weekly + remainingDays * daily;
      
      const weekLabel = t 
        ? (fullWeeks !== 1 ? (t("weeks") || "weeks") : (t("week") || "week"))
        : (fullWeeks !== 1 ? "weeks" : "week");
      const dayLabel = remainingDays !== 1 
        ? (t ? (t("days") || "days") : "days")
        : (t ? (t("day") || "day") : "day");
      
      calculation = `${fullWeeks} ${weekLabel} × ${weekly.toLocaleString()}`;
      if (remainingDays > 0) {
        calculation += ` + ${remainingDays} ${dayLabel} × ${daily.toLocaleString()}`;
      }
      calculation += ` = ${totalPrice.toLocaleString()}`;
      
      return {
        price: totalPrice,
        details: {
          days,
          weeklyPeriods: fullWeeks,
          monthlyPeriods: 0,
          remainingDays: remainingDays,
          calculation,
        },
      };
    }
  } else if (pricingType === "monthly") {
    // Monthly pricing: minimum 30 days
    // Calculate: full months × monthlyPrice + remaining days × dailyPrice
    if (days < 30) {
      // Enforce minimum 30 days
      const adjustedDays = 30;
      const fullMonths = Math.floor(adjustedDays / 30);
      const remainingDays = adjustedDays % 30;
      totalPrice = fullMonths * monthly + remainingDays * daily;
      
      const monthLabel = t 
        ? (fullMonths !== 1 ? (t("months") || "months") : (t("month") || "month"))
        : (fullMonths !== 1 ? "months" : "month");
      const dayLabel = remainingDays !== 1 
        ? (t ? (t("days") || "days") : "days")
        : (t ? (t("day") || "day") : "day");
      
      calculation = `${fullMonths} ${monthLabel} × ${monthly.toLocaleString()}`;
      if (remainingDays > 0) {
        calculation += ` + ${remainingDays} ${dayLabel} × ${daily.toLocaleString()}`;
      }
      calculation += ` = ${totalPrice.toLocaleString()}`;
      
      return {
        price: totalPrice,
        details: {
          days: adjustedDays,
          weeklyPeriods: 0,
          monthlyPeriods: fullMonths,
          remainingDays: remainingDays,
          calculation,
        },
      };
    } else {
      // Calculate full months and remaining days
      const fullMonths = Math.floor(days / 30);
      const remainingDays = days % 30;
      totalPrice = fullMonths * monthly + remainingDays * daily;
      
      const monthLabel = t 
        ? (fullMonths !== 1 ? (t("months") || "months") : (t("month") || "month"))
        : (fullMonths !== 1 ? "months" : "month");
      const dayLabel = remainingDays !== 1 
        ? (t ? (t("days") || "days") : "days")
        : (t ? (t("day") || "day") : "day");
      
      calculation = `${fullMonths} ${monthLabel} × ${monthly.toLocaleString()}`;
      if (remainingDays > 0) {
        calculation += ` + ${remainingDays} ${dayLabel} × ${daily.toLocaleString()}`;
      }
      calculation += ` = ${totalPrice.toLocaleString()}`;
      
      return {
        price: totalPrice,
        details: {
          days,
          weeklyPeriods: 0,
          monthlyPeriods: fullMonths,
          remainingDays: remainingDays,
          calculation,
        },
      };
    }
  } else if (pricingType === "daily") {
    // Daily pricing: dailyRate × rentalDays
    totalPrice = daily * days;
      const dayLabel = days !== 1 
        ? (t ? (t("days") || "days") : "days")
        : (t ? (t("day") || "day") : "day");
      calculation = `${days} ${dayLabel} × ${daily.toLocaleString()} = ${totalPrice.toLocaleString()}`;
    return {
      price: totalPrice,
      details: {
        days,
        weeklyPeriods: 0,
        monthlyPeriods: 0,
        remainingDays: 0,
        calculation,
      },
    };
  }

  // Default logic: Calculate monthly periods first (when no specific type selected)
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
 * @param pricingType - Selected pricing type (optional, for manual selection)
 * @returns Complete pricing breakdown
 */
export const calculateBookingPrice = (
  days: number,
  pricing: CarPricing,
  selectedServices: Service[] = [],
  pricingType?: "daily" | "weekly" | "monthly",
  t?: (key: string) => string
): PricingBreakdown => {
  const baseCalculation = calculateBasePrice(days, pricing, pricingType, t);
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
  // Auto-select based on days: <7 = daily, 7-29 = weekly, 30+ = monthly
  if (days >= 30) return "monthly";
  if (days >= 7) return "weekly";
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
