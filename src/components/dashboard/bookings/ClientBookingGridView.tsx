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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types/clientBookings";
import { getStatusConfig } from "@/components/vendor/bookings/bookingUtils";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { useLanguage } from "@/contexts/LanguageContext";
import RatingDialog from "./RatingDialog";
import LazyImage from "@/components/ui/LazyImage";

interface ClientBookingGridViewProps {
  bookings: Booking[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
  onAcceptReturnCar?: (bookingId: string) => void;
  onRate?: () => void;
  isAccepting?: boolean;
}

const ClientBookingGridView = ({
  bookings,
  isReturning,
  onAcceptReturnCar,
  onRate,
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
          <Card className="group hover:shadow-md border-0 shadow bg-white">
            {" "}
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                      <LazyImage
                        src={
                          booking.carImage
                            ? `${import.meta.env.VITE_UPLOADS_BASE_URL}${
                                booking.carImage
                              }`
                            : "/placeholder-car.png"
                        }
                        alt={booking.carName || "Car"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 mb-1 truncate">
                      {booking.carName || (
                        <span className="inline-block opacity-0">Car Name</span>
                      )}
                    </CardTitle>
                    <p className="text-slate-600 font-medium text-sm truncate">
                      {booking.carBrand && booking.carModel ? (
                        `${booking.carBrand} ${booking.carModel}`
                      ) : (
                        <span className="inline-block opacity-0">
                          Brand Model
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      {t("sar")}{" "}
                      {booking.totalPrice != null ? (
                        booking.totalPrice.toLocaleString()
                      ) : (
                        <span className="inline-block opacity-0">0</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`${statusConfig.color} border-0 px-2 py-1 text-xs font-medium flex gap-1 items-center`}
                >
                  <StatusIcon className="h-3 w-3 me-1" />
                  {statusConfig.label || (
                    <span className="inline-block opacity-0">Status</span>
                  )}
                </Badge>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {booking.bookingNumber ? (
                    `#${booking.bookingNumber}`
                  ) : (
                    <span className="inline-block opacity-0">#num</span>
                  )}
                </span>
                <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full w-fit">
                  {booking.toDate && booking.fromDate ? (
                    (() => {
                      const days = Math.ceil(
                        (new Date(booking.toDate).getTime() -
                          new Date(booking.fromDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      return (
                        <>
                          {days} {days > 1 ? t("days") : t("day")}
                        </>
                      );
                    })()
                  ) : (
                    <span className="inline-block opacity-0">
                      0 {t("days")}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
              {/* Vendor (Customer) section */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center me-2 flex-shrink-0">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900 text-sm sm:text-base">
                    {t("vendorInfo")}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-slate-900 truncate">
                      {booking.vendorName || (
                        <span className="inline-block opacity-0">
                          Vendor name
                        </span>
                      )}
                    </span>
                  </div>
                  {/* Optionally: Email, Phone if you want to add, repeat above structure */}
                </div>
              </div>
              {/* Timeline section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3 w-3 text-emerald-500" />
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                      {t("pickupDate")}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                    {booking.fromDate ? (
                      format(new Date(booking.fromDate), "MMM dd, yyyy")
                    ) : (
                      <span className="inline-block opacity-0">
                        ___ __, ____
                      </span>
                    )}
                  </p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3 w-3 text-rose-500" />
                    <p className="text-xs font-medium text-rose-700 uppercase tracking-wide">
                      {t("returnDate")}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                    {booking.toDate ? (
                      format(new Date(booking.toDate), "MMM dd, yyyy")
                    ) : (
                      <span className="inline-block opacity-0">
                        ___ __, ____
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {/* Location details */}
              <div className="space-y-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                      {t("pickupLocation")}
                    </p>
                    <p className="font-medium text-slate-900 text-sm break-words">
                      {booking.pickUpLocationName || (
                        <span className="inline-block opacity-0">Pickup</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                      {t("dropoffLocation")}
                    </p>
                    <p className="font-medium text-slate-900 text-sm break-words">
                      {booking.dropoffLocationName || (
                        <span className="inline-block opacity-0">Dropoff</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* Payment section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <h5 className="font-semibold text-indigo-900 text-sm sm:text-base">
                      {t("paymentDetails")}
                    </h5>
                  </div>
                  <Badge
                    variant={
                      booking.paymentStatus === "paid" ? "default" : "secondary"
                    }
                    className={`text-xs font-medium ${
                      booking.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                  >
                    {booking.paymentStatus ? (
                      booking.paymentStatus === "paid" ? (
                        t("paymentStatusPaid")
                      ) : (
                        t("paymentStatusPending")
                      )
                    ) : (
                      <span className="inline-block opacity-0">status</span>
                    )}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{t("totalDays")}</span>
                    <span className="font-semibold text-slate-900">
                      {booking.toDate && booking.fromDate ? (
                        Math.ceil(
                          (new Date(booking.toDate).getTime() -
                            new Date(booking.fromDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      ) : (
                        <span className="inline-block opacity-0">0</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-indigo-200 pt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-medium">
                        {t("totalAmount")}
                      </span>
                      <span className="font-bold text-slate-900">
                        {t("sar")}{" "}
                        {booking.totalPrice != null ? (
                          booking.totalPrice.toLocaleString()
                        ) : (
                          <span className="inline-block opacity-0">0</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-medium">
                        {t("paidAmount")}
                      </span>
                      <span className="font-bold text-emerald-600">
                        {t("sar")}{" "}
                        {booking.webSiteAmount != null ? (
                          booking.webSiteAmount.toLocaleString()
                        ) : (
                          <span className="inline-block opacity-0">0</span>
                        )}
                      </span>
                    </div>
                    {booking.totalPrice - booking.webSiteAmount > 0 ? (
                      <div className="flex items-center justify-between text-sm bg-amber-50 -mx-2 px-2 py-1.5 rounded">
                        <span className="text-amber-700 font-medium">
                          {t("remainingAmount")}
                        </span>
                        <span className="font-bold text-amber-700">
                          {t("sar")}{" "}
                          {(
                            booking.totalPrice - booking.webSiteAmount
                          )?.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      // Always render the div but make it invisible for spacing
                      <div className="flex items-center justify-between text-sm bg-amber-50 -mx-2 px-2 py-1.5 rounded opacity-0 select-none pointer-events-none">
                        <span className="text-amber-700 font-medium">
                          {t("remainingAmount")}
                        </span>
                        <span className="font-bold text-amber-700">
                          {t("sar")} 0
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {canAcceptReturn(booking.bookingStatus) &&
                      onAcceptReturnCar && (
                        <Button
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-2"
                          onClick={() =>
                            onAcceptReturnCar(booking.id.toString())
                          }
                          disabled={isReturning}
                        >
                          <RotateCcw className="h-4 w-4 me-2" />
                          <span className="text-xs">{t("returnCar")}</span>
                        </Button>
                      )}
                    {!booking.isReview && (
                      <Button
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm py-2"
                        variant="default"
                        onClick={() => handleOpenRating(booking.id)}
                      >
                        <Star className="h-4 w-4 me-2" />
                        <span className="text-xs">{t("rateBooking")}</span>
                      </Button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm py-2"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <Mail className="h-4 w-4" />
                    <span>{t("invoice")}</span>
                  </Button>
                </div>
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
        onSubmit={onRate}
      />
    </div>
  );
};

export default ClientBookingGridView;
