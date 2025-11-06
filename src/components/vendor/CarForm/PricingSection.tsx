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
          <Label htmlFor="pricePerDay">{t("daily_rate")} *</Label>
          <Input
            id="pricePerDay"
            type="text"
            inputMode="decimal"
            value={formData.pricePerDay || ""}
            onChange={(e) => handleNumberChange("pricePerDay", e.target.value)}
            onWheel={handleWheel}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="pricePerWeek">{t("weekly_rate")}</Label>
          <Input
            id="pricePerWeek"
            type="text"
            inputMode="decimal"
            value={formData.pricePerWeek || ""}
            onChange={(e) => handleNumberChange("pricePerWeek", e.target.value)}
            onWheel={handleWheel}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="pricePerMonth">{t("monthly_rate")}</Label>
          <Input
            id="pricePerMonth"
            type="text"
            inputMode="decimal"
            value={formData.pricePerMonth || ""}
            onChange={(e) =>
              handleNumberChange("pricePerMonth", e.target.value)
            }
            onWheel={handleWheel}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="protectionPrice ">{t("protectionFee")}</Label>
          <Input
            id="protectionPrice"
            type="text"
            inputMode="decimal"
            value={formData.protectionPrice || ""}
            onChange={(e) =>
              handleNumberChange("protectionPrice", e.target.value)
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
