import React from "react";
import { Search, Grid3X3, List, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarsSearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filteredCarsLength: number;
  currentPage: number;
  totalPages: number;
  isSearching?: boolean;
}

const CarsSearchControls = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filteredCarsLength,
  currentPage,
  totalPages,
  isSearching = false,
}: CarsSearchControlsProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          {isSearching ? (
            <Loader2
              className={`absolute top-1/2 transform -translate-y-1/2 text-primary h-5 w-5 animate-spin ${
                isRTL ? "right-4" : "left-4"
              }`}
            />
          ) : (
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 ${
                isRTL ? "right-4" : "left-4"
              }`}
            />
          )}
          <input
            type="text"
            placeholder={t("searchCars") || t("search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
            } py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all ${
              isRTL ? "text-right" : "text-left"
            } ${isSearching ? 'border-primary bg-blue-50' : ''}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            {filteredCarsLength} {t("carsFound") || "cars found"}
          </span>
          <span>
            {t("page") || "Page"} {currentPage} {t("of")} {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{t("sortBy") || "Sort by"}:</span>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
            <option>{t("highestDiscount") || "Highest Discount"}</option>
            <option>{t("newestFirst") || "Newest First"}</option>
            <option>{t("expiringSoon") || "Expiring Soon"}</option>
            <option>{t("mostPopular") || "Most Popular"}</option>
            <option>{t("priceLowToHigh") || "Price: Low to High"}</option>
            <option>{t("priceHighToLow") || "Price: High to Low"}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarsSearchControls;
