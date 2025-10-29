import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarFormContent from "./CarFormContent";
import { useCarForm } from "./useCarForm";
import { usePaidFeatures } from "./usePaidFeatures";
import { useLocations } from "./useLocations";
import { useProtections } from "./useProtections";
import { useGetVendorBranches } from "@/hooks/vendor/useVendorBranch";
import {
  useCreateCar,
  useUpdateCar,
  useGetCarById,
} from "@/hooks/vendor/useVendorCar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CarFormProps {
  carId?: string | number;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const CarForm = ({ carId, onClose, onSuccess, t }: CarFormProps) => {
  const isEditMode = !!carId;

  const {
    data: carData,
    isLoading: isLoadingCar,
    error: carError,
  } = useGetCarById(carId ? String(carId) : "", isEditMode);

  const car = carData?.data?.data || null;

  const { formData, handleChange, setFormData } = useCarForm(car, onSuccess);
  const { paidFeatures, setPaidFeatures } = usePaidFeatures(car);
  const {
    pickupLocations,
    setPickupLocations,
    dropoffLocations,
    setDropoffLocations,
  } = useLocations(car);
  const { protections, setProtections } = useProtections(car);

  useEffect(() => {
    if (car && isEditMode) {
      setFormData({
        id: car.id || "",
        name: car.name || "",
        brand: car.tradeMark || "",
        tradeMarkId: car.tradeMarkId || "",
        model: car.model || "",
        modelId: car.modelId || "",
        year: car.year || new Date().getFullYear(),
        type: car.type || "",
        carTypeId: car.carTypeId || "",
        fuel_type: car.fuelType || "",
        fuelTypeId: car.fuelTypeId || "",
        transmission: car.transmission || "",
        transmissionTypeId: car.transmissionTypeId || "",
        seats: parseInt(car.doors) || 4,
        color: car.color || "",
        license_plate: car.licenseNumber || "",
        daily_rate: car.pricePerDay || 0,
        weekly_rate: car.pricePerWeek || 0,
        monthly_rate: car.pricePerMonth || 0,
        deposit_amount: 0,
        images: car.images?.map((img: any) => img.imageUrl) || [],
        features: extractFeatures(car),
        is_available: car.availabilityVendor ?? true,
        branch_id: car.branchId || "",
        mileage_limit: parseInt(car.liter) || 0,
        cancellation_policies: "",
        description: car.description || "",
        liter: car.liter || "",
        withDriver: car.withDriver || false,
        protectionPrice: car.protectionPrice || 0,
      });
    }
  }, [car, isEditMode, setFormData]);

  const { data: branchesData, isLoading: branchesLoading } =
    useGetVendorBranches();

  const branches = React.useMemo(() => {
    const d = branchesData as any;
    let list: any[] = [];
    if (Array.isArray(d?.data?.vendorBranches)) list = d.data.vendorBranches;
    else if (Array.isArray(d?.vendorBranches)) list = d.vendorBranches;
    else if (Array.isArray(d?.data?.data?.branches))
      list = d.data.data.branches;
    else if (Array.isArray(d?.data?.branches)) list = d.data.branches;
    else if (Array.isArray(d?.branches)) list = d.branches;
    else if (Array.isArray(d?.data)) list = d.data;
    else if (Array.isArray(d)) list = d;
    return list.map((b) => ({
      id: (b?.id ?? "").toString(),
      name: b?.branchName ?? b?.name ?? t("branch"),
    }));
  }, [branchesData, t]);

  const createMutation = useCreateCar();
  const updateMutation = useUpdateCar();
  const { toast } = useToast();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const buildApiFormData = () => {
    const fd = new FormData();

    // Helper that doesn't convert File objects to strings
    const append = (key: string, value: any) => {
      if (value === undefined || value === null) return;

      // Don't convert if it's already a File object
      if (value instanceof File) {
        fd.append(key, value);
      } else {
        fd.append(key, typeof value === "string" ? value : String(value));
      }
    };

    // Pricing
    append("pricePerDay", formData.daily_rate ?? 0);
    append("pricePerWeek", formData.weekly_rate ?? 0);
    append("pricePerMonth", formData.monthly_rate ?? 0);

    // IDs and meta
    append("tradeMarkId", formData.tradeMarkId || 0);
    append("modelId", formData.modelId || 0);
    append("carTypeId", formData.carTypeId || 0);
    append("modelYear", formData.year ?? new Date().getFullYear());

    // License
    append("licenseNumber", formData.license_plate || "");

    // Fuel and transmission
    append("fuelTypeId", formData.fuelTypeId || 0);
    append("transmissionTypeId", formData.transmissionTypeId || 0);

    // Availability / driver option
    append("availability", !!formData.is_available);
    append("withDriver", !!formData.withDriver);

    // Body/description
    append("doors", String(formData.seats ?? ""));
    append("description", formData.description || "");

    // Mileage / fuel liter
    append("mileage", formData.mileage_limit ?? 0);
    append("liter", formData.liter || "");

    // Protections
    if (protections.length > 0) {
      append(
        "protections",
        JSON.stringify(
          protections.map((p) => ({
            id: p.id,
            NameAr: p.nameAr,
            NameEn: p.nameEn,
            DescriptionAr: p.descriptionAr,
            DescriptionEn: p.descriptionEn,
          }))
        )
      );
    }

    // Car Services (Paid Features)
    if (paidFeatures.length > 0) {
      append(
        "carServices",
        JSON.stringify(
          paidFeatures.map((pf) => ({
            id: pf.id,
            ServiceTypeId: pf.serviceTypeId || 1,
            NameAr: pf.titleAr || pf.title,
            NameEn: pf.titleEn || pf.title,
            Price: pf.price,
            DescriptionAr: pf.descriptionAr || pf.description || "",
            DescriptionEn: pf.descriptionEn || pf.description || "",
          }))
        )
      );
    }

    // Locations
    if (pickupLocations.length > 0) {
      append(
        "pickUpLocation",
        JSON.stringify(
          pickupLocations.map((loc) => ({
            id: loc.id,
            Address: loc.address,
            IsActive: loc.isActive,
          }))
        )
      );
    }

    if (dropoffLocations.length > 0) {
      append(
        "dropOffLocation",
        JSON.stringify(
          dropoffLocations.map((loc) => ({
            id: loc.id,
            Address: loc.address,
            IsActive: loc.isActive,
          }))
        )
      );
    }

    // Feature flags
    const hasFeature = (featureName: string) =>
      (formData.features || []).includes(featureName);

    append("absBrakes", hasFeature("absBrakes"));
    append("airBag", hasFeature("airbag"));
    append("airBagCount", hasFeature("airbag") ? 2 : 0);
    append("audioInput", hasFeature("audioInput"));
    append("bluetooth", hasFeature("bluetooth"));
    append("cdplayer", hasFeature("cdPlayer"));
    append("cruisecontrol", hasFeature("cruiseControl"));
    append("ebdbrakes", hasFeature("ebdBrakes"));
    append("electricmirrors", hasFeature("electricMirrors"));
    append("foglights", hasFeature("fogLights"));
    append("gps", hasFeature("gps"));
    append("power", hasFeature("power"));
    append("remotecontrol", hasFeature("remoteControl"));
    append("roofbox", hasFeature("roofBox"));
    append("sensors", hasFeature("sensors"));
    append("usbinput", hasFeature("usbInput"));

    const protectionPrice = formData.protectionPrice || 0;
    append("isProtection", protectionPrice > 0);
    append("protectionPrice", protectionPrice);

    // Images - Handle both File objects and URL strings separately
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img: string | File) => {
        if (typeof img === "string") {
          // It's a URL string
          fd.append("images", img);
        } else if (img instanceof File) {
          // It's a File object - append directly without string conversion
          fd.append("images", img, img.name);
        }
      });
    }

    return fd;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = buildApiFormData();

    if (isEditMode && carId) {
      updateMutation.mutate(
        { carId: String(carId), carData: fd },
        {
          onSuccess: () => {
            toast({
              title: t("success"),
              description: t("car_updated_successfully"),
            });
            onSuccess();
            onClose();
          },
          onError: (error: any) => {
            toast({
              title: t("update_failed"),
              description: error?.message || t("failed_to_update_car"),
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMutation.mutate(fd, {
        onSuccess: () => {
          toast({
            title: t("success"),
            description: t("car_created_successfully"),
          });
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          toast({
            title: t("creation_failed"),
            description: error?.message || t("failed_to_create_car"),
            variant: "destructive",
          });
        },
      });
    }
  };

  if (isEditMode && isLoadingCar) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">{t("loading_car_data")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditMode && carError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("error")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{t("failed_to_load_car_data")}</p>
            <Button onClick={onClose} variant="outline" className="w-full">
              {t("close")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isEditMode ? t("edit_car") : t("add_car")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <CarFormContent
              formData={formData}
              handleChange={handleChange}
              paidFeatures={paidFeatures}
              setPaidFeatures={setPaidFeatures}
              pickupLocations={pickupLocations}
              setPickupLocations={setPickupLocations}
              dropoffLocations={dropoffLocations}
              setDropoffLocations={setDropoffLocations}
              protections={protections}
              setProtections={setProtections}
              branches={branches}
              branchesLoading={branchesLoading}
              t={t}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting
                  ? t("saving")
                  : isEditMode
                  ? t("update")
                  : t("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function - NOW RETURNS CAMELCASE
const extractFeatures = (car: any): string[] => {
  const features: string[] = [];

  if (car.electricMirrors) features.push("electricMirrors");
  if (car.cruiseControl) features.push("cruiseControl");
  if (car.fogLights) features.push("fogLights");
  if (car.power) features.push("power");
  if (car.roofBox) features.push("roofBox");
  if (car.gps) features.push("gps");
  if (car.remoteControl) features.push("remoteControl");
  if (car.audioInput) features.push("audioInput");
  if (car.cdPlayer) features.push("cdPlayer");
  if (car.bluetooth) features.push("bluetooth");
  if (car.usbInput) features.push("usbInput");
  if (car.sensors) features.push("sensors");
  if (car.ebdBrakes) features.push("ebdBrakes");
  if (car.airbag) features.push("airbag");
  if (car.absBrakes) features.push("absBrakes");

  return features;
};

export default CarForm;
