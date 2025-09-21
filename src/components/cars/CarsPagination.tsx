import React from "react";
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

const CarsPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: CarsPaginationProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500 mb-4 text-center">
        {isRTL ? "استخدم الأسهم للتنقل • Home للصفحة الأولى • End للصفحة الأخيرة" : "Use arrow keys to navigate • Home for first page • End for last page"}
      </div>
      
      <Pagination className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}>
        <PaginationContent className={isRTL ? "flex-row-reverse" : ""}>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              {t("previous")}
            </PaginationPrevious>
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isCurrentPage = pageNum === currentPage;

            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }}
                    isActive={isCurrentPage}
                    className={isCurrentPage ? "bg-primary text-white" : ""}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              pageNum === currentPage - 2 ||
              pageNum === currentPage + 2
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              {t("next")}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CarsPagination;
