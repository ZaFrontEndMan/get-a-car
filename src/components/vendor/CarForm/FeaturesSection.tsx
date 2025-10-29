import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const toggleFeature = (apiField: string) => {
    if (formData.features.includes(apiField)) {
      const updated = formData.features.filter((f) => f !== apiField);
      handleChange("features", updated);
    } else {
      handleChange("features", [...formData.features, apiField]);
    }
  };

  const isFeatureSelected = (apiField: string): boolean => {
    return formData.features.includes(apiField);
  };

  const removeFeature = (apiField: string) => {
    const updated = formData.features.filter((f) => f !== apiField);
    handleChange("features", updated);
  };
  console.log(formData);

  return (
    <Card dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">{t("car_features")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {/* Safety Features */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("safety_features")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["airbag", "absBrakes", "ebdBrakes", "fogLights", "sensors"].map(
                (feature) => (
                  <Button
                    key={feature}
                    type="button"
                    variant={isFeatureSelected(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature(feature)}
                  >
                    {t(feature)}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Comfort Features */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("comfort_features")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["cruiseControl", "electricMirrors", "power"].map((feature) => (
                <Button
                  key={feature}
                  type="button"
                  variant={isFeatureSelected(feature) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(feature)}
                >
                  {t(feature)}
                </Button>
              ))}
            </div>
          </div>

          {/* Entertainment & Connectivity */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("entertainment_connectivity")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["bluetooth", "gps", "usbInput", "audioInput", "cdPlayer"].map(
                (feature) => (
                  <Button
                    key={feature}
                    type="button"
                    variant={isFeatureSelected(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature(feature)}
                  >
                    {t(feature)}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("additional_features")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["roofBox", "remoteControl"].map((feature) => (
                <Button
                  key={feature}
                  type="button"
                  variant={isFeatureSelected(feature) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(feature)}
                >
                  {t(feature)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {formData.features.length > 0 ? (
          <div>
            <Label>
              {t("selected_features")} ({formData.features.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, index) => (
                <Badge
                  key={`${feature}-${index}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {t(feature)}
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
        ) : null}
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
