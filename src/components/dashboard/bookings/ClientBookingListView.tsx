import React, { useState } from "react";
import { format } from "date-fns";
import { RotateCcw, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types/clientBookings";
import { getStatusConfig } from "@/components/vendor/bookings/bookingUtils";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { useLanguage } from "@/contexts/LanguageContext";
import LazyImage from "@/components/ui/LazyImage";

interface ClientBookingListViewProps {
  bookings: Booking[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
  onAcceptReturnCar?: (bookingId: string) => void;
  isAccepting?: boolean;
}

const ClientBookingListView = ({
  bookings,
  onReturnCar,
  isReturning,
  onAcceptReturnCar,
  isAccepting,
}: ClientBookingListViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { t } = useLanguage();

  const canReturnCar = (status: string) => {
    return (
      status.toLowerCase() === "confirmed" ||
      status.toLowerCase() === "active" ||
      status.toLowerCase() === "in_progress" ||
      status === "InProgress"
    );
  };

  const canAcceptReturn = (status: string) => {
    return status.toLowerCase() === "return_requested";
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.bookingStatus);

        return (
          <div
            key={booking.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LazyImage
                  src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                    booking.carImage
                  }`}
                  alt={booking.carName}
                  className="h-16 w-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {booking.carName}
                  </h3>
                  <p className="text-gray-600">{booking.vendorName}</p>
                  <p className="text-sm text-gray-500">
                    #{booking.bookingNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Left: date & price */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.fromDate), "MMM dd")} –{" "}
                    {format(new Date(booking.toDate), "MMM dd")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    SAR {booking.totalPrice}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-gray-200" />

                {/* Right: status & actions */}
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={`${statusConfig.color} w-fit`}
                  >
                    {statusConfig.label}
                  </Badge>
                  <div className="flex gap-2">
                    {canReturnCar(booking.bookingStatus) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onAcceptReturnCar(booking.id.toString())}
                        disabled={isReturning}
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>{t("returnCar")}</span>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{t("invoice")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <BookingInvoiceModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default ClientBookingListView;
