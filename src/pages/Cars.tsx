import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/layout/navbar/Navbar";
import CarCard from "../components/CarCard";
import OptimizedCarCard from "../components/cars/OptimizedCarCard";
import CarsHeader from "../components/cars/CarsHeader";
import CarsFilters from "../components/cars/CarsFilters";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters";
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
import { CarsFilters as CarsFiltersType } from "@/api/website/websiteCars";
import { parseUrlParamsToFilters, updateUrlWithFilters } from "@/utils/urlParams";

const Cars = () => {
  const { language, t } = useLanguage();
  
  // Initialize filters from URL parameters
  const [serverFilters, setServerFilters] = useState<CarsFiltersType>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseUrlParamsToFilters(urlParams);
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50; // Use virtual scrolling when more than 50 items
  const CARD_HEIGHT = viewMode === "grid" ? 320 : 200; // Estimated heights for grid/list view
  
  // Performance optimization: use refs to avoid unnecessary re-renders
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);

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
  } = useOptimizedCars(currentPage, itemsPerPage, serverFilters);

  // Enable background sync for fresh data
  useBackgroundSync();

  // Memoize car data transformation with better performance
  const cars = useMemo(() => {
    if (!carsResponse?.carSearchResult) return [];

    return carsResponse.carSearchResult.map((car) => {
      const carId = car?.carID?.toString();
      const vendorId = car?.vendorId?.toString();
      const vendorName = car?.vendorName || "Unknown Vendor";
      const carImage = car?.image ? getImageUrl(car.image) : "https://images.unsplash.com/photo-1549924231-f129b911e442";
      const logoUrl = car?.companyLogo ? getImageUrl(car.companyLogo) : null;
      
      return {
        id: carId,
        title: car?.name || "No title",
        brand: car?.model || "Unknown Brand",
        image: carImage,
        price: car?.pricePerDay || 0,
        daily_rate: car?.pricePerDay || 0,
        weeklyPrice: car?.pricePerWeek,
        weekly_rate: car?.pricePerWeek,
        monthlyPrice: car?.pricePerMonth,
        monthly_rate: car?.pricePerMonth,
        seats: 4, // Default seats, could be extracted from car data if available
        fuel: car?.fuelType || "",
        fuel_type: car?.fuelType || "",
        transmission: car?.transmission || "",
        vendor: {
          id: vendorId,
          name: vendorName,
          logo_url: logoUrl,
        },
        vendors: {
          id: vendorId,
          name: vendorName,
          logo_url: logoUrl,
        },
      };
    });
  }, [carsResponse?.carSearchResult]);

  // Apply client-side search filter only (server handles other filters)
  const filteredCars = useMemo(() => {
    if (!debouncedSearchTerm) return cars;
    
    return cars.filter((car) => 
      car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [cars, debouncedSearchTerm]);

  // Use server-side pagination data
  const totalPages = carsResponse?.totalPages || 0;
  const paginatedCars = filteredCars; // Server already handles pagination

  // Update server filters and URL when filters change
  const updateFilters = useCallback((newFilters: Partial<CarsFiltersType>) => {
    const updatedFilters = { ...serverFilters, ...newFilters };
    setServerFilters(updatedFilters);
    updateUrlWithFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, [serverFilters]);

  // Memoize callback functions to prevent unnecessary re-renders
  const clearAllFilters = useCallback(() => {
    const clearedFilters: CarsFiltersType = {};
    setServerFilters(clearedFilters);
    updateUrlWithFilters(clearedFilters);
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Reset to first page when server filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [serverFilters]);

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

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          if (currentPage > 1) {
            event.preventDefault();
            handlePageChange(currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (currentPage < totalPages) {
            event.preventDefault();
            handlePageChange(currentPage + 1);
          }
          break;
        case "Home":
          if (currentPage > 1) {
            event.preventDefault();
            handlePageChange(1);
          }
          break;
        case "End":
          if (currentPage < totalPages) {
            event.preventDefault();
            handlePageChange(totalPages);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  // Memoize filter data with better performance
  const filterData = useMemo(() => {
    if (!carsResponse?.carsCommonProp?.data) return {};

    const commonProps = carsResponse.carsCommonProp.data;
    const filterMap = new Map();
    
    // Create a map for O(1) lookup instead of multiple find operations
    commonProps.forEach(item => {
      filterMap.set(item.header, item.filterData);
    });

    return {
      vendorNames: filterMap.get("vendorNames"),
      branches: filterMap.get("branches"),
      types: filterMap.get("types"),
      transmissions: filterMap.get("transmissions"),
      fuelTypes: filterMap.get("fuelTypes"),
      maxPrice: carsResponse.carsCommonProp.maxPrice,
    };
  }, [carsResponse?.carsCommonProp]);

  // Convert server filters to component state format for backward compatibility
  const priceRange: [number, number] = serverFilters.priceRange 
    ? [serverFilters.priceRange.min, serverFilters.priceRange.max]
    : [0, 2000];
  
  const selectedVendors = serverFilters.vendorNames || [];
  const selectedCategories = [
    ...(serverFilters.types || []),
    ...(serverFilters.fuelTypes || []),
    ...(serverFilters.branches || []),
    ...(serverFilters.transmissions || [])
  ];

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
                  <MemoizedCarsFilters
                    priceRange={priceRange}
                    setPriceRange={(range) => updateFilters({ 
                      priceRange: { min: range[0], max: range[1] } 
                    })}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={(categories) => {
                      // Extract different category types from the combined array
                      const types = categories.filter(cat => 
                        filterData.types?.some(t => t.name === cat)
                      );
                      const fuelTypes = categories.filter(cat => 
                        filterData.fuelTypes?.some(f => f.name === cat)
                      );
                      const branches = categories.filter(cat => 
                        filterData.branches?.some(b => b.name === cat)
                      );
                      const transmissions = categories.filter(cat => 
                        filterData.transmissions?.some(t => t.name === cat)
                      );
                      
                      updateFilters({ 
                        types: types.length > 0 ? types : undefined,
                        fuelTypes: fuelTypes.length > 0 ? fuelTypes : undefined,
                        branches: branches.length > 0 ? branches : undefined,
                        transmissions: transmissions.length > 0 ? transmissions : undefined
                      });
                    }}
                    selectedVendors={selectedVendors}
                    setSelectedVendors={(vendors) => updateFilters({ 
                      vendorNames: vendors.length > 0 ? vendors : undefined 
                    })}
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
                <div className="mt-6" ref={containerRef}>
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
                              <div className="flex-grow">
                                <OptimizedCarCard
                                  car={car}
                                  viewMode={viewMode === "list" ? "list" : undefined}
                                  animationDelay={index * 0.05}
                                />
                              </div>
                            </CarErrorBoundary>
                          )}
                        />
                      ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {paginatedCars.map((car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <OptimizedCarCard
                                car={car}
                                animationDelay={index * 0.05}
                              />
                            </CarErrorBoundary>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {paginatedCars.map((car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <OptimizedCarCard
                                car={car}
                                viewMode="list"
                                animationDelay={index * 0.05}
                              />
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
