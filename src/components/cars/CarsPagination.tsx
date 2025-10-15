import React, { useCallback, useMemo, memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarsPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

// Memoize the component to prevent unnecessary re-renders
const CarsPagination = memo(
  ({ currentPage, totalPages, setCurrentPage }: CarsPaginationProps) => {
    const { t, language } = useLanguage();
    const isRTL = language === "ar";

    // Memoize page numbers to avoid recomputation
    const pageNumbers = useMemo(() => {
      const pages: (number | "ellipsis")[] = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("ellipsis");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }

      console.log("Generated page numbers:", pages);
      return pages;
    }, [currentPage, totalPages]);

    // Memoized click handlers to ensure stability
    const handlePrevious = useCallback(() => {
      if (currentPage > 1) {
        console.log("Clicked previous, going to page:", currentPage - 1);
        setCurrentPage(currentPage - 1);
      }
    }, [currentPage, setCurrentPage]);

    const handleNext = useCallback(() => {
      if (currentPage < totalPages) {
        console.log("Clicked next, going to page:", currentPage + 1);
        setCurrentPage(currentPage + 1);
      }
    }, [currentPage, totalPages, setCurrentPage]);

    const handlePageClick = useCallback(
      (page: number) => {
        if (page !== currentPage) {
          console.log(`Clicked page: ${page}`);
          setCurrentPage(page);
        }
      },
      [currentPage, setCurrentPage]
    );

    if (totalPages <= 1) return null;

    console.log("CarsPagination rendered with currentPage:", currentPage);

    return (
      <div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        dir={isRTL ? "rtl" : "ltr"}
        role="navigation"
        aria-label={t("paginationNavigation")}
      >
        <Pagination className="w-full">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                aria-label={t("previousPage")}
              >
                {t("previous")}
              </PaginationPrevious>
            </PaginationItem>

            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis aria-label={t("morePages")} />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageClick(page)}
                    isActive={page === currentPage}
                    className={
                      page === currentPage
                        ? "bg-primary text-white"
                        : "cursor-pointer"
                    }
                    aria-current={page === currentPage ? "page" : undefined}
                    aria-label={t("pageNumber", { number: page })}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                aria-label={t("nextPage")}
              >
                {t("next")}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
);

// Add display name for better debugging in React DevTools
CarsPagination.displayName = "CarsPagination";

export default CarsPagination;
