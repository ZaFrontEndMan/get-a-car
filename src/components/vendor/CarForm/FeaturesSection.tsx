import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FeaturesSectionProps {
  formData: {
    // Direct boolean fields from Car interface
    electricMirrors?: boolean;
    cruiseControl?: boolean;
    fogLights?: boolean;
    power?: boolean;
    roofBox?: boolean;
    gps?: boolean;
    remoteControl?: boolean;
    audioInput?: boolean;
    cdPlayer?: boolean;
    bluetooth?: boolean;
    usbInput?: boolean;
    sensors?: boolean;
    ebdBrakes?: boolean;
    airbag?: boolean;
    absBrakes?: boolean;
    // Add airBagCount if needed for airbag
    airBagCount?: number;
  };
  handleChange: (field: keyof typeof formData, value: boolean | number) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const FeaturesSection = ({
  formData,
  handleChange,
  t,
}: FeaturesSectionProps) => {
  // Toggle feature helper - direct boolean toggle
  const toggleFeature = (field: keyof typeof formData) => {
    if (field === "airBagCount") return; // Don't toggle count directly

    const currentValue = formData[field as keyof typeof formData];
    const newValue = !(currentValue ?? false);

    handleChange(field, newValue);

    // Special handling for airbag - reset count when disabled
    if (field === "airbag" && !newValue) {
      handleChange("airBagCount" as keyof typeof formData, 0);
    }
  };

  // Check if feature is selected - safe boolean check
  const isFeatureSelected = (field: keyof typeof formData): boolean => {
    return !!formData[field as keyof typeof formData];
  };

  // Get all selected features for display
  const selectedFeatures = React.useMemo(() => {
    const features: Array<{ key: keyof typeof formData; label: string }> = [];

    if (isFeatureSelected("absBrakes"))
      features.push({ key: "absBrakes", label: t("absBrakes") });
    if (isFeatureSelected("airbag"))
      features.push({ key: "airbag", label: t("airbag") });
    if (isFeatureSelected("audioInput"))
      features.push({ key: "audioInput", label: t("audioInput") });
    if (isFeatureSelected("bluetooth"))
      features.push({ key: "bluetooth", label: t("bluetooth") });
    if (isFeatureSelected("cdPlayer"))
      features.push({ key: "cdPlayer", label: t("cdPlayer") });
    if (isFeatureSelected("cruiseControl"))
      features.push({ key: "cruiseControl", label: t("cruiseControl") });
    if (isFeatureSelected("ebdBrakes"))
      features.push({ key: "ebdBrakes", label: t("ebdBrakes") });
    if (isFeatureSelected("electricMirrors"))
      features.push({ key: "electricMirrors", label: t("electricMirrors") });
    if (isFeatureSelected("fogLights"))
      features.push({ key: "fogLights", label: t("fogLights") });
    if (isFeatureSelected("gps"))
      features.push({ key: "gps", label: t("gps") });
    if (isFeatureSelected("power"))
      features.push({ key: "power", label: t("power") });
    if (isFeatureSelected("remoteControl"))
      features.push({ key: "remoteControl", label: t("remoteControl") });
    if (isFeatureSelected("roofBox"))
      features.push({ key: "roofBox", label: t("roofBox") });
    if (isFeatureSelected("sensors"))
      features.push({ key: "sensors", label: t("sensors") });
    if (isFeatureSelected("usbInput"))
      features.push({ key: "usbInput", label: t("usbInput") });

    return features;
  }, [formData, t]);

  const removeFeature = (field: keyof typeof formData) => {
    handleChange(field, false);

    // Special handling for airbag
    if (field === "airbag") {
      handleChange("airBagCount" as keyof typeof formData, 0);
    }
  };

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
              {[
                { key: "airbag" as const, label: t("airbag") },
                { key: "absBrakes" as const, label: t("absBrakes") },
                { key: "ebdBrakes" as const, label: t("ebdBrakes") },
                { key: "fogLights" as const, label: t("fogLights") },
                { key: "sensors" as const, label: t("sensors") },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant={isFeatureSelected(key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(key)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Comfort Features */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("comfort_features")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "cruiseControl" as const, label: t("cruiseControl") },
                {
                  key: "electricMirrors" as const,
                  label: t("electricMirrors"),
                },
                { key: "power" as const, label: t("power") },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant={isFeatureSelected(key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(key)}
                  className="capitalize"
                >
                  {label}
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
              {[
                { key: "bluetooth" as const, label: t("bluetooth") },
                { key: "gps" as const, label: t("gps") },
                { key: "usbInput" as const, label: t("usbInput") },
                { key: "audioInput" as const, label: t("audioInput") },
                { key: "cdPlayer" as const, label: t("cdPlayer") },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant={isFeatureSelected(key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(key)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("additional_features")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "roofBox" as const, label: t("roofBox") },
                { key: "remoteControl" as const, label: t("remoteControl") },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant={isFeatureSelected(key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeature(key)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Features Display */}
        {selectedFeatures.length > 0 ? (
          <div>
            <Label>
              {t("selected_features")} ({selectedFeatures.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedFeatures.map(({ key, label }) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(key)}
                    className="h-4 w-4 p-0 ms-1 hover:bg-transparent"
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
