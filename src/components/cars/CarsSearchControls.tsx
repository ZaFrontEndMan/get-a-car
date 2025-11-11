import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Loader2,
  Search,
  Bug,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

const CarsSearchControls: React.FC<CarsSearchControlsProps> = ({
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
}) => {
  const { t } = useLanguage();

  // Simple ellipsis logic - only show ... when totalPages > 4
  const showEllipsis = totalPages > 4;

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      {/* Debug Toggle - Only in development */}

      {/* Search and View Mode Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <Input
            type="text"
            placeholder={t("searchCars") || "Search cars..."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className={`pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              isSearching ? "bg-blue-50 border-blue-200" : "bg-gray-50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("grid");
            }}
            disabled={isLoading}
            className="h-10 px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("list");
            }}
            disabled={isLoading}
            className="h-10 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Info and Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Results Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className="text-sm">
            {filteredCarsLength} {t("carsFound") || "cars found"}
          </Badge>
          {totalPages > 0 && (
            <span className="text-sm text-gray-600">
              {t("page")} {currentPage} {t("of")} {totalPages}
            </span>
          )}
        </div>

        {/* Simple Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-10 px-4 min-w-[100px]"
            >
              {t("previous") || "Previous"}
            </Button>

            {/* Pages - Simplified logic */}
            <div className="flex items-center gap-1">
              {showEllipsis && currentPage > 4 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageClick(1)}
                    className="h-10 w-10"
                  >
                    1
                  </Button>
                  <span className="px-1 text-gray-400">...</span>
                </>
              )}

              {/* Current page range - simple: show current page and one on each side */}
              {Array.from({ length: Math.min(5, totalPages) })
                .map((_, i) => currentPage - 2 + i)
                .filter((page) => page >= 1 && page <= totalPages)
                .map((page, index) => (
                  <Button
                    key={index}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className={`h-10 px-3 min-w-[44px] ${
                      page === currentPage
                        ? "bg-primary text-white"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}

              {showEllipsis && currentPage < totalPages - 3 && (
                <>
                  <span className="px-1 text-gray-400">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageClick(totalPages)}
                    className="h-10 w-10"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-10 px-4 min-w-[100px]"
            >
              {t("next") || "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsSearchControls;
