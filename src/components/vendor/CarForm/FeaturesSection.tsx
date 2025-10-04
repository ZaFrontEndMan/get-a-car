import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface FeaturesSectionProps {
  formData: {
    features: string[];
  };
  handleChange: (field: string, value: any) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const FeaturesSection = ({
  formData,
  handleChange,
  t,
}: FeaturesSectionProps) => {
  const [newFeature, setNewFeature] = useState("");

  const commonFeatures = [
    "air_conditioning",
    "bluetooth",
    "gps_navigation",
    "backup_camera",
    "leather_seats",
    "sunroof",
    "cruise_control",
    "usb_charging",
    "apple_carplay",
    "android_auto",
    "heated_seats",
    "parking_sensors",
    "keyless_entry",
    "premium_sound_system",
    "all_wheel_drive",
  ];

  const addFeature = (feature: string) => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      const updatedFeatures = [...formData.features, feature.trim()];
      handleChange("features", updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const updatedFeatures = formData.features.filter(
      (feature) => feature !== featureToRemove
    );
    handleChange("features", updatedFeatures);
  };

  return (
    <Card dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">{t("car_features")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-feature">{t("add_custom_feature")}</Label>
            <Input
              id="new-feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder={t("enter_feature_name")}
            />
          </div>
          <Button
            type="button"
            onClick={() => addFeature(newFeature)}
            className="mt-6"
            disabled={!newFeature.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("add")}
          </Button>
        </div>

        <div>
          <Label>{t("quick_add_common_features")}</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonFeatures.map((featureKey) => (
              <Button
                key={featureKey}
                type="button"
                variant={
                  formData.features.includes(t(featureKey))
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  formData.features.includes(t(featureKey))
                    ? removeFeature(t(featureKey))
                    : addFeature(t(featureKey))
                }
              >
                {t(featureKey)}
              </Button>
            ))}
          </div>
        </div>

        {formData.features.length > 0 && (
          <div>
            <Label>
              {t("selected_features")} ({formData.features.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(feature)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
