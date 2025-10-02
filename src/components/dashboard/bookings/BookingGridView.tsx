import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Phone,
  RotateCcw,
  Mail,
  Car,
  Clock,
  CreditCard,
} from "lucide-react";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookingWithCar } from "@/hooks/useBookings";
import { getStatusConfig } from "@/components/vendor/bookings/bookingUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingGridViewProps {
  bookings: BookingWithCar[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
}
const BookingGridView = ({
  bookings,
  onReturnCar,
  isReturning,
}: BookingGridViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithCar | null>(
    null
  );
  const { t } = useLanguage();

  const canReturnCar = (status: string) => {
    return (
      status.toLowerCase() === "confirmed" ||
      status.toLowerCase() === "active" ||
      status.toLowerCase() === "in_progress"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.booking_status);
        const StatusIcon = statusConfig.icon;
        return (
          <Card
            key={booking.id}
            className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white"
          >
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex  gap-4 items-start">
                <div className="relative">
                  <div className="w-20 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={
                        booking.car.images?.[0] ||
                        "https://images.unsplash.com/photo-1549924231-f129b911e442"
                      }
                      alt={booking.car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}
                  ></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium">
                      {booking.car.name}
                    </span>
                    <span className="text-md">SAR {booking.total_amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full text-start w-fit uppercase">
                      {booking.total_days}{" "}
                      {booking.total_days === 1 ? t("day") : t("days")}
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusConfig.color} border-0 px-3 py-1 text-xs font-medium flex gap-1 items-center`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Booking Timeline */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-start  p-3 bg-emerald-50 rounded-lg border border-emerald-100 gap-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-medium text-emerald-700 uppercase">
                      {t("pickup")}
                    </p>
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {format(new Date(booking.pickup_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-start  p-3 bg-rose-50 rounded-lg border border-rose-100 gap-2">
                  <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-medium text-rose-700 uppercase">
                      {t("return")}
                    </p>
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {format(new Date(booking.return_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="flex flex-col gap-3 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                      {t("from")}
                    </p>
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {booking.pickup_location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 ">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                      {t("to")}
                    </p>
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {booking.return_location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor & Payment Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-slate-100 gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {booking.vendor.name}
                    </p>
                    {booking.vendor.phone && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="h-3 w-3" />
                        <span className="">{booking.vendor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 uppercase">
                  <CreditCard className="h-4 w-4 text-slate-400 mx-[6px]" />
                  <Badge
                    variant={
                      booking.payment_status === "paid"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {booking.payment_status === "paid"
                      ? t("paid")
                      : booking.payment_status}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 pt-2">
                {canReturnCar(booking.booking_status) && (
                  <Button
                    className=" flex-1"
                    size="sm"
                    onClick={() => onReturnCar(booking.id)}
                    disabled={isReturning}
                  >
                    <RotateCcw className="h-4 w-4 me-2" />
                    {t("returnCar")}
                  </Button>
                )}
                <Button
                  className=" flex-1"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <Mail className="h-4 w-4 me-2" />
                  {t("invoice")}
                </Button>
              </div>
            </CardContent>
          </Card>
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
export default BookingGridView;
