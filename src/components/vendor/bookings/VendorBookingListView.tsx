import React from "react";
import { Calendar, Car, User, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface VendorBookingListViewProps {
  bookings: any[];
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onStartProgress: (id: string) => void;
  onAcceptReturn: (id: string) => void;
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  isStartLoading: boolean;
  isReturnLoading: boolean;
}

const VendorBookingListView = ({
  bookings,
  onAcceptBooking,
  onRejectBooking,
  onStartProgress,
  onAcceptReturn,
  isAcceptLoading,
  isRejectLoading,
  isStartLoading,
  isReturnLoading,
}: VendorBookingListViewProps) => {
  const { t } = useLanguage();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          label: t("statusPending"),
        };
      case "confirmed":
        return {
          color: "bg-blue-100 text-blue-800",
          label: t("statusConfirmed"),
        };
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          label: t("statusActive"),
        };
      case "in_progress":
        return {
          color: "bg-purple-100 text-purple-800",
          label: t("statusInProgress"),
        };
      case "return_requested":
        return {
          color: "bg-orange-100 text-orange-800",
          label: t("statusReturnRequested"),
        };
      case "completed":
        return {
          color: "bg-gray-100 text-gray-800",
          label: t("statusCompleted"),
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          label: t("statusCancelled"),
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          label: t("statusUnknown"),
        };
    }
  };

  const getActionButtons = (booking: any) => {
    const status = booking.booking_status;

    switch (status) {
      case "pending":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onAcceptBooking(booking.id)}
              disabled={isAcceptLoading}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {t("acceptBooking")}
            </Button>
            <Button
              onClick={() => onRejectBooking(booking.id)}
              disabled={isRejectLoading}
              variant="destructive"
              size="sm"
              className="flex-1 font-medium"
            >
              {t("rejectBooking")}
            </Button>
          </div>
        );
      case "active":
        return (
          <Button
            onClick={() => onStartProgress(booking.id)}
            disabled={isStartLoading}
            size="sm"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {t("startTrip")}
          </Button>
        );
      case "return_requested":
        return (
          <Button
            onClick={() => onAcceptReturn(booking.id)}
            disabled={isReturnLoading}
            size="sm"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-medium"
          >
            {t("acceptReturn")}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.booking_status);
        return (
          <div
            key={booking.id}
            className="bg-white rounded-lg border shadow-sm p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-sm text-gray-600 font-medium">
                  #{booking.booking_number}
                </div>
                <Badge
                  variant="default"
                  className={`${statusConfig.color} text-xs sm:text-sm font-medium truncate max-w-[150px]`}
                >
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {new Date(booking.pickup_date).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {booking.customer_name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">
                    {booking.customer_email}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {booking.cars?.[0]?.name || t("unknownCar")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    {booking.cars?.[0]?.brand || t("unknownBrand")}{" "}
                    {booking.cars?.[0]?.model || t("unknownModel")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900">
                    {new Date(booking.pickup_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {t("to")}{" "}
                    {new Date(booking.return_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900">
                    {t("currency")}{" "}
                    {booking.total_amount?.toLocaleString() || "0"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {t("totalAmount")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900 break-words">
                    {booking.pickup_location || t("unknownLocation")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">
                    {t("returnLocation")}:{" "}
                    {booking.return_location || t("unknownLocation")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 gap-4">
              {getActionButtons(booking)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VendorBookingListView;
