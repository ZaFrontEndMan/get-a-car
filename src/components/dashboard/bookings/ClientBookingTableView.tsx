import React, { useState } from "react";
import { format } from "date-fns";
import { RotateCcw, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@/types/clientBookings";
import { getStatusConfig } from "@/components/vendor/bookings/bookingUtils";
import BookingInvoiceModal from "@/components/booking/BookingInvoiceModal";
import { useLanguage } from "@/contexts/LanguageContext";
import LazyImage from "@/components/ui/LazyImage";

interface ClientBookingTableViewProps {
  bookings: Booking[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
  onAcceptReturnCar?: (bookingId: string) => void;
  isAccepting?: boolean;
}

const ClientBookingTableView = ({
  bookings,
  onReturnCar,
  isReturning,
  onAcceptReturnCar,
  isAccepting,
}: ClientBookingTableViewProps) => {
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
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <TableComponent>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold text-start">
              {t("car")}
            </TableHead>
            <TableHead className="font-semibold text-start">
              {t("bookingNumber")}
            </TableHead>
            <TableHead className="font-semibold text-start">
              {t("dates")}
            </TableHead>
            <TableHead className="font-semibold text-start">
              {t("amount")}
            </TableHead>
            <TableHead className="font-semibold text-start">
              {t("status")}
            </TableHead>
            <TableHead className="font-semibold text-start">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.bookingStatus);

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LazyImage
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        booking.carImage
                      }`}
                      alt={booking.carName}
                      className="h-12 w-16 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.carName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.vendorName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">
                    {booking.bookingNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(booking.fromDate), "MMM dd, yyyy")} -
                    {format(new Date(booking.toDate), "MMM dd, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-900">
                    SAR {booking.totalPrice}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {canReturnCar(booking.bookingStatus) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onAcceptReturnCar(booking.id.toString())}
                        disabled={isReturning}
                        className="flex items-center gap-2 "
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>{t("returnCar")}</span>
                      </Button>
                    )}
                    {canAcceptReturn(booking.bookingStatus) &&
                      onAcceptReturnCar && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            onAcceptReturnCar(booking.id.toString())
                          }
                          disabled={isAccepting}
                          className="flex items-center gap-2 "
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>{t("acceptReturn")}</span>
                        </Button>
                      )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center gap-2 "
                    >
                      <Mail className="h-4 w-4" />
                      <span>{t("invoice")}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableComponent>

      <BookingInvoiceModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default ClientBookingTableView;
