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

interface Booking {
  id: number;
  carName: string;
  clientName: string;
  carImage: string;
  clientId: string;
  bookingNumber: number;
  vendorName: string;
  vendorLogo: string;
  totalPrice: number;
  fromDate: string;
  toDate: string;
  bookingStatus: string;
  paymentStatus: string;
}

const staticBookingsData = {
  isSuccess: true,
  data: {
    items: [
      {
        id: 4,
        carName: "كيا سيراتو 2023",
        clientName: "عبدالرحمن سيف ssfff",
        carImage:
          "Car\\2c6d581f-239c-4498-8c04-b6529a3d8a56\\22\\df82e986-9c44-48be-bdb9-1c13153f8a24.png",
        clientId: "a2686cd3-902b-4d1d-a1aa-ec625bf418ed",
        bookingNumber: 1,
        vendorName: "GETCAR",
        vendorLogo:
          "Vendor\\2c6d581f-239c-4498-8c04-b6529a3d8a56\\2428c3dc-24f0-4153-ae7c-6ba401f8dc85.png",
        totalPrice: 550,
        fromDate: "2025-04-17T12:21:00",
        toDate: "2025-04-19T12:21:00",
        bookingStatus: "تم إرجاع السيارة",
        paymentStatus: "غير مدفوع",
      },
    ],
    totalRecords: 1,
    pageNumber: 0,
    pageSize: 0,
    totalPages: null,
  },
};

const VendorBookings = () => {
  const { t, language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

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

  // Transform static data to match expected structure of child components
  const transformBookingData = (booking: any) => {
    return {
      id: booking.id,
      booking_number: booking.bookingNumber,
      booking_status: bookingStatusMap[booking.bookingStatus] || "pending",
      customer_name: booking.clientName,
      customer_email: "", // Not available in static data
      customer_phone: "", // Not available in static data
      pickup_date: booking.fromDate,
      return_date: booking.toDate,
      pickup_location: "", // Not available in static data
      return_location: "", // Not available in static data
      total_amount: booking.totalPrice,
      total_days: Math.ceil(
        (new Date(booking.toDate).getTime() -
          new Date(booking.fromDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      daily_rate:
        booking.totalPrice /
        Math.ceil(
          (new Date(booking.toDate).getTime() -
            new Date(booking.fromDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      payment_status:
        booking.paymentStatus === "غير مدفوع"
          ? "pending"
          : booking.paymentStatus,
      special_requests: "", // Not available in static data
      cars: [
        {
          id: booking.id,
          name: booking.carName,
          images: [booking.carImage],
          brand: "", // Not available in static data
          model: "", // Not available in static data
          daily_rate:
            booking.totalPrice /
            Math.ceil(
              (new Date(booking.toDate).getTime() -
                new Date(booking.fromDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          total_amount: booking.totalPrice,
        },
      ],
    };
  };

  const bookings = useMemo(() => {
    if (!staticBookingsData.isSuccess) return [];
    return staticBookingsData.data.items.map(transformBookingData);
  }, []);

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

  const handleAction = (action: string) => {
    // Simulate action success since static data doesn't support mutations
    toast.success(
      t("actionSuccess", { action: t(action.toLowerCase().replace(" ", "")) })
    );
  };

  if (!staticBookingsData.isSuccess) {
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
      onAcceptBooking: (id: string) => handleAction("acceptBooking"),
      onRejectBooking: (id: string) => handleAction("rejectBooking"),
      onStartProgress: (id: string) => handleAction("startProgress"),
      onAcceptReturn: (id: string) => handleAction("acceptReturn"),
      isAcceptLoading: false,
      isRejectLoading: false,
      isStartLoading: false,
      isReturnLoading: false,
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

  return (
    <div className={language === "ar" ? "text-right" : "text-left"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("bookings")}
            </h2>
            <p className="text-gray-600 mt-1">
              {bookings.length} {t("totalBookings")}
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
          totalBookings={bookings.length}
          statusLabels={bookingStatusLabels}
        />

        {filteredBookings.length > 0 ? (
          renderBookingsContent()
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
