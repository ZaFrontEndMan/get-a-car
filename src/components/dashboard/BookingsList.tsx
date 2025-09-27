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
import { getStatusCounts } from "@/utils/bookingUtils";
import { useClientBookings } from "@/hooks/client/useClientBookings";
import { Booking } from "@/types/clientBookings";

// Internal app statuses (English enums)
type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "InProgress"
  | "return_requested"
  | "completed"
  | "cancelled";

// Mapping API Arabic status → Internal status
const bookingStatusMap: Record<string, BookingStatus> = {
  "قيد الاجراء": "InProgress",
  "تم إرجاع السيارة": "completed",
  ملغي: "cancelled",
  مؤكد: "confirmed",
  نشط: "active",
  "قيد الانتظار": "pending",
  "طلب استرجاع": "return_requested",
};

// Reverse mapping Internal status → Arabic label (for UI display)
export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  active: "نشط",
  InProgress: "قيد الاجراء",
  return_requested: "طلب استرجاع",
  completed: "تم إرجاع السيارة",
  cancelled: "ملغي",
};

const BookingsList: React.FC = () => {
  const { viewMode, setViewMode } = useBookingViewMode();
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );

  // Fetch bookings
  const { useGetAllBookings, useAcceptReturnCar } = useClientBookings();
  const { data, isLoading, isError } = useGetAllBookings();
  const acceptReturnMutation = useAcceptReturnCar();

  // Normalize API data → internal statuses
  const bookings: Booking[] =
    data?.data?.items?.map((item: any) => ({
      ...item,
      bookingStatus: bookingStatusMap[item.bookingStatus] || "pending",
    })) || [];

  const filteredBookings = bookings.filter(
    (booking) =>
      statusFilter === "all" || booking.bookingStatus === statusFilter
  );

  const statusCounts = getStatusCounts(bookings);

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

  if (!bookings.length) {
    return <BookingsEmptyState />;
  }

  const handleAcceptReturn = (bookingId: string) => {
    acceptReturnMutation.mutate({ bookingId });
  };

  const renderContent = () => {
    const commonProps = {
      bookings: filteredBookings,
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
        bookingsCount={bookings.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mb-6">
        <BookingStatusFilter
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          totalBookings={bookings.length}
          statusLabels={bookingStatusLabels}
        />
      </div>

      {renderContent()}

      {filteredBookings.length === 0 && statusFilter !== "all" && (
        <BookingsFilteredEmptyState statusFilter={statusFilter} />
      )}
    </div>
  );
};

export default BookingsList;
