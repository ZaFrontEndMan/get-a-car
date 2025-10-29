import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PricingSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const PricingSection = ({ formData, handleChange, t }: PricingSectionProps) => {
  // Handle number input with validation
  const handleNumberChange = (field: string, value: string) => {
    // Allow empty string
    if (value === "") {
      handleChange(field, "");
      return;
    }

    // Allow only numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      const numValue = parseFloat(value);
      handleChange(field, isNaN(numValue) ? "" : numValue);
    }
  };

  // Prevent scroll on wheel event
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <div dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg font-semibold mb-4">{t("pricing")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="daily_rate">{t("daily_rate")} *</Label>
          <Input
            id="daily_rate"
            type="text"
            inputMode="decimal"
            value={formData.daily_rate || ""}
            onChange={(e) => handleNumberChange("daily_rate", e.target.value)}
            onWheel={handleWheel}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="weekly_rate">{t("weekly_rate")}</Label>
          <Input
            id="weekly_rate"
            type="text"
            inputMode="decimal"
            value={formData.weekly_rate || ""}
            onChange={(e) => handleNumberChange("weekly_rate", e.target.value)}
            onWheel={handleWheel}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="monthly_rate">{t("monthly_rate")}</Label>
          <Input
            id="monthly_rate"
            type="text"
            inputMode="decimal"
            value={formData.monthly_rate || ""}
            onChange={(e) => handleNumberChange("monthly_rate", e.target.value)}
            onWheel={handleWheel}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="deposit_amount">{t("deposit_amount")}</Label>
          <Input
            id="deposit_amount"
            type="text"
            inputMode="decimal"
            value={formData.deposit_amount || ""}
            onChange={(e) =>
              handleNumberChange("deposit_amount", e.target.value)
            }
            onWheel={handleWheel}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
