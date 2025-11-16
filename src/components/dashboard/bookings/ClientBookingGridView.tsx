import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  RotateCcw,
  Mail,
  CreditCard,
  CheckCircle,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Booking } from "@/types/clientBookings";
import { getStatusConfig } from "@/components/vendor/bookings/bookingUtils";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { useLanguage } from "@/contexts/LanguageContext";
import RatingDialog from "./RatingDialog";

interface ClientBookingGridViewProps {
  bookings: Booking[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
  onAcceptReturnCar?: (bookingId: string) => void;
  onFavourite?: () => void;
  isAccepting?: boolean;
}

const ClientBookingGridView = ({
  bookings,
  isReturning,
  onAcceptReturnCar,
  onFavourite,
}: ClientBookingGridViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { t } = useLanguage();
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [ratingBookingId, setRatingBookingId] = useState<
    string | number | null
  >(null);

  const handleOpenRating = (bookingId: string | number) => {
    setRatingBookingId(bookingId);
    setOpenRatingDialog(true);
  };
  const handleCloseRating = () => {
    setOpenRatingDialog(false);
    setRatingBookingId(null);
  };
  const canAcceptReturn = (status: string) => {
    const key = getStatusConfig(status);
    return (
      key.label === "قيد الاجراء" ||
      key.label.toLowerCase() === "inprogress" ||
      key.label.toLowerCase() === "in progress"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.bookingStatus);
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={booking.id}
            className="group hover:shadow-md border-0 shadow bg-white"
          >
            <CardHeader className="py-2 px-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex gap-3 items-start">
                <div className="relative">
                  <div className="w-14 h-12 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        booking.carImage
                      }`}
                      alt={booking.carName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}
                  ></div>
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-col gap-0 min-w-0">
                    <span className="text-sm font-medium line-clamp-1">
                      {booking.carName}
                    </span>
                    <span className="text-xs text-slate-700 font-normal">
                      SAR {booking.totalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full uppercase font-normal">
                      {Math.ceil(
                        (new Date(booking.toDate).getTime() -
                          new Date(booking.fromDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      {Math.ceil(
                        (new Date(booking.toDate).getTime() -
                          new Date(booking.fromDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) > 1
                        ? t("days")
                        : t("day")}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${statusConfig.color} border-0 px-2.5 py-0.5 text-[11px] font-medium flex gap-1 items-center`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      <span className="line-clamp-1">{statusConfig.label}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 space-y-2">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Pickup Date */}
                <div className="flex-1 flex items-start p-2 bg-emerald-50 rounded-md border border-emerald-100 gap-2 min-w-0">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <div className="flex flex-col gap-0 items-start min-w-0">
                    <p className="text-[11px] font-medium text-emerald-700 uppercase">
                      {t("pickupDate")}
                    </p>
                    <p className="font-semibold text-slate-900 text-xs truncate line-clamp-1">
                      {format(new Date(booking.fromDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {/* Dropoff Date */}
                <div className="flex-1 flex items-start p-2 bg-rose-50 rounded-md border border-rose-100 gap-2 min-w-0">
                  <Calendar className="h-4 w-4 text-rose-400" />
                  <div className="flex flex-col gap-0 items-start min-w-0">
                    <p className="text-[11px] font-medium text-rose-700 uppercase">
                      {t("returnDate")}
                    </p>
                    <p className="font-semibold text-slate-900 text-xs truncate line-clamp-1">
                      {format(new Date(booking.toDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
              {/* Booking Locations */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* Pickup Location */}
                <div className="flex-1 flex items-start p-2 bg-blue-50 rounded-md border border-blue-100 gap-2 min-w-0">
                  <MapPin className="h-4 w-4 text-blue-400 " />
                  <div className="flex flex-col gap-0 items-start min-w-0">
                    <p className="text-[11px] font-medium text-blue-700 uppercase">
                      {t("pickupLocation")}
                    </p>
                    <p className="font-semibold text-slate-900 text-xs truncate line-clamp-1">
                      {booking.pickUpLocationName}
                    </p>
                  </div>
                </div>
                {/* Dropoff Location */}
                <div className="flex-1 flex items-start p-2 bg-orange-50 rounded-md border border-orange-100 gap-2 min-w-0">
                  <MapPin className="h-4 w-4 text-orange-400 " />
                  <div className="flex flex-col gap-0 items-start min-w-0">
                    <p className="text-[11px] font-medium text-orange-700 uppercase">
                      {t("dropoffLocation")}
                    </p>
                    <p className="font-semibold text-slate-900 text-xs truncate line-clamp-1">
                      {booking.dropoffLocationName}
                    </p>
                  </div>
                </div>
              </div>
              {/* Vendor Info */}
              <div className="flex flex-row items-center justify-between pt-2 border-t border-slate-100 gap-1 min-h-[42px]">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center">
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        booking.vendorLogo
                      }`}
                      alt={booking.vendorName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <p className="font-medium text-slate-900 text-xs truncate line-clamp-1">
                      {booking.vendorName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate line-clamp-1">
                      {booking.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 -400 mx-[2px]" />
                  <Badge variant="default" className="text-[11px] px-2">
                    {booking?.paymentStatus}
                  </Badge>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-row flex-wrap gap-1 pt-1">
                {/* Return Car */}
                {canAcceptReturn(booking.bookingStatus) &&
                  onAcceptReturnCar && (
                    <Button
                      className="flex-1 min-w-[90px] px-0 py-1"
                      size="sm"
                      onClick={() => onAcceptReturnCar(booking.id.toString())}
                      disabled={isReturning}
                    >
                      <RotateCcw className="h-4 w-4 me-1" />
                      <span className="text-xs">{t("returnCar")}</span>
                    </Button>
                  )}
                {/* Rate Button */}
                <Button
                  className="flex-1 min-w-[90px] px-0 py-1"
                  size="sm"
                  variant="default"
                  onClick={() => {
                    handleOpenRating(booking.id);
                  }}
                >
                  <Star className="h-4 w-4 me-1" />
                  <span className="text-xs">{t("rateBooking")}</span>
                </Button>
                {/* View Invoice */}
                <Button
                  className="flex-1 min-w-[90px] px-0 py-1"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <Mail className="h-4 w-4 me-1" />
                  <span className="text-xs">{t("invoice")}</span>
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
      <RatingDialog
        open={openRatingDialog}
        onClose={handleCloseRating}
        bookingId={ratingBookingId ?? ""}
        onSubmit={onFavourite}
      />
    </div>
  );
};

export default ClientBookingGridView;
