import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/layout/navbar/Navbar";
import CarCard from "../components/CarCard";
import CarsHeader from "../components/cars/CarsHeader";
import CarsFilters from "../components/cars/CarsFilters";
import CarsPagination from "../components/cars/CarsPagination";
import { Search } from "lucide-react";
import { useOptimizedCars, useBackgroundSync } from "@/hooks/useOptimizedCars";
import CarsSearchControls from "@/components/cars/CarsSearchControls";
import { getImageUrl } from "@/utils/imageUtils";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import CarsSkeleton, {
  CarsFiltersSkeleton,
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import { VirtualScrolling } from "@/components/ui/VirtualScrolling";
import {
  ErrorBoundary,
  ApiErrorBoundary,
  CarErrorBoundary,
} from "@/components/ui/ErrorBoundary";

const Cars = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50; // Use virtual scrolling when more than 50 items
  const CARD_HEIGHT = viewMode === "grid" ? 320 : 200; // Estimated heights for grid/list view

  // Use debounced search to improve performance
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    prefetchNextPages,
    prefetchPreviousPage,
  } = useOptimizedCars(currentPage, itemsPerPage);

  // Enable background sync for fresh data
  useBackgroundSync();

  // Memoize car data transformation to prevent unnecessary re-renders
  const cars = useMemo(() => {
    if (!carsResponse?.carSearchResult) return [];

    return carsResponse.carSearchResult.map((car) => ({
      id: car?.carID.toString(),
      title: car?.name || "No title",
      title_ar: "",
      description: car?.description || "No description",
      description_ar: "",
      image: car?.image
        ? getImageUrl(car.image)
        : "https://images.unsplash.com/photo-1549924231-f129b911e442",
      price: car?.pricePerDay || 0,
      vendorName: car?.vendorName || "Unknown Vendor",
      vendor: {
        id: car?.vendorId?.toString(),
        name: car?.vendorName || "Unknown Vendor",
        logo_url: car?.companyLogo ? getImageUrl(car.companyLogo) : null,
      },
      extra: {
        model: car?.model,
        fuelType: car?.fuelType,
        branch: car?.branch,
        transmission: car?.transmission,
        type: car?.type,
        pricePerWeek: car?.pricePerWeek,
        pricePerMonth: car?.pricePerMonth,
      },
    }));
  }, [carsResponse?.carSearchResult]);

  // Memoize filtered cars to prevent unnecessary filtering on every render
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search term filter (using debounced search)
      if (
        debouncedSearchTerm &&
        !car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      const isDefaultPriceRange = priceRange[0] === 0 && priceRange[1] === 2000;
      if (!isDefaultPriceRange) {
        const carPrice = car?.price;
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];

        if (isNaN(carPrice) || carPrice < minPrice || carPrice > maxPrice) {
          return false;
        }
      }

      // Vendor filter
      if (
        selectedVendors.length > 0 &&
        !selectedVendors.includes(car?.vendor.name)
      ) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const originalCar = carsResponse?.carSearchResult.find(
          (o) => o.carID.toString() === car?.id
        );

        if (!originalCar) return false;

        const matchesCategory = selectedCategories.some((category) => {
          const categoryLower = category.toLowerCase();
          return (
            (originalCar.fuelType &&
              originalCar.fuelType.toLowerCase() === categoryLower) ||
            (originalCar.transmission &&
              originalCar.transmission.toLowerCase() === categoryLower) ||
            (originalCar.type &&
              originalCar.type.toLowerCase() === categoryLower) ||
            (originalCar.branch &&
              originalCar.branch.toLowerCase() === categoryLower)
          );
        });

        if (!matchesCategory) return false;
      }

      return true;
    });
  }, [
    cars,
    debouncedSearchTerm,
    priceRange,
    selectedVendors,
    selectedCategories,
    carsResponse?.carSearchResult,
  ]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = filteredCars.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCars = filteredCars.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return { totalItems, totalPages, paginatedCars };
  }, [filteredCars, currentPage, itemsPerPage]);

  const { totalPages, paginatedCars } = paginationData;

  // Memoize callback functions to prevent unnecessary re-renders
  const clearAllFilters = useCallback(() => {
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCategories, selectedVendors, debouncedSearchTerm]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Prefetch adjacent pages for smoother navigation
      setTimeout(() => {
        if (page > currentPage) {
          prefetchNextPages();
        } else {
          prefetchPreviousPage();
        }
      }, 100);
    },
    [currentPage, prefetchNextPages, prefetchPreviousPage]
  );

  // Memoize filter data to prevent unnecessary re-renders
  const filterData = useMemo(() => {
    if (!carsResponse?.carsCommonProp?.data) return {};

    const commonProps = carsResponse.carsCommonProp.data;
    return {
      vendorNames: commonProps.find((item) => item.header === "vendorNames")
        ?.filterData,
      branches: commonProps.find((item) => item.header === "branches")
        ?.filterData,
      types: commonProps.find((item) => item.header === "types")?.filterData,
      transmissions: commonProps.find((item) => item.header === "transmissions")
        ?.filterData,
      fuelTypes: commonProps.find((item) => item.header === "fuelTypes")
        ?.filterData,
      maxPrice: carsResponse.carsCommonProp.maxPrice,
    };
  }, [carsResponse?.carsCommonProp]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Filters Sidebar Skeleton */}
              <div className="w-52 flex-shrink-0 hidden lg:block">
                <CarsFiltersSkeleton />
              </div>
              {/* Main Content Skeleton */}
              <div className="flex-1 min-w-0">
                <div className="mb-8">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <CarsSearchControlsSkeleton />
                <div className="mt-6">
                  <CarsSkeleton
                    viewMode={viewMode}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error in cars page:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <ApiErrorBoundary onRetry={() => window.location.reload()}>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('errorLoadingCars')}
                </h3>
                <p className="text-gray-500 mb-6">{t('pleaseTryAgainLater')}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('reloadPage')}
                </button>
              </div>
            </div>
          </ApiErrorBoundary>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />

        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <div className="w-52 flex-shrink-0 hidden lg:block">
                <ErrorBoundary
                  fallback={
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-700">
                        {t('unableToLoadFilters')}
                      </p>
                    </div>
                  }
                >
                  <CarsFilters
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedVendors={selectedVendors}
                    setSelectedVendors={setSelectedVendors}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onClearFilters={clearAllFilters}
                    filterData={filterData}
                  />
                </ErrorBoundary>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <CarsHeader />

                <ErrorBoundary
                  fallback={
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 mb-6">
                      <p className="text-sm text-orange-700">
                        {t('searchControlsUnavailable')}
                      </p>
                    </div>
                  }
                >
                  <CarsSearchControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    filteredCarsLength={filteredCars.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isSearching={isSearching}
                  />
                </ErrorBoundary>

                {/* Cars Grid/List with Virtual Scrolling */}
                <div className="mt-6">
                  <ApiErrorBoundary>
                    {isSearching && searchTerm ? (
                      <CarsSkeleton
                        viewMode={viewMode}
                        itemsPerPage={Math.min(itemsPerPage, 6)}
                      />
                    ) : paginatedCars.length > 0 ? (
                      filteredCars.length > VIRTUAL_SCROLL_THRESHOLD ? (
                        <VirtualScrolling
                          items={paginatedCars}
                          itemHeight={CARD_HEIGHT}
                          containerHeight={800}
                          className={`${
                            viewMode === "grid"
                              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                              : "space-y-4"
                          }`}
                          renderItem={(car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <div
                                className="animate-fade-in flex-grow"
                                style={{
                                  animationDelay: `${Math.min(
                                    index * 0.05,
                                    0.5
                                  )}s`,
                                }}
                              >
                                <CarCard
                                  car={car}
                                  viewMode={
                                    viewMode === "list" ? "list" : undefined
                                  }
                                />
                              </div>
                            </CarErrorBoundary>
                          )}
                        />
                      ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {paginatedCars.map((car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <div
                                className="animate-fade-in"
                                style={{
                                  animationDelay: `${Math.min(
                                    index * 0.05,
                                    0.5
                                  )}s`,
                                }}
                              >
                                <CarCard car={car} />
                              </div>
                            </CarErrorBoundary>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {paginatedCars.map((car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <div
                                className="animate-fade-in"
                                style={{
                                  animationDelay: `${Math.min(
                                    index * 0.05,
                                    0.5
                                  )}s`,
                                }}
                              >
                                <CarCard car={car} viewMode="list" />
                              </div>
                            </CarErrorBoundary>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {t('noCarsFound')}
                        </h3>
                        <p className="text-gray-500">
                          {t('tryAdjustingCriteria')}
                        </p>
                      </div>
                    )}
                  </ApiErrorBoundary>
                </div>

                <ErrorBoundary
                  fallback={
                    <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-700 text-center">
                        {t('paginationUnavailable')}
                      </p>
                    </div>
                  }
                >
                  <CarsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Cars;
