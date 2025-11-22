import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingStatusFilter from "./bookings/BookingStatusFilter";
import VendorBookingViewToggle from "./bookings/VendorBookingViewToggle";
import VendorBookingGridView from "./bookings/VendorBookingGridView";
import VendorBookingListView from "./bookings/VendorBookingListView";
import VendorBookingTableView from "./bookings/VendorBookingTableView";
import EmptyBookingsState from "./bookings/EmptyBookingsState";
import { Car } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  useGetAllBookings,
  useAcceptReturnCarBooking,
} from "@/hooks/vendor/useVendorBooking";

// API status type (or undefined for "all")
type APISupportedBookingStatus = 1 | 2 | 3 | 4 | 5 | 6 | undefined;

// In case your backend sometimes returns Arabic text:
const arabicToApiStatus: Record<string, APISupportedBookingStatus> = {
  منتظر: 1,
  "تم إرجاع السيارة": 2,

  "تم الالغاء": 3,
  "قيد الاجراء": 4,
  "طلب استرجاع": 5,
  العروض: 6,
};

const VendorBookings = () => {
  const { t, language } = useLanguage();
  const [statusFilter, setStatusFilter] =
    useState<APISupportedBookingStatus>(undefined); // undefined = "all"
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);

  // Set view mode based on screen size once on mount and on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setViewMode("table");
      else if (window.innerWidth < 1024) setViewMode("list");
      else setViewMode("grid");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API bookings query (statusFilter sent as number or undefined)
  const { data, isLoading, isError } = useGetAllBookings({
    pageNumber,
    pageSize,
    bookingStatus: statusFilter,
  });
  const acceptReturnMutation = useAcceptReturnCarBooking();

  // Transform API bookings for grid/list/table views
  const bookings = useMemo(() => {
    if (!data?.data?.items) return [];
    return data.data.items.map((booking: any) => {
      const totalDays =
        Math.ceil(
          (new Date(booking.toDate).getTime() -
            new Date(booking.fromDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) || 1;
      return {
        id: booking.id,
        booking_number: booking.bookingNumber,
        booking_status:
          typeof booking.bookingStatus === "number"
            ? booking.bookingStatus
            : arabicToApiStatus[booking.bookingStatus] || 1,
        customer_name: booking.clientName || t("unknownCustomer"),
        customer_email: booking.clientEmail || "",
        customer_phone: booking.clientPhone || "",
        pickup_date: booking.fromDate,
        return_date: booking.toDate,
        pickup_location: booking?.pickUpLocationName,
        return_location: booking?.dropoffLocationName,
        total_amount: booking.totalPrice || 0,
        total_days: totalDays,
        daily_rate: booking.totalPrice / totalDays,
        payment_status: booking.paymentStatus || "pending",
        special_requests: "",
        cars: [
          {
            id: booking.id,
            name: booking.carName || t("unknownCar"),
            images: booking.carImage
              ? [`${import.meta.env.VITE_UPLOADS_BASE_URL}${booking.carImage}`]
              : [],
            brand: "",
            model: "",
            daily_rate: booking.totalPrice / totalDays,
            total_amount: booking.totalPrice || 0,
          },
        ],
      };
    });
  }, [data, t]);

  // Action handlers (unchanged)
  const handleAcceptReturn = (bookingId: string) => {
    acceptReturnMutation.mutate(bookingId, {
      onSuccess: () => toast.success(t("actionSuccess")),
      onError: () => toast.error(t("actionError")),
    });
  };
  const handleAction = (action: string, bookingId: string) => {
    toast.success(t("actionSuccess"));
  };

  // Common props for all view components
  const commonProps = {
    bookings,
    onAcceptBooking: (id: string) => handleAction("acceptBooking", id),
    onRejectBooking: (id: string) => handleAction("rejectBooking", id),
    onStartProgress: (id: string) => handleAction("startProgress", id),
    onAcceptReturn: handleAcceptReturn,
    isAcceptLoading: false,
    isRejectLoading: false,
    isStartLoading: false,
    isReturnLoading: acceptReturnMutation.isPending,
  };

  // Booking content renderer
  const renderBookingsContent = () => {
    switch (viewMode) {
      case "grid":
        return <VendorBookingGridView {...commonProps} />;
      case "list":
        return <VendorBookingListView {...commonProps} />;
      case "table":
        return <VendorBookingTableView {...commonProps} />;
      default:
        return <VendorBookingGridView {...commonProps} />;
    }
  };

  // Pagination builder
  const totalPages = data?.data?.totalPages || 1;
  const currentPage = data?.data?.pageNumber || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setPageNumber(page);
  };
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2)
        items.push(<PaginationEllipsis key="start-ellipsis" />);
    }
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  if (isError) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("errorLoadingBookings")}
        </h3>
        <p className="text-gray-500">{t("pleaseTryAgain")}</p>
      </div>
    );
  }

  return (
    <div className={language === "ar" ? "text-right" : "text-left"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("bookings")}
            </h2>
            <p className="text-gray-600 mt-1">
              {data?.data?.totalRecords || 0} {t("totalBookings")}
            </p>
          </div>
          <VendorBookingViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <BookingStatusFilter
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          apiCounts={data?.data || {}}
        />

        {/* Show bookings or empty state */}
        {bookings.length === 0 && !isLoading ? (
          <EmptyBookingsState
            isFiltered={statusFilter !== undefined}
            statusFilter={String(statusFilter)}
          />
        ) : isLoading ? (
          <>
            {" "}
            <div className="flex flex-col items-center py-16 gap-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="text-primary text-lg">{t("loading")}</span>
            </div>{" "}
          </>
        ) : (
          <>
            {renderBookingsContent()}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                  {renderPaginationItems()}
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorBookings;
