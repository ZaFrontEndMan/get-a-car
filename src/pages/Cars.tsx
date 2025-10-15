import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLanguage } from "../contexts/LanguageContext";
import OptimizedCarCard from "../components/cars/OptimizedCarCard";
import CarsHeader from "../components/cars/CarsHeader";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters";
import CarsPagination from "../components/cars/CarsPagination";
import { Search } from "lucide-react";
import { useOptimizedCars, useBackgroundSync } from "@/hooks/useOptimizedCars";
import CarsSearchControls from "@/components/cars/CarsSearchControls";
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
} from "@/utils/urlParams";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";

const Cars = () => {
  const { t } = useLanguage();

  const [serverFilters, setServerFilters] = useState<CarsFiltersType>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseUrlParamsToFilters(urlParams);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Define currentPage state

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parsed = parseUrlParamsToFilters(params);
    setServerFilters(parsed);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [location.search]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50;
  const CARD_HEIGHT = viewMode === "grid" ? 320 : 200;

  const containerRef = useRef<HTMLDivElement>(null);
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
  } = useOptimizedCars(currentPage, itemsPerPage, serverFilters);

  useBackgroundSync();

  // Initialize currentPage from carsResponse.pageIndex
  useEffect(() => {
    if (carsResponse?.pageIndex) {
      setCurrentPage(carsResponse.pageIndex);
    }
  }, [carsResponse?.pageIndex]);

  const cars = useMemo(() => {
    if (!carsResponse?.carSearchResult) return [];
    return carsResponse.carSearchResult.map((car) => ({
      id: car?.carID?.toString(),
      title: car?.name || "No title",
      brand: car?.model || "Unknown Brand",
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
        name: car?.vendorName || "Unknown Vendor",
        logo_url: car?.companyLogo ? getImageUrl(car.companyLogo) : null,
      },
      vendors: {
        id: car?.vendorId?.toString(),
        name: car?.vendorName || "Unknown Vendor",
        logo_url: car?.companyLogo ? getImageUrl(car.companyLogo) : null,
      },
      isWishList: car?.isWishList,
    }));
  }, [carsResponse?.carSearchResult]);

  const filteredCars = useMemo(() => {
    if (!debouncedSearchTerm) return cars;
    return cars.filter((car) =>
      car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [cars, debouncedSearchTerm]);

  const totalPages = carsResponse?.totalPages || 0;
  const totalRecord = carsResponse?.totalRecord || 0; // Use totalRecord from response
  const paginatedCars = filteredCars;

  const updateFilters = useCallback(
    (newFilters: Partial<CarsFiltersType>) => {
      const updatedFilters = { ...serverFilters, ...newFilters };
      setServerFilters(updatedFilters);
      updateUrlWithFilters(updatedFilters);
      setCurrentPage(1);
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
    setCurrentPage(1);
  }, [serverFilters]);

  // Use refs to track currentPage and totalPages
  const currentPageRef = useRef(currentPage);
  const totalPagesRef = useRef(totalPages);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  // Stable debounced handlePageChange
  const handlePageChange = useMemo(
    () =>
      debounce((page: number) => {
        const current = currentPageRef.current;
        const total = totalPagesRef.current;
        if (page !== current && page >= 1 && page <= total) {
          console.log(`Changing page from ${current} to ${page}`);
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 300),
    []
  );

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      handlePageChange.cancel();
    };
  }, [handlePageChange]);

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
    console.error("Error in cars page:", error);
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
                    filteredCarsLength={totalRecord} // Use totalRecord instead of filteredCars.length
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isSearching={isSearching}
                  />
                </ErrorBoundary>

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
                                  viewMode={
                                    viewMode === "list" ? "list" : undefined
                                  }
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
                          {t("noCarsFound")}
                        </h3>
                        <p className="text-gray-500">
                          {t("tryAdjustingCriteria")}
                        </p>
                      </div>
                    )}
                  </ApiErrorBoundary>
                </div>

                <CarsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Cars;
