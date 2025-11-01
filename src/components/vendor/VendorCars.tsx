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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const VendorCars = () => {
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [viewingCar, setViewingCar] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  // Fetch cars with pagination
  const { data, isLoading, error } = useGetAllCars(currentPage, pageSize);
  const deleteMutation = useDeleteCar();
  const duplicateMutation = useDuplicateCar();

  // Extract pagination metadata
  const paginationMeta = useMemo(
    () => ({
      pageNumber: (data as any)?.data?.data?.pageNumber || 1,
      pageSize: (data as any)?.data?.data?.pageSize || 10,
      totalPages: (data as any)?.data?.data?.totalPages || 1,
      totalRecords: (data as any)?.data?.data?.totalRecords || 0,
    }),
    [data]
  );

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
      type: "sedan",
      seats: 5,
      fuel_type: "petrol",
      transmission: "automatic",
      daily_rate: c?.pricePerDay ?? 0,
      weekly_rate: undefined,
      monthly_rate: undefined,
      is_available: Boolean(c?.availabilityVendor && c?.availabilityAdmin),
      is_approved: Boolean(c?.availabilityAdmin),
      images: Array.isArray(c?.imageUrls)
        ? c.imageUrls.map(
            (url: string) => `${import.meta.env.VITE_UPLOADS_BASE_URL}${url}`
          )
        : [],
      features: [],
      pickup_locations: [],
      condition: "excellent",
      color: undefined,
      license_plate: undefined,
      mileage_limit: undefined,
      deposit_amount: undefined,
      branch_name: c?.branchName ?? t("branch"),
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
    queryClient.invalidateQueries({
      queryKey: ["vendor", "cars"],
    });
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

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= paginationMeta.totalPages &&
      newPage !== currentPage
    ) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const { totalPages } = paginationMeta;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Show first page
      items.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        items.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push("...");
      }

      // Add last page
      items.push(totalPages);
    }

    return items;
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
        <span className="ms-2">{t("loading_cars")}</span>
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
        <>
          {renderCurrentView()}

          {/* Pagination */}
          {paginationMeta.totalPages > 1 && (
            <div className="space-y-4">
              {/* Page Size Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {t("itemsPerPage")}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(parseInt(e.target.value))
                    }
                    className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  {t("showing")} {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(
                    currentPage * pageSize,
                    paginationMeta.totalRecords
                  )}{" "}
                  {t("of")} {paginationMeta.totalRecords}
                </div>
              </div>

              {/* Pagination Controls */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePreviousPage}
                      className={`cursor-pointer ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </PaginationItem>

                  {generatePaginationItems().map((item, index) => (
                    <PaginationItem key={index}>
                      {item === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(item as number)}
                          isActive={currentPage === item}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNextPage}
                      className={`cursor-pointer ${
                        currentPage === paginationMeta.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {showForm && (
        <CarForm
          t={t}
          carId={editingCar?.id}
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
