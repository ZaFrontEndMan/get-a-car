import React, { useState } from "react";
import { useBookingViewMode } from "../../hooks/useBookingViewMode";
import { useLanguage } from "../../contexts/LanguageContext";
import BookingsHeader from "./bookings/BookingsHeader";
import BookingsLoadingState from "./bookings/BookingsLoadingState";
import BookingsEmptyState from "./bookings/BookingsEmptyState";
import ClientBookingGridView from "./bookings/ClientBookingGridView";
import ClientBookingListView from "./bookings/ClientBookingListView";
import ClientBookingTableView from "./bookings/ClientBookingTableView";
import BookingStatusFilter from "@/components/vendor/bookings/BookingStatusFilter";
import BookingsPagination from "./bookings/BookingsPagination";
import { useClientBookings } from "@/hooks/client/useClientBookings";
import { Booking } from "@/types/clientBookings";
import { APISupportedBookingStatus } from "../vendor/bookings/bookingUtils";

const ITEMS_PER_PAGE = 12;

const BookingsList: React.FC = () => {
  const { viewMode, setViewMode } = useBookingViewMode();
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] =
    useState<APISupportedBookingStatus>(undefined); // undefined = "all"
  const [currentPage, setCurrentPage] = useState(1);

  const { useGetAllBookings, useAcceptReturnCar } = useClientBookings();

  const { data, isLoading, isError, isFetching } = useGetAllBookings({
    pageNumber: currentPage,
    pageSize: ITEMS_PER_PAGE,
    bookingStatus: statusFilter,
  });

  const acceptReturnMutation = useAcceptReturnCar();

  const bookings: Booking[] = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalItems = data?.data?.totalRecords || 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAcceptReturn = (bookingId: string) => {
    acceptReturnMutation.mutate({ bookingId });
  };

  const commonProps = {
    bookings,
    onReturnCar: () => {},
    isReturning: false,
    onAcceptReturnCar: handleAcceptReturn,
    isAccepting: acceptReturnMutation.isPending,
  };

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const currentViewMode = isMobile ? "grid" : viewMode;

  let bookingsContent: React.ReactNode = null;
  if (bookings.length > 0) {
    switch (currentViewMode) {
      case "grid":
        bookingsContent = <ClientBookingGridView {...commonProps} />;
        break;
      case "list":
        bookingsContent = <ClientBookingListView {...commonProps} />;
        break;
      case "table":
        bookingsContent = <ClientBookingTableView {...commonProps} />;
        break;
      default:
        bookingsContent = <ClientBookingGridView {...commonProps} />;
    }
  }

  return (
    <div
      className={language === "ar" ? "text-right" : "text-left"}
      style={{ position: "relative" }}
    >
      <BookingsHeader
        bookingsCount={totalItems}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mb-6">
        <BookingStatusFilter
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          apiCounts={data?.data || {}}
        />
      </div>

      {/* Always render loading and empty states in the background */}
      <div className="relative min-h-[6rem]">
        {/* Loading always displayed */}
        {isLoading || isFetching ? (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <BookingsLoadingState />
          </div>
        ) : null}

        {/* Empty displayed if no bookings and not loading */}
        {!isLoading && !isFetching && bookings.length === 0 ? (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <BookingsEmptyState />
          </div>
        ) : null}

        {/* Main content (always rendered, can be styled to be on top) */}
        <div
          className={
            isLoading || isFetching || bookings.length === 0 ? "opacity-60" : ""
          }
        >
          {bookingsContent}
        </div>
      </div>

      {/* Pagination rendered always, but disabled during loading/fetching */}
      <BookingsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isFetching}
      />
    </div>
  );
};

export default BookingsList;
