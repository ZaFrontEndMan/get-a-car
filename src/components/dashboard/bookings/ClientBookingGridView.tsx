import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  RotateCcw,
  Mail,
  CreditCard,
  CheckCircle,
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

  // ...keep your status logic as before

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
    // in progress (Arabic/English/number)
    return (
      key.label === "قيد الاجراء" ||
      key.label.toLowerCase() === "inprogress" ||
      key.label.toLowerCase() === "in progress"
    );
  };

  const isCompleted = (status: string) => {
    const key = getStatusConfig(status);
    // completed (Arabic/English/number)
    return (
      key.label === "تم إرجاع السيارة" ||
      key.label === "تم الارجاع" ||
      key.label.toLowerCase() === "completed"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.bookingStatus);
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={booking.id}
            className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white"
          >
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex gap-4 items-start">
                <div className="relative">
                  <div className="w-20 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        booking.carImage
                      }`}
                      alt={booking.carName}
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
                      {booking.carName}
                    </span>
                    <span className="text-md">SAR {booking.totalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full text-start w-fit uppercase">
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
                <div className="flex-1 flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100 gap-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-medium text-emerald-700 uppercase">
                      {t("pickupDate")}
                    </p>
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {format(new Date(booking.fromDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-start p-3 bg-rose-50 rounded-lg border border-rose-100 gap-2">
                  <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-medium text-rose-700 uppercase">
                      {t("returnDate")}
                    </p>
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {format(new Date(booking.toDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-slate-100 gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        booking.vendorLogo
                      }`}
                      alt={booking.vendorName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {booking.vendorName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 uppercase">
                  <CreditCard className="h-4 w-4 text-slate-400 mx-[6px]" />
                  <Badge variant="default">{booking?.paymentStatus}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 pt-2">
                {/* Return Car */}
                {canAcceptReturn(booking.bookingStatus) &&
                  onAcceptReturnCar && (
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => onAcceptReturnCar(booking.id.toString())}
                      disabled={isReturning}
                    >
                      <RotateCcw className="h-4 w-4 me-2" />
                      {t("returnCar")}
                    </Button>
                  )}

                {/* Rate Button (Completed Only) */}
                {isCompleted(booking.bookingStatus) && onFavourite && (
                  <Button
                    className="flex-1"
                    size="sm"
                    variant="success"
                    onClick={()=>{handleOpenRating(booking.id)}}
                  >
                    <CheckCircle className="h-4 w-4 me-2" />
                    {t("rateBooking")}
                  </Button>
                )}

                {/* View Invoice */}
                <Button
                  className="flex-1"
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
