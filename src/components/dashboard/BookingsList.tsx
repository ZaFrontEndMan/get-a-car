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

type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "InProgress"
  | "return_requested"
  | "completed"
  | "cancelled";

const BookingsList: React.FC = () => {
  const { viewMode, setViewMode } = useBookingViewMode();
  const { language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );

  // Fetch bookings with your hook
  const { useGetAllBookings } = useClientBookings();
  const { data, isLoading, isError } = useGetAllBookings();

  // Extract bookings from API response
  const bookings: Booking[] = data?.data?.items || [];

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
          Error loading bookings. Please try again later.
        </p>
      </div>
    );
  }

  if (!bookings.length) {
    return <BookingsEmptyState />;
  }

  const renderContent = () => {
    const commonProps = {
      bookings: filteredBookings,
      onReturnCar: () => {
        console.log("returning");
      },
      isReturning: false,
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
