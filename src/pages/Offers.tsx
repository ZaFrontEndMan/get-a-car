import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import OfferCard from "../components/OfferCard";
import OffersHeader from "../components/offers/OffersHeader";
import OffersSearchControls from "../components/offers/OffersSearchControls";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters"; // Reuse Cars filter UI
import { useAllOffers } from "@/hooks/website/useWebsiteOffers";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import CarsSkeleton, {
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import { Search } from "lucide-react";
// import SimilarOffersSlider if you want a slider

const Offers = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL-driven filters
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const vendorNames = searchParams.getAll("vendorNames");
  const types = searchParams.getAll("types");
  const transmissions = searchParams.getAll("transmissions");
  const fuelTypes = searchParams.getAll("fuelTypes");
  const branches = searchParams.getAll("branches");
  const priceRangeStr = searchParams.get("priceRange");
  const priceRange = priceRangeStr
    ? JSON.parse(decodeURIComponent(priceRangeStr))
    : { min: 0, max: 2000 };

  // State that syncs with URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem("offersViewMode") as "grid" | "list") || "grid"
  );

  const itemsPerPage = 12;
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );

  // Compose the unified filters object as in Cars
  const serverFilters = useMemo(
    () => ({
      vendorNames: vendorNames.length > 0 ? vendorNames : undefined,
      types: types.length > 0 ? types : undefined,
      transmissions: transmissions.length > 0 ? transmissions : undefined,
      fuelTypes: fuelTypes.length > 0 ? fuelTypes : undefined,
      branches: branches.length > 0 ? branches : undefined,
      priceRange:
        priceRange.min > 0 || priceRange.max < 2000
          ? { min: priceRange.min, max: priceRange.max }
          : undefined,
    }),
    [vendorNames, types, transmissions, fuelTypes, branches, priceRange]
  );

  // Main offers API query
  const offersQuery = useAllOffers(currentPage, itemsPerPage, serverFilters);
  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = offersQuery;

  // Main offers response and total counts
  const offersData = offersResponse?.data?.carSearchResult || [];
  const totalRecords = offersResponse?.data?.totalRecord || 0;
  const totalPages = offersResponse?.data?.totalPages || 0;

  // Memoized client-side search filter (like Cars page)
  const offers = useMemo(() => offersData, [offersData]);
  const filteredOffers = useMemo(() => {
    if (!debouncedSearchTerm) return offers;
    return offers.filter((offer) =>
      offer?.offerTitle
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [offers, debouncedSearchTerm]);

  // Extract filterData from API (same structure as Cars expects)
  const filterData = useMemo(() => {
    if (!offersResponse?.data?.carsCommonProp?.data) {
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
    const commonProps = offersResponse.data.carsCommonProp.data;
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
      maxPrice: offersResponse.data.carsCommonProp.maxPrice || 2000,
    };
  }, [offersResponse]);

  const priceRangeForUI: [number, number] = offersResponse?.data?.priceRange
    ? [offersResponse.data.priceRange.min, offersResponse.data.priceRange.max]
    : [0, filterData.maxPrice || 2000];

  // Selected filter sets
  const selectedVendors = vendorNames;
  const selectedCategories = [
    ...types,
    ...fuelTypes,
    ...branches,
    ...transmissions,
  ];

  // Universal filter updating (syncs URL, resets page)
  const updateFilters = useCallback(
    (newFilters: {
      vendorNames?: string[];
      types?: string[];
      transmissions?: string[];
      fuelTypes?: string[];
      branches?: string[];
      priceRange?: { min: number; max: number };
    }) => {
      const params = new URLSearchParams();
      if (newFilters.vendorNames)
        newFilters.vendorNames.forEach((v) => params.append("vendorNames", v));
      if (newFilters.types)
        newFilters.types.forEach((v) => params.append("types", v));
      if (newFilters.transmissions)
        newFilters.transmissions.forEach((v) =>
          params.append("transmissions", v)
        );
      if (newFilters.fuelTypes)
        newFilters.fuelTypes.forEach((v) => params.append("fuelTypes", v));
      if (newFilters.branches)
        newFilters.branches.forEach((v) => params.append("branches", v));
      if (newFilters.priceRange)
        params.set("priceRange", JSON.stringify(newFilters.priceRange));
      // Always reset page on filter change
      params.set("page", "1");
      navigate(`?${params}`, { replace: true });
      setCurrentPage(1);
    },
    [navigate]
  );

  // Pagination handler (keeps filters in URL)
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        navigate(`?${params}`, { replace: true });
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [searchParams, totalPages, currentPage, navigate]
  );

  const clearAllFilters = useCallback(() => {
    navigate("", { replace: true });
    setCurrentPage(1);
    setSearchTerm("");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("offersViewMode", viewMode);
  }, [viewMode]);

  // Loading state reuses Cars skeletons, or use Offer variants
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <CarsSearchControlsSkeleton />
        <CarsSkeleton viewMode={viewMode} itemsPerPage={itemsPerPage} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div>
          <p>{t("errorLoadingOffers")}</p>
          <button onClick={() => refetch()} className="mt-2 btn btn-primary">
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <OffersHeader />
      <div className="flex gap-8 max-w-7xl mx-auto px-4">
        {/* Filter sidebar - reuse MemoizedCarsFilters */}
        <div className="w-52 flex-shrink-0 hidden lg:block">
          <MemoizedCarsFilters
            priceRange={priceRangeForUI}
            setPriceRange={(range) =>
              updateFilters({
                ...serverFilters,
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
                ...serverFilters,
                types: types.length ? types : undefined,
                fuelTypes: fuelTypes.length ? fuelTypes : undefined,
                branches: branches.length ? branches : undefined,
                transmissions: transmissions.length ? transmissions : undefined,
              });
            }}
            selectedVendors={selectedVendors}
            setSelectedVendors={(vendors) =>
              updateFilters({ ...serverFilters, vendorNames: vendors })
            }
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onClearFilters={clearAllFilters}
            filterData={filterData}
            // Optionally, add more props here if you extend MemoizedCarsFilters
          />
        </div>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <OffersSearchControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filteredoffersLength={totalRecords}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isSearching={isSearching}
            isLoading={isLoading}
          />
          <div className="mt-6">
            {isSearching && searchTerm ? (
              <CarsSkeleton
                viewMode={viewMode}
                itemsPerPage={Math.min(itemsPerPage, 6)}
              />
            ) : filteredOffers.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredOffers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    animationDelay={index * 0.05}
                    isLoading={isFetching}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("noOffersFound")}
                </h3>
                <p className="text-gray-500">{t("tryAdjustingCriteria")}</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
