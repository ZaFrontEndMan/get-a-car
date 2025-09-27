import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingViewToggle from "./BookingViewToggle";

interface BookingsHeaderProps {
  bookingsCount: number;
  viewMode: "grid" | "list" | "table";
  onViewModeChange: (mode: "grid" | "list" | "table") => void;
}

const BookingsHeader = ({
  bookingsCount,
  viewMode,
  onViewModeChange,
}: BookingsHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("myBookings")}
        </h1>
        <p className="text-gray-600">
          {bookingsCount === 1 ? t("booking") : t("bookings")} {bookingsCount} 
        </p>
      </div>

      {/* Hide view toggle on mobile since we force grid view */}
      <div className="hidden md:block">
        <BookingViewToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
};

export default BookingsHeader;
