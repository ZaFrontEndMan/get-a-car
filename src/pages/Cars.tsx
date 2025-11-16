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
} from "@/hooks/website/useWebsiteCars";
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
import { getAppliedFilterBadges } from "@/utils/bookingUtils";

const Cars = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Vendor page detection
  const vendorId = params.id || "";
  const isVendorMode =
    !!vendorId && location.pathname.includes("/cars/vendor/");

  // Initial filters from URL
  const [serverFilters, setServerFilters] = useState(() => {
    const urlParams = new URLSearchParams(location.search);
    const parsed = parseUrlParamsToFilters(urlParams);
    // Additional URL extraction
    const pickupLocation = urlParams.get("pickupLocation") || undefined;
    const dropOffLocation = urlParams.get("dropOffLocation") || undefined;
    const pickupDate = urlParams.get("pickupDate") || undefined;
    const dropoffDate = urlParams.get("dropoffDate") || undefined;
    const withDriver = urlParams.get("withDriver") === "true" || false;

    const validPickupDate = pickupDate
      ? new Date(pickupDate).toISOString() || undefined
      : undefined;
    const validDropoffDate = dropoffDate
      ? new Date(dropoffDate).toISOString() || undefined
      : undefined;

    const initialFilters = {
      ...parsed,
      pickupLocation,
      dropOffLocation,
      pickupDate: validPickupDate,
      dropoffDate: validDropoffDate,
      withDriver,
      vendorNames:
        parsed.vendorNames && Array.isArray(parsed.vendorNames)
          ? parsed.vendorNames
          : parsed.vendorNames
          ? [parsed.vendorNames]
          : [],
    };

    if (isVendorMode && vendorId) {
      return initialFilters;
    }
    return initialFilters;
  });

  // Query, paging, modes
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [viewMode, setViewMode] = useState(
    (localStorage.getItem("carsViewMode") as "grid" | "list") || "grid"
  );
  const itemsPerPage = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 50;

  const containerRef = useRef<HTMLDivElement>(null);
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );
  const previousFiltersRef = useRef(serverFilters);
  const isInitialMount = useRef(true);

  // Compose filters passed to API
  const carFilters = useMemo(
    () => ({
      ...serverFilters,
      vendorNames:
        serverFilters.vendorNames && Array.isArray(serverFilters.vendorNames)
          ? serverFilters.vendorNames
          : serverFilters.vendorNames
          ? [serverFilters.vendorNames]
          : [],
    }),
    [serverFilters]
  );

  // Unified API query based on vendor presence
  const vendorCarsQuery = useGetVendorCarWithFilter(
    vendorId,
    currentPage,
    itemsPerPage,
    serverFilters
  );
  const allCarsQuery = useAllCars(currentPage, itemsPerPage, carFilters);

  const carsQuery = isVendorMode && vendorId ? vendorCarsQuery : allCarsQuery;
  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = carsQuery;

  // Extract response
  const carsData = carsResponse?.carSearchResult || [];
  const totalPages = carsResponse?.totalPages || 0;
  const totalRecord = carsResponse?.totalRecord || 0;

  // Transform raw API to car format for cards
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
      withDriver: car?.withDriver,
    }));
  }, [carsData]);

  // Local search filter
  const filteredCars = useMemo(() => {
    if (!debouncedSearchTerm) return cars;
    return cars.filter((car) =>
      car?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [cars, debouncedSearchTerm]);

  // Update filters only if changed
  const updateFilters = useCallback(
    (newFilters: Partial<CarsFiltersType>) => {
      const updatedFilters = { ...serverFilters, ...newFilters };
      // Always keep vendorNames as array
      if (updatedFilters.vendorNames) {
        updatedFilters.vendorNames = Array.isArray(updatedFilters.vendorNames)
          ? updatedFilters.vendorNames
          : [updatedFilters.vendorNames];
      }
      if (!areFiltersEqual(updatedFilters, serverFilters)) {
        setServerFilters(updatedFilters);
        updateUrlWithFilters(updatedFilters, vendorId);
      }
    },
    [serverFilters, vendorId]
  );

  // Update URL for page change, use array for vendorNames
  const updateUrlWithVendor = useCallback(
    (filters: CarsFiltersType | VendorCarsFilters, page?: number) => {
      const urlParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, v));
        } else if (value !== undefined && value !== null) {
          urlParams.set(key, value.toString());
        }
      });
      if (page && page > 1) urlParams.set("page", page.toString());
      let newPath =
        isVendorMode && vendorId ? `/cars/vendor/${vendorId}` : "/cars";
      const newSearch = urlParams.toString();
      window.history.replaceState(
        {},
        "",
        `${newPath}${newSearch ? `?${newSearch}` : ""}`
      );
    },
    [isVendorMode, vendorId]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = isVendorMode
      ? ({} as VendorCarsFilters)
      : ({} as CarsFiltersType);
    setServerFilters(clearedFilters);
    updateUrlWithVendor(clearedFilters);
    setSearchTerm("");
    setCurrentPage(1);
  }, [isVendorMode, updateUrlWithVendor]);

  // Pagination handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
        updateUrlWithVendor(serverFilters, page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages, serverFilters, updateUrlWithVendor]
  );

  // Effect for syncing URL → filters, only on relevant changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only watch route changes!
    const isCurrentVendorMode = location.pathname.includes("/cars/vendor/");
    const currentVendorId = isCurrentVendorMode ? params.id : "";
    const paramsForFilters = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(paramsForFilters.get("page") || "1", 10);
    const parsedFilters = parseUrlParamsToFilters(paramsForFilters);

    // Extract locations/dates/driver from current URL
    const pickupLocation = paramsForFilters.get("pickupLocation") || undefined;
    const dropOffLocation =
      paramsForFilters.get("dropOffLocation") || undefined;
    const pickupDate = paramsForFilters.get("pickupDate") || undefined;
    const dropoffDate = paramsForFilters.get("dropoffDate") || undefined;
    const withDriver = paramsForFilters.get("withDriver") === "true" || false;

    const validPickupDate = pickupDate
      ? new Date(pickupDate).toISOString() || undefined
      : undefined;
    const validDropoffDate = dropoffDate
      ? new Date(dropoffDate).toISOString() || undefined
      : undefined;

    // Vendor names always as array!
    const vendorNamesArray =
      parsedFilters.vendorNames && Array.isArray(parsedFilters.vendorNames)
        ? parsedFilters.vendorNames
        : parsedFilters.vendorNames
        ? [parsedFilters.vendorNames]
        : [];

    const syncedFilters = {
      ...parsedFilters,
      pickupLocation,
      dropOffLocation,
      pickupDate: validPickupDate,
      dropoffDate: validDropoffDate,
      withDriver,
      vendorNames: vendorNamesArray,
    };

    const shouldUpdateFilters = !areFiltersEqual(syncedFilters, serverFilters);
    const shouldUpdatePage = pageFromUrl !== currentPage;
    const vendorModeChanged = isCurrentVendorMode !== isVendorMode;
    const vendorIdChanged = currentVendorId !== vendorId;

    // Only fire setters if change
    if (
      shouldUpdateFilters ||
      shouldUpdatePage ||
      vendorModeChanged ||
      vendorIdChanged
    ) {
      if (vendorModeChanged || vendorIdChanged) {
        setServerFilters(syncedFilters);
        previousFiltersRef.current = syncedFilters;
      } else if (shouldUpdateFilters) {
        setServerFilters(syncedFilters);
        previousFiltersRef.current = syncedFilters;
      } else if (shouldUpdatePage) {
        setCurrentPage(pageFromUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, params.id]);

  // Track last filter
  useEffect(() => {
    const hasChanged = !areFiltersEqual(
      serverFilters,
      previousFiltersRef.current
    );
    if (hasChanged) previousFiltersRef.current = serverFilters;
  }, [serverFilters]);

  useEffect(() => {
    localStorage.setItem("carsViewMode", viewMode);
  }, [viewMode]);

  // Extract filter data from response
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

  const priceRange = serverFilters.priceRange
    ? [serverFilters.priceRange.min, serverFilters.priceRange.max]
    : [0, filterData.maxPrice || 2000];

  const selectedVendors = serverFilters.vendorNames || [];
  const selectedCategories = [
    ...(serverFilters.types || []),
    ...(serverFilters.fuelTypes || []),
    ...(serverFilters.branches || []),
    ...(serverFilters.transmissions || []),
    ...(serverFilters.makes || []),
    ...(serverFilters.carCapacities || []),
  ];

  const showSimilarCarsSlider =
    !isVendorMode &&
    serverFilters.pickupLocation &&
    serverFilters.dropOffLocation;

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
  // const appliedBadges = useMemo(
  //   () => getAppliedFilterBadges(serverFilters, t, filterData),
  //   []
  // );
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
            {/* {appliedBadges.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {appliedBadges.map(({ key, value }, idx) => (
                  <span
                    key={key + value + idx}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-3 py-1 rounded-full"
                  >
                    {key}
                    {value && ": "}
                    {value}
                  </span>
                ))}
                <button
                  className="ml-2 text-xs text-blue-600 underline"
                  onClick={clearAllFilters}
                  type="button"
                >
                  {t("clearFilters")}
                </button>
              </div>
            )} */}
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
                    setPriceRange={(range) => updateFilters({ priceRange: {} })}
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
                      // Vendors always array!
                      updateFilters({
                        vendorNames: Array.isArray(vendors)
                          ? vendors
                          : [vendors],
                      });
                    }}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onClearFilters={clearAllFilters}
                    filterData={filterData}
                    isVendorMode={isVendorMode}
                    vendorId={vendorId}
                    pickupLocation={serverFilters.pickupLocation}
                    dropOffLocation={serverFilters.dropOffLocation}
                    pickupDate={serverFilters.pickupDate}
                    dropoffDate={serverFilters.dropoffDate}
                    withDriver={serverFilters.withDriver}
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
