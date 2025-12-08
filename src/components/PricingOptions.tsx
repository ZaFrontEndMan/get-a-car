import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Check } from "lucide-react";

interface PricingOptionsProps {
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  selected?: "daily" | "weekly" | "monthly";
  onSelect?: (period: "daily" | "weekly" | "monthly") => void;
  rentalDays?: number;
}

const PricingOptions = ({ 
  pricing, 
  selected: controlledSelected,
  onSelect,
  rentalDays = 1
}: PricingOptionsProps) => {
  const { t } = useLanguage();
  const [internalSelected, setInternalSelected] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  
  // Use controlled selection if provided, otherwise use internal state
  const selectedPeriod = controlledSelected ?? internalSelected;

  const options = [
    {
      key: "daily" as const,
      label: t("dailyRate") || "Daily Rate",
      price: pricing.daily,
      minDays: 1,
    },
    {
      key: "weekly" as const,
      label: t("weeklyRate") || "Weekly Rate",
      price: pricing.weekly,
      minDays: 7,
    },
    {
      key: "monthly" as const,
      label: t("monthlyRate") || "Monthly Rate",
      price: pricing.monthly,
      minDays: 30,
    },
  ];

  const handleSelectPeriod = (period: "daily" | "weekly" | "monthly") => {
    if (onSelect) {
      // Controlled mode - notify parent
      onSelect(period);
    } else {
      // Uncontrolled mode - update internal state
      setInternalSelected(period);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
        {t("rentalPeriod") || "Rental Period"}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSelectPeriod(option.key)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedPeriod === option.key
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-primary/50 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center rtl:md:flex-row-reverse md:justify-between gap-4">
              {/* Left Section - Label and Savings */}
              <div className="flex items-center gap-3 rtl:flex-row-reverse text-start rtl:text-end flex-1">
                {/* Checkmark */}
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPeriod === option.key
                      ? "border-primary bg-primary"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedPeriod === option.key && (
                    <Check className="h-3 w-3 text-white flex-shrink-0" />
                  )}
                </div>

                {/* Label and Savings */}
                <div>
                  <div className="font-semibold text-gray-900">
                    {option.label}
                  </div>
                  {option.minDays > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {t("minimumDays") || "Min"} {option.minDays} {t("days") || "days"}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Price */}
              <div className="text-end rtl:text-start md:flex-shrink-0">
                <div className="text-lg md:text-xl font-bold text-primary">
                  {t("currency")} {option.price}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>{" "}
    </div>
  );
};

export default PricingOptions;
