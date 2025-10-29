import React, { useState, useEffect } from "react";
import OfferCard from "../components/OfferCard";
import OffersHeader from "../components/offers/OffersHeader";
import OffersSearchControls from "../components/offers/OffersSearchControls";
import OffersFilters from "../components/offers/OffersFilters";
import OffersPagination from "../components/offers/OffersPagination";
import { Search } from "lucide-react";
import { useAllOffers } from "@/hooks/website/useWebsiteOffers";

const Offers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 12;

  // Use the API hook for offers without filter parameters (we'll filter locally)
  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
  } = useAllOffers(currentPage, itemsPerPage);

  // Transform API response to match the expected format for the UI
  const offers =
    offersResponse?.carSearchResult.map((offer) => ({
      id: offer.id.toString(),
      title: offer.offerTitle || "No title",
      title_ar: "", // API doesn't provide Arabic titles yet
      description: offer.offerDescription || "No description",
      description_ar: "", // API doesn't provide Arabic descriptions yet
      discount: `${Math.round(
        ((offer.oldPricePerDay - offer.totalPrice) / offer.oldPricePerDay) * 100
      )}%`,
      validUntil: offer.endDate,
      image: offer.offerImage
        ? `${"https://test.get2cars.com"}/${offer.offerImage.replace(
            /\\/g,
            "/"
          )}`
        : "https://images.unsplash.com/photo-1549924231-f129b911e442",
      price: offer.totalPrice || 0,
      vendorName: offer.vendorName || "Unknown Vendor",
      terms: [
        "Valid for limited time only",
        "Cannot be combined with other offers",
        "Subject to availability",
      ],
      vendor: {
        id: offer.carId.toString(),
        name: offer.vendorName || "Unknown Vendor",
        logo_url: offer.companyLogo
          ? `${"https://test.get2cars.com"}/${offer.companyLogo.replace(
              /\\/g,
              "/"
            )}`
          : null,
      },
      carId: offer?.carId,
    })) || [];

  // Implement local filtering

  const filteredOffers = offers.filter((offer) => {
    // Filter by search term
    if (
      searchTerm &&
      !offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by price range
    // Only filter if price range is not at default values
    const isDefaultPriceRange = priceRange[0] === 0 && priceRange[1] === 2000;
    if (!isDefaultPriceRange) {
      // Make sure we're working with numbers
      // Use the price from the transformed offer object
      const offerPrice = offer.price;
      const minPrice = priceRange[0];
      const maxPrice = priceRange[1];

      if (isNaN(offerPrice) || offerPrice < minPrice || offerPrice > maxPrice) {
        return false;
      }
    }

    // Filter by selected vendors
    if (
      selectedVendors.length > 0 &&
      !selectedVendors.includes(offer.vendor.name)
    ) {
      return false;
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      // For debugging

      // We need to check the original API response fields
      // The original offer data is in offersResponse.carSearchResult
      // But we're working with the transformed offer object

      // Find the original offer data
      const originalOffer = offersResponse?.carSearchResult.find(
        (o) => o.id.toString() === offer.id
      );

      if (!originalOffer) {
        return false;
      }

      // Check if any selected category matches this offer
      const matchesCategory = selectedCategories.some((category) => {
        const categoryLower = category.toLowerCase();

        // Check against the actual fields in the original offer
        const matchesFuelType =
          originalOffer.fuelType &&
          originalOffer.fuelType.toLowerCase() === categoryLower;
        const matchesTransmission =
          originalOffer.transmission &&
          originalOffer.transmission.toLowerCase() === categoryLower;
        const matchesType =
          originalOffer.type &&
          originalOffer.type.toLowerCase() === categoryLower;
        const matchesBranch =
          originalOffer.branch &&
          originalOffer.branch.toLowerCase() === categoryLower;

        // Check if any of the fields match
        const isMatch =
          matchesFuelType ||
          matchesTransmission ||
          matchesType ||
          matchesBranch;

        return isMatch;
      });

      if (!matchesCategory) {
        return false;
      }
    }

    return true;
  });

  // Local pagination logic
  const totalItems = filteredOffers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearAllFilters = () => {
    console.log("Clearing all filters");
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCategories, selectedVendors, searchTerm]);

  if (error) {
    console.error("Error in offers page:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading offers
              </h3>
              <p className="text-gray-500">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-52 flex-shrink-0 hidden lg:block">
              <OffersFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClearFilters={clearAllFilters}
                filterData={{
                  vendorNames: offersResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "vendorNames"
                  )?.filterData,
                  branches: offersResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "branches"
                  )?.filterData,
                  types: offersResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "types"
                  )?.filterData,
                  transmissions: offersResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "transmissions"
                  )?.filterData,
                  fuelTypes: offersResponse?.carsCommonProp?.data.find(
                    (item) => item.header === "fuelTypes"
                  )?.filterData,
                  maxPrice: offersResponse?.carsCommonProp?.maxPrice,
                }}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <OffersHeader />

              <OffersSearchControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                filteredOffersLength={filteredOffers.length}
                currentPage={currentPage}
                totalPages={totalPages}
              />

              {/* Offers Grid */}
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {paginatedOffers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>

              <OffersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />

              {filteredOffers.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No offers found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
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
