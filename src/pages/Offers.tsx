import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import OfferCard from "../components/OfferCard";
import OffersHeader from "../components/offers/OffersHeader";
import OffersSearchControls from "../components/offers/OffersSearchControls";
import MemoizedCarsFilters from "../components/cars/MemoizedCarsFilters";
import { useAllOffers } from "@/hooks/website/useWebsiteOffers";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import CarsSkeleton, {
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import { Search } from "lucide-react";
import {
  getCompanyLogoUrl,
  getOfferImageUrl,
} from "@/api/website/websiteOffers";
import { parseUrlParamsToFilters } from "@/utils/urlParams";

const Offers = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse filters once from URL using your Cars page logic utility
  const [serverFilters, setServerFilters] = useState(() => {
    const urlParams = new URLSearchParams(location.search);
    // parseUrlParamsToFilters returns object with priceRange, vendorNames, etc.
    const parsed = parseUrlParamsToFilters(urlParams);
    return parsed;
  });

  // Paging and view mode
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem("offersViewMode") as "grid" | "list") || "grid"
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const itemsPerPage = 12;
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );

  // Make sure filters object for API is built like on Cars page
  const filtersForApi = useMemo(
    () => ({
      ...serverFilters,
      // vendorNames always as array
      vendorNames:
        serverFilters.vendorNames && Array.isArray(serverFilters.vendorNames)
          ? serverFilters.vendorNames
          : serverFilters.vendorNames
          ? [serverFilters.vendorNames]
          : [],
    }),
    [serverFilters]
  );

  // Main offers API query
  const offersQuery = useAllOffers(currentPage, itemsPerPage, filtersForApi);
  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = offersQuery;

  // Memoized offer data extraction
  const offersData = offersResponse?.data?.carSearchResult || [];
  const totalRecords = offersResponse?.data?.totalRecord || 0;
  const totalPages = offersResponse?.data?.totalPages || 0;

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

  // Cars page style: get range from filter, or fallback to whole range
  const priceRange = serverFilters.priceRange
    ? [serverFilters.priceRange.min, serverFilters.priceRange.max]
    : [0, filterData.maxPrice || 2000];

  // Build selected* for MemoizedCarsFilters
  const selectedVendors = serverFilters.vendorNames || [];
  const selectedCategories = [
    ...(serverFilters.types || []),
    ...(serverFilters.fuelTypes || []),
    ...(serverFilters.branches || []),
    ...(serverFilters.transmissions || []),
    ...(serverFilters.makes || []),
    ...(serverFilters.carCapacities || []),
  ];

  // Update filters unified (uses areFiltersEqual + update like Cars)
  const updateFilters = useCallback(
    (newFilters: Partial<typeof serverFilters>) => {
      const updatedFilters = { ...serverFilters, ...newFilters };
      if (updatedFilters.vendorNames) {
        updatedFilters.vendorNames = Array.isArray(updatedFilters.vendorNames)
          ? updatedFilters.vendorNames
          : [updatedFilters.vendorNames];
      }
      setServerFilters(updatedFilters);

      // Build query string like Cars page, use separate params!
      const urlParams = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, v));
        } else if (value && typeof value === "object" && key === "priceRange") {
          // Write min/max as separate params
          if (value.min != null) urlParams.set("priceMin", value.min);
          if (value.max != null) urlParams.set("priceMax", value.max);
        } else if (value !== undefined && value !== null) {
          urlParams.set(key, value.toString());
        }
      });
      urlParams.set("page", "1");
      navigate(`?${urlParams}`, { replace: true });
      setCurrentPage(1);
    },
    [serverFilters, navigate]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        const params = new URLSearchParams(location.search);
        params.set("page", page.toString());
        navigate(`?${params}`, { replace: true });
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [location, totalPages, currentPage, navigate]
  );

  const clearAllFilters = useCallback(() => {
    setServerFilters({});
    navigate("", { replace: true });
    setCurrentPage(1);
    setSearchTerm("");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("offersViewMode", viewMode);
  }, [viewMode]);

  function mapApiOfferToOfferCard(apiOffer) {
    return {
      id: apiOffer.id?.toString(),
      title: apiOffer.offerTitle,
      title_ar: apiOffer.offerTitle, // Assume Arabic
      description: apiOffer.offerDescription,
      description_ar: apiOffer.offerDescription,
      discount: apiOffer.totalPrice ? `${apiOffer.totalPrice}%` : undefined,
      validUntil: apiOffer.endDate,
      image: getOfferImageUrl
        ? getOfferImageUrl(apiOffer.offerImage)
        : apiOffer.offerImage,
      terms: ["صالح لفترة محدودة", "لا يمكن دمجه مع عروض أخرى", "حسب التوفر"],
      carId: apiOffer.carId?.toString(),
      originalPricePerDay: apiOffer.oldPricePerDay,
      originalOffer: {
        totalPrice: (
          apiOffer.oldPricePerDay -
          apiOffer?.oldPricePerDay * (apiOffer?.totalPrice / 100)
        ).toFixed(2),
      },
      vendor: {
        id: apiOffer.vendorId,
        name: apiOffer.vendorName,
        logo_url: getCompanyLogoUrl
          ? getCompanyLogoUrl(apiOffer.companyLogo)
          : apiOffer.companyLogo,
      },
    };
  }

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
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OffersHeader />
          <div className="flex gap-8 mx-auto px-4">
            {/* Filter sidebar - reuse MemoizedCarsFilters */}
            <div className="w-52 flex-shrink-0 hidden lg:block">
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
                setSelectedVendors={(vendors) =>
                  updateFilters({
                    vendorNames: Array.isArray(vendors) ? vendors : [vendors],
                  })
                }
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={clearAllFilters}
                filterData={filterData}
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
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredOffers.map((apiOffer, index) => (
                      <OfferCard
                        key={apiOffer.id}
                        offer={mapApiOfferToOfferCard(apiOffer)}
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
      </div>
    </div>
  );
};

export default Offers;
