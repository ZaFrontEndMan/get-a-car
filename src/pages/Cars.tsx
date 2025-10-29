import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import OptimizedCarCard from "../components/cars/OptimizedCarCard";
import CarsHeader from "../components/cars/CarsHeader";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters";
import CarsSearchControls from "@/components/cars/CarsSearchControls";
import SimilarCarsSlider from "@/components/SimilarCarsSlider";
import { useOptimizedCars, useBackgroundSync } from "@/hooks/useOptimizedCars";
import { getImageUrl } from "@/utils/imageUtils";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import CarsSkeleton, {
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import { VirtualScrolling } from "@/components/ui/VirtualScrolling";
import {
  ErrorBoundary,
  ApiErrorBoundary,
  CarErrorBoundary,
} from "@/components/ui/ErrorBoundary";
import { CarsFilters as CarsFiltersType } from "@/api/website/websiteCars";
import {
  parseUrlParamsToFilters,
  updateUrlWithFilters,
  areFiltersEqual,
} from "@/utils/urlParams";

const Cars = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const [serverFilters, setServerFilters] = useState<CarsFiltersType>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseUrlParamsToFilters(urlParams);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50;
  const CARD_HEIGHT = viewMode === "grid" ? 320 : 200;

  const containerRef = useRef<HTMLDivElement>(null);
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );
  const previousFiltersRef = useRef<CarsFiltersType>(serverFilters);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    const parsed = parseUrlParamsToFilters(params);

    if (!areFiltersEqual(parsed, serverFilters)) {
      setServerFilters(parsed);
      setCurrentPage(1);
    }
  }, [location.search]);

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useOptimizedCars(currentPage, itemsPerPage, serverFilters);

  useBackgroundSync();

  const cars = useMemo(() => {
    if (!carsResponse?.carSearchResult) return [];
    return carsResponse.carSearchResult.map((car) => ({
      id: car?.carID?.toString(),
      title: car?.name || "",
      brand: car?.model || "",
      image: car?.image
        ? getImageUrl(car.image)
        : "https://images.unsplash.com/photo-1549924231-f129b911e442",
      price: car?.pricePerDay || 0,
      daily_rate: car?.pricePerDay || 0,
      weeklyPrice: car?.pricePerWeek,
      weekly_rate: car?.pricePerWeek,
      monthlyPrice: car?.pricePerMonth,
      monthly_rate: car?.pricePerMonth,
      seats: 4,
      fuel: car?.fuelType || "",
      fuel_type: car?.fuelType || "",
      transmission: car?.transmission || "",
      vendor: {
        id: car?.vendorId?.toString(),
        name: car?.vendorName || "",
        logo_url: car?.companyLogo ? getImageUrl(car.companyLogo) : null,
      },
      vendors: {
        id: car?.vendorId?.toString(),
        name: car?.vendorName || "",
        logo_url: car?.companyLogo ? getImageUrl(car.companyLogo) : null,
      },
      isWishList: car?.isWishList,
      type: car?.type,
      pickUpLocations: car?.pickUpLocations || [],
      originalPricing: {
        daily: car?.pricePerDay || 0,
        weekly: car?.pricePerWeek || 0,
        monthly: car?.pricePerMonth || 0,
      },
    }));
  }, [carsResponse?.carSearchResult]);

  const filteredCars = useMemo(() => {
    if (!debouncedSearchTerm) return cars;
    return cars.filter((car) =>
      car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [cars, debouncedSearchTerm]);

  const totalPages = carsResponse?.totalPages || 0;
  const totalRecord = carsResponse?.totalRecord || 0;

  const updateFilters = useCallback(
    (newFilters: Partial<CarsFiltersType>) => {
      const updatedFilters = { ...serverFilters, ...newFilters };

      if (!areFiltersEqual(updatedFilters, serverFilters)) {
        setServerFilters(updatedFilters);
        updateUrlWithFilters(updatedFilters);
        setCurrentPage(1);
      }
    },
    [serverFilters]
  );

  const clearAllFilters = useCallback(() => {
    const clearedFilters: CarsFiltersType = {};
    setServerFilters(clearedFilters);
    updateUrlWithFilters(clearedFilters);
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const hasChanged = !areFiltersEqual(
      serverFilters,
      previousFiltersRef.current
    );

    if (hasChanged) {
      previousFiltersRef.current = serverFilters;
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }
  }, [serverFilters, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages]
  );

  const filterData = useMemo(() => {
    if (!carsResponse?.carsCommonProp?.data) return {};
    const commonProps = carsResponse.carsCommonProp.data;
    const filterMap = new Map();
    commonProps.forEach((item) => {
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

  const priceRange: [number, number] = serverFilters.priceRange
    ? [serverFilters.priceRange.min, serverFilters.priceRange.max]
    : [0, 2000];

  const selectedVendors = serverFilters.vendorNames || [];
  const selectedCategories = [
    ...(serverFilters.types || []),
    ...(serverFilters.fuelTypes || []),
    ...(serverFilters.branches || []),
    ...(serverFilters.transmissions || []),
  ];

  const showSimilarCarsSlider =
    serverFilters.pickupLocation && serverFilters.dropOffLocation;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <ApiErrorBoundary onRetry={() => refetch()}>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("errorLoadingCars")}
                </h3>
                <p className="text-gray-500 mb-6">{t("pleaseTryAgainLater")}</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("retry")}
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
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <div className="w-52 flex-shrink-0 hidden lg:block">
                <ErrorBoundary
                  fallback={
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-700">
                        {t("unableToLoadFilters")}
                      </p>
                    </div>
                  }
                >
                  <MemoizedCarsFilters
                    priceRange={priceRange}
                    setPriceRange={(range) =>
                      updateFilters({
                        priceRange: { min: range[0], max: range[1] },
                      })
                    }
                    selectedCategories={selectedCategories}
                    setSelectedCategories={(categories) => {
                      const types = categories.filter((cat) =>
                        filterData.types?.some((t) => t.name === cat)
                      );
                      const fuelTypes = categories.filter((cat) =>
                        filterData.fuelTypes?.some((f) => f.name === cat)
                      );
                      const branches = categories.filter((cat) =>
                        filterData.branches?.some((b) => b.name === cat)
                      );
                      const transmissions = categories.filter((cat) =>
                        filterData.transmissions?.some((t) => t.name === cat)
                      );
                      updateFilters({
                        types: types.length > 0 ? types : undefined,
                        fuelTypes: fuelTypes.length > 0 ? fuelTypes : undefined,
                        branches: branches.length > 0 ? branches : undefined,
                        transmissions:
                          transmissions.length > 0 ? transmissions : undefined,
                      });
                    }}
                    selectedVendors={selectedVendors}
                    setSelectedVendors={(vendors) =>
                      updateFilters({
                        vendorNames: vendors.length > 0 ? vendors : undefined,
                      })
                    }
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onClearFilters={clearAllFilters}
                    filterData={filterData}
                  />
                </ErrorBoundary>
              </div>

              <div className="flex-1 min-w-0">
                <CarsHeader />

                <ErrorBoundary
                  fallback={
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 mb-6">
                      <p className="text-sm text-orange-700">
                        {t("searchControlsUnavailable")}
                      </p>
                    </div>
                  }
                >
                  <CarsSearchControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    filteredCarsLength={totalRecord}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isSearching={isSearching}
                    isLoading={isLoading || isFetching}
                  />
                </ErrorBoundary>

                <div className="mt-6" ref={containerRef}>
                  <ApiErrorBoundary>
                    {isSearching && searchTerm ? (
                      <CarsSkeleton
                        viewMode={viewMode}
                        itemsPerPage={Math.min(itemsPerPage, 6)}
                      />
                    ) : filteredCars.length > 0 ? (
                      filteredCars.length > VIRTUAL_SCROLL_THRESHOLD ? (
                        <VirtualScrolling
                          items={filteredCars}
                          itemHeight={CARD_HEIGHT}
                          containerHeight={800}
                          className={
                            viewMode === "grid"
                              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                              : "space-y-4"
                          }
                          renderItem={(car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <OptimizedCarCard
                                car={car}
                                viewMode={
                                  viewMode === "list" ? "list" : undefined
                                }
                                animationDelay={index * 0.05}
                              />
                            </CarErrorBoundary>
                          )}
                        />
                      ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredCars.map((car, index) => (
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
                          {filteredCars.map((car, index) => (
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
                          {t("noCarsFound")}
                        </h3>
                        <p className="text-gray-500">
                          {t("tryAdjustingCriteria")}
                        </p>
                      </div>
                    )}
                  </ApiErrorBoundary>
                </div>

                {showSimilarCarsSlider && filteredCars.length > 0 && (
                  <div className="mt-8">
                    <SimilarCarsSlider car={filteredCars[0]} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Cars;
