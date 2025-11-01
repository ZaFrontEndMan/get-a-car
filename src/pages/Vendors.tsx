import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import VendorCard from "../components/VendorCard";
import JoinUsCard from "../components/JoinUsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useWebsiteVendors } from "@/hooks/website/useWebsiteVendors";
import { motion } from "framer-motion";

const VendorsContent = () => {
  const { t } = useLanguage();
  const { data, isLoading, error } = useWebsiteVendors();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 8; // Changed to 8 to account for join us card on last page

  const vendors = data?.data.vendorsOwners ?? [];

  const filteredVendors = vendors.filter((vendor) =>
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const processedVendors = filteredVendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.companyName,
    rating: 0,
    image:
      vendor.companyLogo || "/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png",
    verified: false,
    carsCount: vendor.availableCars,
    branchCount: vendor.totalBranches,
    location: vendor.mainBranchAddress,
  }));

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{t("failedToLoadVendors")}</p>
      </div>
    );
  }

  // Determine if we should show join us card on this page
  const shouldShowJoinUs =
    currentPage === totalPages ||
    (currentVendors.length < vendorsPerPage && currentPage === totalPages);
  const vendorsToShow = shouldShowJoinUs
    ? currentVendors
    : currentVendors.slice(0, vendorsPerPage - 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <motion.div
            className="mb-8 flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>

          {/* Vendors Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {vendorsToShow.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
            {shouldShowJoinUs && <JoinUsCard />}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex justify-center mt-8 gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("previous")}
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                )
              )}
              <motion.button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("next")}
              </motion.button>
            </motion.div>
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
