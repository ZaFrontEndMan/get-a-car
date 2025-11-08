import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarFormContent from "./CarFormContent";
import { useCarForm } from "./useCarForm";
import { usePaidFeatures } from "./usePaidFeatures";
import { useLocations } from "./useLocations";
import { useProtections } from "./useProtections";
import {
  useCreateCar,
  useUpdateCar,
  useGetCarById,
} from "@/hooks/vendor/useVendorCar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useGetVendorBranchesForCars } from "@/hooks/vendor/useVendorBranch";

interface CarFormProps {
  carId?: string | number;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const CarForm = ({ carId, onClose, onSuccess, t }: CarFormProps) => {
  const isEditMode = !!carId;

  // Fetch car data for editing
  const {
    data: carData,
    isLoading: isLoadingCar,
    error: carError,
  } = useGetCarById(carId ? String(carId) : "", isEditMode);

  // Car data from API - useCarForm handles the mapping
  const car = carData?.data?.data || null;

  // Form hooks - direct API structure, no manual mapping needed
  const { formData, handleChange } = useCarForm(car);
  const { paidFeatures, setPaidFeatures } = usePaidFeatures(car);
  const {
    pickupLocations,
    setPickupLocations,
    dropoffLocations,
    setDropoffLocations,
  } = useLocations(car);
  const { protections, setProtections } = useProtections(car);

  // Branches for branch selection
  const { data: branchesData, isLoading: branchesLoading } =
    useGetVendorBranchesForCars();

  const branches = React.useMemo(() => {
    if (!branchesData?.data?.vendorBranches) return [];

    return branchesData.data.vendorBranches.map((b: any) => ({
      id: b.id,
      name: b.branchName,
    }));
  }, [branchesData]);

  // API mutations
  const createMutation = useCreateCar();
  const updateMutation = useUpdateCar();
  const { toast } = useToast();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Clean FormData builder - direct field access, no mapping
  const buildApiFormData = () => {
    const fd = new FormData();

    const append = (key: string, value: any) => {
      if (value === undefined || value === null || value === "") return;

      if (value instanceof File) {
        fd.append(key, value, value.name);
      } else {
        fd.append(key, typeof value === "string" ? value : String(value));
      }
    };

    // Basic car info
    // append("name", formData.name);
    append("description", formData.description);
    append("vendorBranchId", formData.branchId);
    append("modelYear", formData.year);

    // Pricing - direct API fields
    append("pricePerDay", formData.pricePerDay);
    append("protectionPrice", formData.protectionPrice);
    append("isProtection", formData.protectionPrice > 0);

    append("licenseNumber", formData.licenseNumber);
    append("pricePerWeek", formData.pricePerWeek);
    append("pricePerMonth", formData.pricePerMonth);
    // append("protectionPrice", formData.protectionPrice ?? 0);

    // Car detail IDs - direct API fields
    append("tradeMarkId", formData.tradeMarkId);
    append("modelId", formData.modelId);
    append("carTypeId", formData.typeId); // Map carTypeId to typeId
    append("fuelTypeId", formData.fuelTypeId);
    append("transmissionTypeId", formData.transmissionId);

    // Physical specifications
    append("doors", formData.doors);

    // Availability & services
    append("availability", formData.availabilityVendor);
    append("withDriver", formData.withDriver);

    // Feature flags - direct boolean access
    append("electricMirrors", formData.electricMirrors ?? false);
    append("cruiseControl", formData.cruiseControl ?? false);
    append("fogLights", formData.fogLights ?? false);
    append("power", formData.power ?? false);
    append("roofBox", formData.roofBox ?? false);
    append("gps", formData.gps ?? false);
    append("remoteControl", formData.remoteControl ?? false);
    append("audioInput", formData.audioInput ?? false);
    append("cdPlayer", formData.cdPlayer ?? false);
    append("bluetooth", formData.bluetooth ?? false);
    append("usbInput", formData.usbInput ?? false);
    append("sensors", formData.sensors ?? false);
    append("ebdBrakes", formData.ebdBrakes ?? false);
    append("airbag", formData.airbag ?? false);
    append("absBrakes", formData.absBrakes ?? false);

    // Protections - safe ID handling
    if (protections.length > 0) {
      append(
        "protections",
        JSON.stringify(
          protections.map((p, index) => ({
            id: p.id ?? (isEditMode ? carId : undefined),
            nameAr: p.nameAr,
            nameEn: p.nameEn,
            descriptionAr: p.descriptionAr,
            descriptionEn: p.descriptionEn,
          }))
        )
      );
    }

    // Car Services - safe ID handling
    if (paidFeatures.length > 0) {
      append(
        "carServices",
        JSON.stringify(
          paidFeatures.map((pf, index) => ({
            // id: pf.id ?? (isEditMode ? undefined : pf.id),
            id: pf.id || 1,
            nameAr: pf.titleAr || pf.title || "",
            nameEn: pf.titleEn || pf.title || "",
            Price: pf.price || 0,
            descriptionAr: pf.descriptionAr || pf.description || "",
            descriptionEn: pf.descriptionEn || pf.description || "",
          }))
        )
      );
    }

    // Pick up locations - safe ID handling
    if (pickupLocations.length > 0) {
      append(
        "pickUpLocation",
        JSON.stringify(
          pickupLocations.map((loc, index) => ({
            id: loc.id ?? (isEditMode ? carId : undefined),
            Address: loc.address,
            IsActive: loc.isActive ?? true,
          }))
        )
      );
    }

    // Drop off locations - safe ID handling
    if (dropoffLocations.length > 0) {
      append(
        "dropOffLocation",
        JSON.stringify(
          dropoffLocations.map((loc, index) => ({
            id: loc.id ?? (isEditMode ? carId : undefined),
            Address: loc.address,
            IsActive: loc.isActive ?? true,
          }))
        )
      );
    }

    // Images - handle both URLs and Files
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img: string | File) => {
        if (typeof img === "string") {
          fd.append("images", img);
        } else if (img instanceof File) {
          fd.append("images", img);
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

  // Loading state
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

  // Error state
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

export default CarForm;
