import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X, MapPin } from "lucide-react";

interface Location {
  id?: number;
  address: string;
  isActive: boolean;
}

interface LocationsSectionProps {
  pickupLocations: Location[];
  dropoffLocations: Location[];
  setPickupLocations: (locations: Location[]) => void;
  setDropoffLocations: (locations: Location[]) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LocationsSection = ({
  pickupLocations,
  dropoffLocations,
  setPickupLocations,
  setDropoffLocations,
  t,
}: LocationsSectionProps) => {
  const addPickupLocation = () => {
    setPickupLocations([...pickupLocations, { address: "", isActive: true }]);
  };

  const addDropoffLocation = () => {
    setDropoffLocations([...dropoffLocations, { address: "", isActive: true }]);
  };

  const updatePickupLocation = (
    index: number,
    field: keyof Location,
    value: any
  ) => {
    const updated = pickupLocations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    setPickupLocations(updated);
  };

  const updateDropoffLocation = (
    index: number,
    field: keyof Location,
    value: any
  ) => {
    const updated = dropoffLocations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    setDropoffLocations(updated);
  };

  const removePickupLocation = (index: number) => {
    if (pickupLocations.length > 1) {
      setPickupLocations(pickupLocations.filter((_, i) => i !== index));
    }
  };

  const removeDropoffLocation = (index: number) => {
    if (dropoffLocations.length > 1) {
      setDropoffLocations(dropoffLocations.filter((_, i) => i !== index));
    }
  };

  return (
    <Card dir={t("language") === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t("pickup_dropoff_locations")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>{t("pickup_locations")}</Label>
            <Button
              type="button"
              onClick={addPickupLocation}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("add_location")}
            </Button>
          </div>
          <div className="space-y-2">
            {pickupLocations.map((location, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={location.address}
                    onChange={(e) =>
                      updatePickupLocation(index, "address", e.target.value)
                    }
                    placeholder={t("enter_pickup_location")}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={location.isActive}
                      onCheckedChange={(checked) =>
                        updatePickupLocation(index, "isActive", checked)
                      }
                    />
                    <Label className="text-sm">{t("active")}</Label>
                  </div>
                </div>
                {pickupLocations.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePickupLocation(index)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>{t("dropoff_locations")}</Label>
            <Button
              type="button"
              onClick={addDropoffLocation}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("add_location")}
            </Button>
          </div>
          <div className="space-y-2">
            {dropoffLocations.map((location, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={location.address}
                    onChange={(e) =>
                      updateDropoffLocation(index, "address", e.target.value)
                    }
                    placeholder={t("enter_dropoff_location")}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={location.isActive}
                      onCheckedChange={(checked) =>
                        updateDropoffLocation(index, "isActive", checked)
                      }
                    />
                    <Label className="text-sm">{t("active")}</Label>
                  </div>
                </div>
                {dropoffLocations.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDropoffLocation(index)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{t("tip")}:</strong> {t("tip_locations")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsSection;
