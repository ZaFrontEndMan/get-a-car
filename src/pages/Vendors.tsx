// src/pages/Vendors.tsx
import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import VendorCard from "../components/VendorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useWebsiteVendors } from "@/hooks/website/useWebsiteVendors";

const VendorsContent = () => {
  const { t } = useLanguage();
  const { data, isLoading, error } = useWebsiteVendors();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 9;

  // ✅ Extract vendors safely from API response
  const vendors = data?.data.vendorsOwners ?? [];

  // ✅ Apply search filter
  const filteredVendors = vendors.filter((vendor) =>
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Process vendors into props for VendorCard
  const processedVendors = filteredVendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.companyName,
    rating: 0, // API doesn’t provide rating, keep default
    image:
      vendor.companyLogo || "/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png",
    verified: false, // API doesn’t provide this field
    carsCount: vendor.availableCars,
    branchCount: vendor.totalBranches,
    location: vendor.mainBranchAddress,
  }));

  // ✅ Pagination logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = processedVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );
  const totalPages = Math.ceil(processedVendors.length / vendorsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t("loadingVendors")}</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{t("failedToLoadVendors")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8 flex items-center">
            <Input
              type="text"
              placeholder={t("searchVendors")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="rounded-full py-3 px-6 w-full md:w-1/2 lg:w-1/3 shadow-sm focus:ring-primary focus:border-primary"
            />
            <Button
              variant="outline"
              size="icon"
              className="-ml-10 rounded-full mx-[19px]"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="mr-2"
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Vendors = () => {
  return (
    <LanguageProvider>
      <VendorsContent />
    </LanguageProvider>
  );
};

export default Vendors;
