import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import OptimizedCarCard from "../components/cars/OptimizedCarCard";
import CarsHeader from "../components/cars/CarsHeader";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters";
import CarsSearchControls from "@/components/cars/CarsSearchControls";
import SimilarCarsSlider from "@/components/SimilarCarsSlider";
import {
  useAllCars,
  useGetVendorCarWithFilter,
  useSimilarCars,
} from "@/hooks/website/useWebsiteCars"; // Import your hooks
import { getImageUrl } from "@/utils/imageUtils";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import CarsSkeleton, {
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import {
  ErrorBoundary,
  ApiErrorBoundary,
  CarErrorBoundary,
} from "@/components/ui/ErrorBoundary";
import {
  CarsFilters as CarsFiltersType,
  VendorCarsFilters,
} from "@/api/website/websiteCars";
import {
  parseUrlParamsToFilters,
  updateUrlWithFilters,
  areFiltersEqual,
} from "@/utils/urlParams";

const Cars = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Detect vendor from route parameter /cars/vendor/:id
  const vendorId = params.id || "";
  const isVendorMode =
    !!vendorId && location.pathname.includes("/cars/vendor/");

  // Unified state management
  const [serverFilters, setServerFilters] = useState<
    CarsFiltersType | VendorCarsFilters
  >(() => {
    const urlParams = new URLSearchParams(location.search);
    const parsed = parseUrlParamsToFilters(urlParams);

    // Handle vendor filters if in vendor mode
    if (isVendorMode && vendorId) {
      const vendorFilters = { ...parsed } as VendorCarsFilters;
      return vendorFilters;
    }

    return parsed;
  });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem("carsViewMode") as "grid" | "list") || "grid"
  );

  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50;

  const containerRef = useRef<HTMLDivElement>(null);
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );
  const previousFiltersRef = useRef<CarsFiltersType | VendorCarsFilters>(
    serverFilters
  );
  const isInitialMount = useRef(true);

  // Prepare filters for the hooks
  const carFilters = useMemo(() => {
    return {
      vendors: (serverFilters as CarsFiltersType).vendorNames,
      types: (serverFilters as CarsFiltersType).types,
      transmissions: (serverFilters as CarsFiltersType).transmissions,
      fuelTypes: (serverFilters as CarsFiltersType).fuelTypes,
      branches: (serverFilters as CarsFiltersType).branches,
      priceRange: (serverFilters as CarsFiltersType).priceRange,
    };
  }, [serverFilters]);

  // Dynamic hook selection based on route using your hooks
  const carsQuery =
    isVendorMode && vendorId
      ? useGetVendorCarWithFilter(
          vendorId,
          currentPage,
          itemsPerPage,
          serverFilters as VendorCarsFilters
        )
      : useAllCars(currentPage, itemsPerPage, carFilters);

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = carsQuery;

  // Extract data from response
  const carsData = carsResponse?.carSearchResult || [];
  const totalPages = carsResponse?.totalPages || 0;
  const totalRecord = carsResponse?.totalRecord || 0;

  // Memoized car transformation (simplified)
  const cars = useMemo(() => {
    if (!carsData || carsData.length === 0) return [];

    return carsData.map((car) => ({
      id: car?.carID?.toString() || car?.carId?.toString(),
      title: car?.name || "",
      brand: car?.model || "",
      image: car?.image
        ? getImageUrl(car.image)
        : car?.imageURLs?.[0]
        ? getImageUrl(car?.imageURLs[0])
        : "https://images.unsplash.com/photo-1549924231-f129b911e442",
      price: car?.pricePerDay || 0,
      daily_rate: car?.pricePerDay || 0,
      weeklyPrice: car?.pricePerWeek,
      weekly_rate: car?.pricePerWeek,
      monthlyPrice: car?.pricePerMonth,
      monthly_rate: car?.pricePerMonth,
      seats: parseInt(car?.doors || "4"),
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
  }, [carsData]);

  const filteredCars = useMemo(() => {
    if (!debouncedSearchTerm) return cars;
    return cars.filter((car) =>
      car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [cars, debouncedSearchTerm]);

  // Simplified filter updates with URL sync and vendor awareness
  const updateFilters = useCallback(
    (newFilters: Partial<CarsFiltersType>) => {
      const updatedFilters = { ...serverFilters, ...newFilters } as
        | CarsFiltersType
        | VendorCarsFilters;

      if (!areFiltersEqual(updatedFilters, serverFilters)) {
        setServerFilters(updatedFilters);
        updateUrlWithFilters(updatedFilters, vendorId);
        // setCurrentPage(1);
      }
    },
    [serverFilters, vendorId]
  );

  // Helper function to update URL with vendor preservation
  const updateUrlWithVendor = useCallback(
    (filters: CarsFiltersType | VendorCarsFilters, page?: number) => {
      const urlParams = new URLSearchParams();

      // Add filters to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, v));
        } else if (value !== undefined && value !== null) {
          urlParams.set(key, value.toString());
        }
      });

      // Add page parameter
      if (page && page > 1) {
        urlParams.set("page", page.toString());
      }

      // Preserve vendorId in path, not as query param
      let newPath = location.pathname;
      if (isVendorMode && vendorId) {
        newPath = `/cars/vendor/${vendorId}`;
      } else {
        newPath = "/cars";
      }

      const newSearch = urlParams.toString();
      window.history.replaceState(
        {},
        "",
        `${newPath}${newSearch ? `?${newSearch}` : ""}`
      );
    },
    [isVendorMode, vendorId, location.pathname]
  );

  // Simplified clear filters (preserves vendor route)
  const clearAllFilters = useCallback(() => {
    const clearedFilters = isVendorMode
      ? ({} as VendorCarsFilters)
      : ({} as CarsFiltersType);
    setServerFilters(clearedFilters);

    // Clear URL params but preserve vendor route
    updateUrlWithVendor(clearedFilters);

    setSearchTerm("");
    setCurrentPage(1);
  }, [isVendorMode, updateUrlWithVendor]);

  // Simplified pagination handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);

        // Update URL with page parameter, preserve vendor route and filters
        updateUrlWithVendor(serverFilters, page);

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages, serverFilters, updateUrlWithVendor]
  );

  // Enhanced URL sync effect for route + query param handling
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Detect route changes
    const isCurrentVendorMode = location.pathname.includes("/cars/vendor/");
    const currentVendorId = isCurrentVendorMode ? params.id : "";

    const paramsForFilters = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(paramsForFilters.get("page") || "1", 10);
    const parsedFilters = parseUrlParamsToFilters(paramsForFilters);

    const shouldUpdateFilters = !areFiltersEqual(parsedFilters, serverFilters);
    const shouldUpdatePage = pageFromUrl !== currentPage;
    const vendorModeChanged = isCurrentVendorMode !== isVendorMode;
    const vendorIdChanged = currentVendorId !== vendorId;

    if (
      shouldUpdateFilters ||
      shouldUpdatePage ||
      vendorModeChanged ||
      vendorIdChanged
    ) {
      // Update vendor state first
      if (vendorModeChanged || vendorIdChanged) {
        setServerFilters(
          isCurrentVendorMode
            ? (parsedFilters as VendorCarsFilters)
            : parsedFilters
        );
        previousFiltersRef.current = isCurrentVendorMode
          ? (parsedFilters as VendorCarsFilters)
          : parsedFilters;
      }
    }
  }, [
    location.pathname,
    location.search,
    params.id,
    currentPage,
    serverFilters,
    isVendorMode,
    vendorId,
  ]);

  // Filter change detection (simplified)
  useEffect(() => {
    const hasChanged = !areFiltersEqual(
      serverFilters,
      previousFiltersRef.current
    );
    if (hasChanged) {
      previousFiltersRef.current = serverFilters;
    }
  }, [serverFilters, currentPage]);

  // View mode persistence
  useEffect(() => {
    localStorage.setItem("carsViewMode", viewMode);
  }, [viewMode]);

  // Simplified filter data extraction with vendor awareness
  const filterData = useMemo(() => {
    if (!carsResponse?.carsCommonProp?.data) {
      return {
        vendorNames: [],
        branches: [],
        types: [],
        transmissions: [],
        fuelTypes: [],
        makes: [],
        carCapacities: [],
        maxPrice: 2000,
      };
    }

    const commonProps = carsResponse.carsCommonProp.data;
    const filterMap = new Map();
    commonProps.forEach((item) => {
      filterMap.set(item.header, item.filterData);
    });

    return {
      vendorNames: filterMap.get("vendorNames") || [],
      branches: filterMap.get("branches") || [],
      types: filterMap.get("types") || [],
      transmissions: filterMap.get("transmissions") || [],
      fuelTypes: filterMap.get("fuelTypes") || [],
      makes: filterMap.get("makes") || [],
      carCapacities: filterMap.get("carCapacities") || [],
      maxPrice: carsResponse.carsCommonProp.maxPrice || 2000,
    };
  }, [carsResponse?.carsCommonProp, isVendorMode]);

  const priceRange: [number, number] = serverFilters.priceRange
    ? [serverFilters.priceRange.min, serverFilters.priceRange.max]
    : [0, filterData.maxPrice || 2000];

  const selectedVendors = (serverFilters as CarsFiltersType).vendorNames || [];
  const selectedCategories = [
    ...((serverFilters as CarsFiltersType).types || []),
    ...((serverFilters as CarsFiltersType).fuelTypes || []),
    ...((serverFilters as CarsFiltersType).branches || []),
    ...((serverFilters as CarsFiltersType).transmissions || []),
    ...((serverFilters as CarsFiltersType).makes || []),
    ...((serverFilters as CarsFiltersType).carCapacities || []),
  ];

  const showSimilarCarsSlider =
    !isVendorMode && // Don't show on vendor pages
    (serverFilters as CarsFiltersType).pickupLocation &&
    (serverFilters as CarsFiltersType).dropOffLocation;

  // Loading state (unchanged)
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

  // Error state with vendor awareness
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <ApiErrorBoundary onRetry={() => refetch()}>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t(
                    isVendorMode ? "errorLoadingVendorCars" : "errorLoadingCars"
                  )}
                </h3>
                <p className="text-gray-500 mb-6">{t("pleaseTryAgainLater")}</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("retry")}
                </button>
                {isVendorMode && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        navigate("/cars");
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 justify-center mt-2"
                    >
                      {t("viewAllCars")}
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ApiErrorBoundary>
        </div>
      </div>
    );
  }

  // Main render with vendor-specific UI
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Vendor-specific header */}
            {isVendorMode && vendorId ? (
              <div className="w-full mb-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Search className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {t("vendorCarsTitle")}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          {totalRecord > 0
                            ? t("showingXCarsFromVendor", {
                                count: totalRecord,
                              })
                            : t("noCarsFromThisVendor")}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/cars");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                    >
                      {t("viewAllCars")}
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <CarsHeader />
            )}

            <div className="flex gap-8">
              {/* Filters sidebar */}
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
                        priceRange: {},
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
                      const makes = categories.filter((cat) =>
                        filterData.makes?.some((m) => m.name === cat)
                      );
                      const carCapacities = categories.filter((cat) =>
                        filterData.carCapacities?.some((c) => c.name === cat)
                      );

                      updateFilters({
                        types: types.length > 0 ? types : undefined,
                        fuelTypes: fuelTypes.length > 0 ? fuelTypes : undefined,
                        branches: branches.length > 0 ? branches : undefined,
                        transmissions:
                          transmissions.length > 0 ? transmissions : undefined,
                        makes: makes.length > 0 ? makes : undefined,
                        carCapacities:
                          carCapacities.length > 0 ? carCapacities : undefined,
                      });
                    }}
                    selectedVendors={selectedVendors}
                    setSelectedVendors={(vendors) => {
                      updateFilters({
                        vendorNames: vendors.length > 0 ? vendors : undefined,
                      });
                    }}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onClearFilters={clearAllFilters}
                    filterData={filterData}
                    isVendorMode={isVendorMode}
                    vendorId={vendorId}
                  />
                </ErrorBoundary>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
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
                    isLoading={isLoading}
                    hasNextPage={totalPages > currentPage}
                    hasPreviousPage={currentPage > 1}
                    vendorId={isVendorMode ? vendorId : undefined}
                    isVendorMode={isVendorMode}
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
                        // You can implement virtual scrolling if needed, or just use regular mapping
                        <div
                          className={
                            viewMode === "grid"
                              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                              : "space-y-4"
                          }
                        >
                          {filteredCars.map((car, index) => (
                            <CarErrorBoundary key={car?.id}>
                              <OptimizedCarCard
                                car={car}
                                viewMode={
                                  viewMode === "list" ? "list" : undefined
                                }
                                animationDelay={index * 0.05}
                              />
                            </CarErrorBoundary>
                          ))}
                        </div>
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
                          {t(isVendorMode ? "noCarsFromVendor" : "noCarsFound")}
                        </h3>
                        <p className="text-gray-500">
                          {t(
                            isVendorMode
                              ? "tryDifferentFiltersVendor"
                              : "tryAdjustingCriteria"
                          )}
                        </p>
                        {!isVendorMode && (
                          <button
                            onClick={clearAllFilters}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t("clearFilters")}
                          </button>
                        )}
                      </div>
                    )}
                  </ApiErrorBoundary>
                </div>

                {/* Similar cars slider - only on main cars page */}
                {showSimilarCarsSlider &&
                  !isVendorMode &&
                  filteredCars.length > 0 && (
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
