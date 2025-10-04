import React, { useMemo, useState } from "react";
import CarForm from "./CarForm";
import CarDetailsModal from "./CarDetailsModal";
import CarsImportModal from "./cars/CarsImportModal";
import { useToast } from "@/components/ui/use-toast";
import CarsHeader from "./cars/CarsHeader";
import CarsGridView from "./cars/CarsGridView";
import CarsListView from "./cars/CarsListView";
import CarsTableView from "./cars/CarsTableView";
import CarsEmptyState from "./cars/CarsEmptyState";
import {
  useGetAllCars,
  useDeleteCar,
  useDuplicateCar,
} from "@/hooks/vendor/useVendorCar";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const VendorCars = () => {
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [viewingCar, setViewingCar] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage(); // Initialize translation function
  const isRtl = language === "ar";

  // Fetch cars via normal API hook
  const { data, isLoading, error } = useGetAllCars();
  const deleteMutation = useDeleteCar();
  const duplicateMutation = useDuplicateCar();

  // Map API response to UI CarData shape
  const cars = useMemo(() => {
    const rawList =
      (data as any)?.data?.data?.vendorCars ||
      (data as any)?.data?.vendorCars ||
      (data as any)?.vendorCars ||
      [];

    const extractYear = (text?: string) => {
      if (!text) return new Date().getFullYear();
      const match = text.match(/(20\d{2}|19\d{2})/);
      return match ? parseInt(match[1], 10) : new Date().getFullYear();
    };

    const extractBrand = (name?: string, model?: string) => {
      if (!name && !model) return "";
      const nameParts = (name || model || "").split(" ");
      return nameParts.length > 1 ? nameParts[0] : "";
    };

    return (rawList as any[]).map((c) => ({
      id: (c?.id ?? "").toString(),
      name: c?.name ?? "",
      brand: extractBrand(c?.name, c?.model),
      model: c?.model ?? "",
      year: extractYear(c?.name),
      type: "sedan", // Default, as not provided in API
      seats: 5, // Default, as not provided in API
      fuel_type: "petrol", // Default, as not provided in API
      transmission: "automatic", // Default, as not provided in API
      daily_rate: c?.pricePerDay ?? 0,
      weekly_rate: undefined, // Not provided in API
      monthly_rate: undefined, // Not provided in API
      is_available: Boolean(c?.status),
      is_featured: false, // Default, as not provided in API
      images: Array.isArray(c?.imageUrls)
        ? c.imageUrls.map(
            (url: string) => `${import.meta.env.VITE_UPLOADS_BASE_URL}${url}`
          )
        : [],
      features: [], // Not provided in API
      pickup_locations: [], // Not provided in API
      condition: "excellent", // Default, as not provided in API
      color: undefined, // Not provided in API
      license_plate: undefined, // Not provided in API
      mileage_limit: undefined, // Not provided in API
      deposit_amount: undefined, // Not provided in API
      branch_name: c?.branchName ?? t("branch"), // Use translation for fallback
    }));
  }, [data, t]);

  const handleDuplicate = async (car: any) => {
    try {
      await duplicateMutation.mutateAsync(car.id);
      toast({
        title: t("duplicate_success"),
        description: t("car_duplicated_successfully"),
      });
    } catch (error) {
      console.error("Duplicate car error:", error);
      toast({
        title: t("duplicate_error"),
        description: t("failed_to_duplicate_car"),
        variant: "destructive",
      });
    }
  };
  const handleEdit = (car: any) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleView = (car: any) => {
    setViewingCar(car);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  const handleAddCar = () => {
    setShowForm(true);
  };

  const handleImportCars = () => {
    setShowImportModal(true);
  };

  const handleImportSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["vendor", "cars"] });
    toast({
      title: t("import_success"),
      description: t("cars_imported_successfully"),
    });
  };

  const handleDelete = async (carId: string) => {
    if (confirm(t("confirm_delete_car"))) {
      deleteMutation.mutate(carId);
    }
  };

  const renderCurrentView = () => {
    const viewProps = {
      cars,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onDuplicate: handleDuplicate,
      onView: handleView,
      isDeleting: deleteMutation.isPending,
    } as any;

    switch (viewMode) {
      case "grid":
        return <CarsGridView {...viewProps} />;
      case "list":
        return <CarsListView {...viewProps} />;
      case "table":
        return <CarsTableView {...viewProps} />;
      default:
        return <CarsGridView {...viewProps} />;
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-12"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{t("loading_cars")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      <CarsHeader
        t={t}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddCar={handleAddCar}
        onImportCars={handleImportCars}
      />

      {error || !cars || cars.length === 0 ? (
        <CarsEmptyState
          t={t}
          currentUser={{}}
          onAddCar={handleAddCar}
          error={error}
        />
      ) : (
        renderCurrentView()
      )}

      {showForm && (
        <CarForm
          t={t}
          car={editingCar}
          onClose={handleFormClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["vendor", "cars"] });
            handleFormClose();
          }}
        />
      )}

      {viewingCar && (
        <CarDetailsModal
          t={t}
          car={viewingCar}
          onClose={() => setViewingCar(null)}
        />
      )}

      {showImportModal && (
        <CarsImportModal
          t={t}
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};

export default VendorCars;
