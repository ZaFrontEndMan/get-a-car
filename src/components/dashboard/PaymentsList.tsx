import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useGetAllInvoices } from "@/hooks/client/useInvoices";
import {
  CreditCard,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const PaymentsList: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllInvoices({
    pageNumber: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const invoices = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalItems = data?.data?.totalRecords || 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noInvoices")}
        </h3>
        <p className="text-gray-600">{t("noInvoicesMessage")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("payments")} ({totalItems})
        </h1>
        <div className="text-sm text-gray-600">
          {t("page")} {currentPage} {t("of")} {totalPages}
        </div>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.invoiceId}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            {/* First Row – Info & Status */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-800">
                <span>
                  <span className="font-bold">
                    {t("vendorName") || "Vendor Name"}:
                  </span>{" "}
                  {invoice.vendorName || "—"}
                </span>
                <span>
                  <span className="font-bold">
                    {t("totalAmount") || "Total Price"}:
                  </span>{" "}
                  {t("currency")} {invoice.totalPrice?.toFixed?.(2) ?? "—"}
                </span>
                <span>
                  <span className="font-bold">
                    {t("paidAmount") || "Paid Amount"}:
                  </span>{" "}
                  {t("currency")} {invoice.pricePaid?.toFixed?.(2) ?? "0.00"}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                  invoice.status
                )}`}
              >
                {t(invoice.status.toLowerCase())}
              </span>
            </div>
            {/* Second Row – Dates */}
            <div className="flex flex-wrap gap-x-10 gap-y-1 text-gray-600 text-xs font-medium">
              <span>
                <span className="font-bold">
                  {t("pickupDate") || "Pickup Date"}:
                </span>{" "}
                {invoice.fromDate
                  ? format(new Date(invoice.fromDate), "MMM dd, yyyy")
                  : "—"}
              </span>
              <span>
                <span className="font-bold">
                  {t("returnDate") || "Return Date"}:
                </span>{" "}
                {invoice.toDate
                  ? format(new Date(invoice.toDate), "MMM dd, yyyy")
                  : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 ? (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1 && !isFetching) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1 || isFetching
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isFetching) {
                        handlePageChange(page as number);
                      }
                    }}
                    isActive={currentPage === page}
                    className={
                      isFetching
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages && !isFetching) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage === totalPages || isFetching
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
};

export default PaymentsList;
