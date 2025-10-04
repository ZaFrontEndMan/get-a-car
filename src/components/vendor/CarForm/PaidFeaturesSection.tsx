import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaidFeature {
  title: string;
  price: number;
}

interface PaidFeaturesSectionProps {
  paidFeatures: PaidFeature[];
  setPaidFeatures: React.Dispatch<React.SetStateAction<PaidFeature[]>>;
  t: (key: string, params?: Record<string, any>) => string;
}

const PaidFeaturesSection = ({
  paidFeatures,
  setPaidFeatures,
  t,
}: PaidFeaturesSectionProps) => {
  const addPaidFeature = () => {
    setPaidFeatures([...paidFeatures, { title: "", price: 0 }]);
  };

  const removePaidFeature = (index: number) => {
    setPaidFeatures(paidFeatures.filter((_, i) => i !== index));
  };

  const updatePaidFeature = (
    index: number,
    field: keyof PaidFeature,
    value: string | number
  ) => {
    const updated = paidFeatures.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setPaidFeatures(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {t("additional_paid_features")}
        </h3>
        <Button type="button" onClick={addPaidFeature} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("add_feature")}
        </Button>
      </div>
      {paidFeatures.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Input
            placeholder={t("feature_title")}
            value={feature.title}
            onChange={(e) => updatePaidFeature(index, "title", e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            step="0.01"
            placeholder={t("price_sar")}
            value={feature.price}
            onChange={(e) =>
              updatePaidFeature(index, "price", parseFloat(e.target.value) || 0)
            }
            className="w-32"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removePaidFeature(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PaidFeaturesSection;
