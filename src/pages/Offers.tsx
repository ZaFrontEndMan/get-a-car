import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import OfferCard from "../components/OfferCard";
import OffersHeader from "../components/offers/OffersHeader";
import OffersSearchControls from "../components/offers/OffersSearchControls";
import OffersFilters from "../components/offers/OffersFilters";
import {
  Offer,
  extractFilterData,
  getOfferImageUrl,
  getCompanyLogoUrl,
  calculateDiscount,
} from "@/api/website/websiteOffers";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarsSkeleton, {
  CarsSearchControlsSkeleton,
} from "@/components/cars/CarsSkeleton";
import { useAllOffers } from "@/hooks/website/useWebsiteOffers";
import SimilarCarsSlider from "@/components/SimilarCarsSlider";

const Offers = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract URL params for server-side filters
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const vendorNames = searchParams.getAll("vendorNames");
  const types = searchParams.getAll("types");
  const transmissions = searchParams.getAll("transmissions");
  const fuelTypes = searchParams.getAll("fuelTypes");
  const branches = searchParams.getAll("branches");
  const priceRangeStr = searchParams.get("priceRange");
  const priceRange = priceRangeStr
    ? (JSON.parse(decodeURIComponent(priceRangeStr)) as {
        min: number;
        max: number;
      })
    : { min: 0, max: 2000 };

  // State that syncs with URL params (like Cars component)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    return (
      (localStorage.getItem("offersViewMode") as "grid" | "list") || "grid"
    );
  });

  const itemsPerPage = 12;

  // Debounced search for client-side filtering (like Cars)
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(
    searchTerm,
    300
  );

  // Sync currentPage with URL changes
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams.get("page"), currentPage]);

  // Prepare filters for server-side API call (excludes searchTerm)
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
    [
      vendorNames,
      types,
      transmissions,
      fuelTypes,
      branches,
      priceRange.min,
      priceRange.max,
    ]
  );

  // Dynamic hook selection based on route (server-side filters)
  const offersQuery = useAllOffers(currentPage, itemsPerPage, serverFilters);

  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = offersQuery;

  // Extract data from response (exactly like Cars)
  const offersData = offersResponse?.data?.carSearchResult || [];
  const totalRecords = offersResponse?.data?.totalRecord || 0;
  const totalPages = offersResponse?.data?.totalPages || 0;

  // Memoized offer transformation (simplified, exactly like Cars)
  const offers: Offer[] = useMemo(() => {
    if (!offersData || offersData.length === 0) return [];

    return offersData.map((offer: any) => ({
      id: offer.id?.toString() || "",
      title: offer.offerTitle || t("noTitle") || "No title",
      title_ar: offer.offerTitle || "",
      description:
        offer.offerDescription || t("noDescription") || "No description",
      description_ar: offer.offerDescription || "",
      discount: calculateDiscount(
        offer.oldPricePerDay || 0,
        offer.totalPrice || 0
      ),
      validUntil: offer.endDate,
      image: getOfferImageUrl(offer.offerImage),
      price: offer.totalPrice || 0,
      vendorName: offer.vendorName || t("unknownVendor") || "Unknown vendor",
      carId: offer.carId,
      fuelType: offer.fuelType?.replace(/\r?\n/g, "")?.trim() || "",
      branch: offer.branch?.replace(/\r?\n/g, "")?.trim() || "",
      transmission: offer.transmission?.replace(/\r?\n/g, "")?.trim() || "",
      type: offer.type?.replace(/\r?\n/g, "")?.trim() || "",
      originalPricePerDay: offer.oldPricePerDay || 0,
      originalPricePerWeek: offer.oldPricePerWeek || 0,
      originalPricePerMonth: offer.oldPricePerMonth || 0,
      terms: [
        t("validForLimitedTime") || "Valid for limited time",
        t("cannotBeCombined") || "Cannot be combined with other offers",
        t("subjectToAvailability") || "Subject to availability",
      ],
      vendor: {
        id: offer.vendorId,
        name: offer.vendorName || t("unknownVendor") || "Unknown vendor",
        logo_url: getCompanyLogoUrl(offer.companyLogo),
      },
      originalOffer: {
        id: offer.id,
        offerTitle: offer.offerTitle,
        offerDescription: offer.offerDescription,
        oldPricePerDay: offer.oldPricePerDay,
        totalPrice: offer.totalPrice,
        startDate: offer.startDate,
        endDate: offer.endDate,
        carId: offer.carId,
      },
    }));
  }, [offersData, t]);

  // Client-side search filtering (exactly like Cars)
  const filteredOffers = useMemo(() => {
    if (!debouncedSearchTerm) return offers;
    return offers.filter((offer) =>
      offer?.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [offers, debouncedSearchTerm]);

  // Simplified filter updates with URL sync (server-side filters)
  const updateFilters = useCallback(
    (newFilters: {
      vendorNames?: string[];
      types?: string[];
      transmissions?: string[];
      fuelTypes?: string[];
      branches?: string[];
      priceRange?: { min: number; max: number };
    }) => {
      const updatedFilters = newFilters;

      // Update URL with filters (server-side)
      const newSearchParams = new URLSearchParams(searchParams.toString());
      let needsUpdate = false;

      // Clear page when filters change
      newSearchParams.delete("page");

      // Add filters to URL
      if (updatedFilters.vendorNames && updatedFilters.vendorNames.length > 0) {
        updatedFilters.vendorNames.forEach((v) =>
          newSearchParams.append("vendorNames", v)
        );
        needsUpdate = true;
      } else {
        newSearchParams.delete("vendorNames");
      }
      if (updatedFilters.types && updatedFilters.types.length > 0) {
        updatedFilters.types.forEach((v) => newSearchParams.append("types", v));
        needsUpdate = true;
      } else {
        newSearchParams.delete("types");
      }
      if (
        updatedFilters.transmissions &&
        updatedFilters.transmissions.length > 0
      ) {
        updatedFilters.transmissions.forEach((v) =>
          newSearchParams.append("transmissions", v)
        );
        needsUpdate = true;
      } else {
        newSearchParams.delete("transmissions");
      }
      if (updatedFilters.fuelTypes && updatedFilters.fuelTypes.length > 0) {
        updatedFilters.fuelTypes.forEach((v) =>
          newSearchParams.append("fuelTypes", v)
        );
        needsUpdate = true;
      } else {
        newSearchParams.delete("fuelTypes");
      }
      if (updatedFilters.branches && updatedFilters.branches.length > 0) {
        updatedFilters.branches.forEach((v) =>
          newSearchParams.append("branches", v)
        );
        needsUpdate = true;
      } else {
        newSearchParams.delete("branches");
      }
      if (updatedFilters.priceRange) {
        newSearchParams.set(
          "priceRange",
          JSON.stringify(updatedFilters.priceRange)
        );
        needsUpdate = true;
      } else {
        newSearchParams.delete("priceRange");
      }

      if (needsUpdate) {
        const newSearch = newSearchParams.toString();
        navigate(`${newSearch ? `?${newSearch}` : ""}`, { replace: true });
        setCurrentPage(1);
      }
    },
    [searchParams, navigate]
  );

  // Simplified pagination handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);

        // Update URL with page parameter, preserve filters
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", page.toString());

        const newSearch = newSearchParams.toString();
        navigate(`${newSearch ? `?${newSearch}` : ""}`, { replace: true });

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages, searchParams, navigate]
  );

  // Simplified clear filters (preserves route)
  const clearAllFilters = useCallback(() => {
    setCurrentPage(1);

    // Clear URL params but preserve route
    const newSearchParams = new URLSearchParams();
    newSearchParams.delete("page");

    const newSearch = newSearchParams.toString();
    navigate(`${newSearch ? `?${newSearch}` : ""}`, { replace: true });
  }, [navigate]);

  // View mode persistence
  useEffect(() => {
    localStorage.setItem("offersViewMode", viewMode);
  }, [viewMode]);

  // Simplified filter data extraction with vendor awareness
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
      makes: [],
      carCapacities: [],
      maxPrice: offersResponse.data.carsCommonProp.maxPrice || 2000,
    };
  }, [offersResponse]);

  const priceRangeForUI: [number, number] = offersResponse?.data?.priceRange
    ? [offersResponse.data.priceRange.min, offersResponse.data.priceRange.max]
    : [0, filterData.maxPrice || 2000];

  const selectedVendors = vendorNames;
  const selectedCategories = [
    ...types,
    ...fuelTypes,
    ...branches,
    ...transmissions,
  ];

  const showSimilarOffers = !searchTerm && vendorNames.length === 0; // Simplified

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

  // Error state (unchanged)
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <ApiErrorBoundary onRetry={() => refetch()}>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("errorLoadingOffers")}
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

  // Main render with your exact API structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters sidebar */}
            <div className="w-52 flex-shrink-0 hidden lg:block">
              <OffersFilters
                priceRange={priceRangeForUI}
                setPriceRange={(range) =>
                  updateFilters({
                    priceRange: {
                      min: range[0],
                      max: range[1],
                    },
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
                setSelectedVendors={(vendors) => {
                  updateFilters({
                    vendorNames: vendors.length > 0 ? vendors : undefined,
                  });
                }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={clearAllFilters}
                filterData={filterData}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <OffersHeader />

              <OffersSearchControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredoffersLength={Number(totalRecords)} // Local search results
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
                        isLoading={isFetching}
                        key={offer.id}
                        offer={offer}
                        animationDelay={index * 0.05}
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

              {/* Similar offers slider - only on main offers page */}
              {showSimilarOffers && filteredOffers.length > 0 && (
                <div className="mt-8">
                  <SimilarCarsSlider car={filteredOffers[0]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
