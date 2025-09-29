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

// Internal app statuses (English enums)
type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "in_progress"
  | "return_requested"
  | "completed"
  | "cancelled";

// Mapping API Arabic status → Internal status
const bookingStatusMap: Record<string, BookingStatus> = {
  "قيد الاجراء": "in_progress",
  "تم إرجاع السيارة": "completed",
  ملغي: "cancelled",
  مؤكد: "confirmed",
  نشط: "active",
  "قيد الانتظار": "pending",
  "طلب استرجاع": "return_requested",
};

// Reverse mapping Internal status → Arabic label (for UI display)
const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  active: "نشط",
  in_progress: "قيد الاجراء",
  return_requested: "طلب استرجاع",
  completed: "تم إرجاع السيارة",
  cancelled: "ملغي",
};

const VendorBookings = ({
  vendorId = "default-vendor-id",
}: {
  vendorId?: string;
}) => {
  const { t, language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // Fixed page size, adjustable as needed

  // Set default view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("table");
      } else if (window.innerWidth < 1024) {
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch bookings using React Query
  const { data, isLoading, isError } = useGetAllBookings({
    pageNumber,
    pageSize,
  });

  const acceptReturnMutation = useAcceptReturnCarBooking();

  // Transform API data to match expected structure of child components
  const transformBookingData = (booking: any) => {
    const totalDays = Math.ceil(
      (new Date(booking.toDate).getTime() -
        new Date(booking.fromDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return {
      id: booking.id,
      booking_number: booking.bookingNumber,
      booking_status: bookingStatusMap[booking.bookingStatus] || "pending",
      customer_name: booking.clientName || t("unknownCustomer"),
      customer_email: "", // Not available in API response
      customer_phone: "", // Not available in API response
      pickup_date: booking.fromDate,
      return_date: booking.toDate,
      pickup_location: "", // Not available in API response
      return_location: "", // Not available in API response
      total_amount: booking.totalPrice || 0,
      total_days: totalDays || 1,
      daily_rate: booking.totalPrice / (totalDays || 1),
      payment_status: booking.paymentStatus || "pending",
      special_requests: "", // Not available in API response
      cars: [
        {
          id: booking.id,
          name: booking.carName || t("unknownCar"),
          images: booking.carImage
            ? [`${import.meta.env.VITE_UPLOADS_BASE_URL}${booking.carImage}`]
            : [],
          brand: "", // Not available in API response
          model: "", // Not available in API response
          daily_rate: booking.totalPrice / (totalDays || 1),
          total_amount: booking.totalPrice || 0,
        },
      ],
    };
  };

  const bookings = useMemo(() => {
    if (!data?.data?.items) return [];
    return data.data.items.map(transformBookingData);
  }, [data]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        statusFilter === "all" || booking.booking_status === statusFilter
    );
  }, [bookings, statusFilter]);

  const getStatusCounts = () => {
    return bookings.reduce((acc, booking) => {
      const status = booking.booking_status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  const handleAcceptReturn = (bookingId: string) => {
    acceptReturnMutation.mutate(bookingId, {
      onSuccess: () => {
        toast.success(t("actionSuccess"));
      },
      onError: (error) => {
        toast.error(t("actionError"));
      },
    });
  };

  const handleAction = (action: string, bookingId: string) => {
    // Placeholder for other actions (accept, reject, start progress)
    toast.success(t("actionSuccess"));
  };

  if (isLoading) {
    return <span content={t("loading")} />;
  }

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

  const renderBookingsContent = () => {
    const commonProps = {
      bookings: filteredBookings,
      onAcceptBooking: (id: string) => handleAction("acceptBooking", id),
      onRejectBooking: (id: string) => handleAction("rejectBooking", id),
      onStartProgress: (id: string) => handleAction("startProgress", id),
      onAcceptReturn: handleAcceptReturn,
      isAcceptLoading: false, // Add mutation hooks for these if needed
      isRejectLoading: false,
      isStartLoading: false,
      isReturnLoading: acceptReturnMutation.isPending,
    };

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

  const totalPages = data?.data?.totalPages || 1;
  const currentPage = data?.data?.pageNumber || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
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
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="start-ellipsis" />);
      }
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
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }
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
          statusCounts={statusCounts}
          totalBookings={data?.data?.totalRecords || 0}
          statusLabels={bookingStatusLabels}
        />

        {filteredBookings.length > 0 ? (
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
        ) : (
          <EmptyBookingsState
            isFiltered={statusFilter !== "all"}
            statusFilter={statusFilter}
          />
        )}
      </div>
    </div>
  );
};

export default VendorBookings;
