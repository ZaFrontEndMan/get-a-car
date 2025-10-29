import React from "react";
import {
  Search,
  Grid3X3,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarsSearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filteredCarsLength: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isSearching?: boolean;
  isLoading?: boolean;
}

const CarsSearchControls = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filteredCarsLength,
  currentPage,
  totalPages,
  onPageChange,
  isSearching = false,
  isLoading = false,
}: CarsSearchControlsProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

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
            } ${isSearching ? "border-primary bg-blue-50" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
            disabled={isLoading}
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
            disabled={isLoading}
            aria-label="Grid view"
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
            disabled={isLoading}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              {filteredCarsLength} {t("carsFound") || "cars found"}
            </span>
            <span>
              {t("page") || "Page"} {currentPage} {t("of")} {totalPages}
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-1 flex-wrap">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={isRTL ? "Next page" : "Previous page"}
              >
                {isRTL ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-2 text-gray-400">
                    {page}
                  </span>
                )
              )}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={isRTL ? "Previous page" : "Next page"}
              >
                {isRTL ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsSearchControls;
