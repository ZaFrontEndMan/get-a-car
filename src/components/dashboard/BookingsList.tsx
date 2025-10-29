import React, { useState } from "react";
import { useBookingViewMode } from "../../hooks/useBookingViewMode";
import { useLanguage } from "../../contexts/LanguageContext";
import BookingsHeader from "./bookings/BookingsHeader";
import BookingsLoadingState from "./bookings/BookingsLoadingState";
import BookingsEmptyState from "./bookings/BookingsEmptyState";
import BookingsFilteredEmptyState from "./bookings/BookingsFilteredEmptyState";
import ClientBookingGridView from "./bookings/ClientBookingGridView";
import ClientBookingListView from "./bookings/ClientBookingListView";
import ClientBookingTableView from "./bookings/ClientBookingTableView";
import BookingStatusFilter from "@/components/vendor/bookings/BookingStatusFilter";
import BookingsPagination from "./bookings/BookingsPagination";
import { getStatusCounts } from "@/utils/bookingUtils";
import { useClientBookings } from "@/hooks/client/useClientBookings";
import { Booking } from "@/types/clientBookings";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "InProgress"
  | "return_requested"
  | "completed"
  | "cancelled";

const bookingStatusMap: Record<string, BookingStatus> = {
  "قيد الاجراء": "InProgress",
  "تم إرجاع السيارة": "completed",
  ملغي: "cancelled",
  مؤكد: "confirmed",
  نشط: "active",
  "قيد الانتظار": "pending",
  "طلب استرجاع": "return_requested",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  active: "نشط",
  InProgress: "قيد الاجراء",
  return_requested: "طلب استرجاع",
  completed: "تم إرجاع السيارة",
  cancelled: "ملغي",
};

const ITEMS_PER_PAGE = 12;

const BookingsList: React.FC = () => {
  const { viewMode, setViewMode } = useBookingViewMode();
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { useGetAllBookings, useAcceptReturnCar } = useClientBookings();

  const { data, isLoading, isError, isFetching } = useGetAllBookings({
    pageNumber: currentPage,
    pageSize: ITEMS_PER_PAGE,
    bookingStatus: statusFilter === "all" ? undefined : statusFilter,
  });

  const acceptReturnMutation = useAcceptReturnCar();

  const bookings: Booking[] =
    data?.data?.items?.map((item: any) => ({
      ...item,
      bookingStatus: bookingStatusMap[item.bookingStatus] || "pending",
    })) || [];

  const totalPages = data?.data?.totalPages || 0;
  const totalItems = data?.data?.totalCount || 0;

  const statusCounts = getStatusCounts(bookings);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStatusFilterChange = (status: BookingStatus | "all") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAcceptReturn = (bookingId: string) => {
    acceptReturnMutation.mutate({ bookingId });
  };

  if (isLoading) {
    return <BookingsLoadingState />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          {t("errorLoadingBookings")}. {t("pleaseTryAgainLater")}
        </p>
      </div>
    );
  }

  if (!bookings.length && statusFilter === "all") {
    return <BookingsEmptyState />;
  }

  const renderContent = () => {
    const commonProps = {
      bookings,
      onReturnCar: () => {
        console.log("returning");
      },
      isReturning: false,
      onAcceptReturnCar: handleAcceptReturn,
      isAccepting: acceptReturnMutation.isPending,
    };

    const isMobile = window.innerWidth < 768;
    const currentViewMode = isMobile ? "grid" : viewMode;

    switch (currentViewMode) {
      case "grid":
        return <ClientBookingGridView {...commonProps} />;
      case "list":
        return <ClientBookingListView {...commonProps} />;
      case "table":
        return <ClientBookingTableView {...commonProps} />;
      default:
        return <ClientBookingGridView {...commonProps} />;
    }
  };

  return (
    <div className={language === "ar" ? "text-right" : "text-left"}>
      <BookingsHeader
        bookingsCount={totalItems}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mb-6">
        <BookingStatusFilter
          statusFilter={statusFilter}
          onFilterChange={handleStatusFilterChange}
          statusCounts={statusCounts}
          totalBookings={totalItems}
          statusLabels={bookingStatusLabels}
        />
      </div>

      {bookings.length > 0 ? (
        <>
          {renderContent()}

          <BookingsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isFetching}
          />
        </>
      ) : (
        <BookingsFilteredEmptyState statusFilter={statusFilter} />
      )}
    </div>
  );
};

export default BookingsList;
