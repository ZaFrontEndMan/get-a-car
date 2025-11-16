import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Car,
  CreditCard,
  FileText,
} from "lucide-react";
import { getStatusConfig } from "./bookingUtils";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { useLanguage } from "@/contexts/LanguageContext";
import LazyImage from "@/components/ui/LazyImage";

interface BookingCardProps {
  booking: any;
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onStartProgress: (id: string) => void;
  onAcceptReturn: (id: string) => void;
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  isStartLoading: boolean;
  isReturnLoading: boolean;
}

const BookingCard = ({
  booking,
  onAcceptBooking,
  onRejectBooking,
  onStartProgress,
  onAcceptReturn,
  isAcceptLoading,
  isRejectLoading,
  isStartLoading,
  isReturnLoading,
}: BookingCardProps) => {
  const { t } = useLanguage();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const statusConfig = getStatusConfig(booking.booking_status || "pending");
  const StatusIcon = statusConfig.icon;

  return (
    <div className="w-full">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white overflow-hidden h-full flex flex-col">
        <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                  <LazyImage
                    src={booking?.cars[0]?.images[0] || ""}
                    alt={booking?.cars[0]?.name || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 mb-1 truncate">
                  {booking.cars[0]?.name}
                </CardTitle>
                <p className="text-slate-600 font-medium text-sm truncate">
                  {booking.cars[0]?.brand} {booking.cars[0]?.model}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  {t("sar")} {booking.total_amount?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={`${statusConfig.color} border-0 px-2 py-1 text-xs font-medium`}
            >
              <StatusIcon className="h-3 w-3 me-1" />
              {statusConfig.label}
            </Badge>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              #{booking.booking_number}
            </span>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full w-fit">
              {booking.total_days}{" "}
              {booking.total_days === 1 ? t("day") : t("days")}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
          {/* Customer Information */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center me-2 flex-shrink-0">
                <User className="h-3 w-3 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 text-sm sm:text-base">
                {t("customerInformation")}
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-900 truncate">
                  {booking.customer_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 truncate">
                  {booking.customer_email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700">
                  {booking.customer_phone}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                  {t("pickupDate")}
                </p>
              </div>
              <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                {new Date(booking.pickup_date).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-rose-500 rounded-md flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs font-medium text-rose-700 uppercase tracking-wide">
                  {t("returnDate")}
                </p>
              </div>
              <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                {new Date(booking.return_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Location Details */}
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
                  {booking.pickup_location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-amber-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                  {t("returnLocation")}
                </p>
                <p className="font-medium text-slate-900 text-sm break-words">
                  {booking.return_location}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Payment */}
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
                  booking.payment_status === "paid" ? "default" : "secondary"
                }
                className={`text-xs font-medium ${
                  booking.payment_status === "paid"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {booking.payment_status === "paid"
                  ? t("paymentStatusPaid")
                  : t("paymentStatusPending")}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{t("dailyRate")}</span>
                <span className="font-semibold text-slate-900">
                  {t("sar")} {booking.daily_rate?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{t("totalDays")}</span>
                <span className="font-semibold text-slate-900">
                  {booking.total_days}
                </span>
              </div>
              <div className="border-t border-indigo-200 pt-2">
                <div className="flex items-center justify-between font-bold text-base text-indigo-900">
                  <span>{t("totalAmount")}</span>
                  <span>
                    {t("sar")} {booking.total_amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-amber-600 me-2 flex-shrink-0" />
                <h5 className="font-semibold text-amber-900 text-sm sm:text-base">
                  {t("specialRequests")}
                </h5>
              </div>
              <p className="text-amber-800 text-sm break-words">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* {booking.booking_status === "pending" && (
                  <>
                    <Button
                      onClick={() => onAcceptBooking(booking.id)}
                      disabled={isAcceptLoading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2"
                    >
                      <CheckCircle className="h-4 w-4 me-2" />
                      {t("acceptBooking")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onRejectBooking(booking.id)}
                      disabled={isRejectLoading}
                      className="flex-1 font-medium text-sm py-2"
                    >
                      <XCircle className="h-4 w-4 me-2" />
                      {t("rejectBooking")}
                    </Button>
                  </>
                )}

                {booking.booking_status === "active" && (
                  <Button
                    onClick={() => onStartProgress(booking.id)}
                    disabled={isStartLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm py-2"
                  >
                    <PlayCircle className="h-4 w-4 me-2" />
                    {t("startTrip")}
                  </Button>
                )} */}

                {booking.booking_status === "return_requested" && (
                  <Button
                    onClick={() => onAcceptReturn(booking.id)}
                    disabled={isReturnLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-2"
                  >
                    <CheckCircle className="h-4 w-4 me-2" />
                    {t("acceptReturn")}
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm py-2"
                onClick={() => setIsInvoiceOpen(true)}
              >
                <FileText className="h-4 w-4" />
                <span>{t("viewInvoice")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        {isInvoiceOpen && (
          <BookingInvoiceModal
            type="vendor"
            isOpen={isInvoiceOpen}
            onClose={() => setIsInvoiceOpen(false)}
            booking={booking}
          />
        )}
      </Card>
    </div>
  );
};

export default BookingCard;
