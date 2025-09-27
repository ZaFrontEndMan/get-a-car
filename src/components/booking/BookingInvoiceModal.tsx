import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Download,
  Car,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useClientBookings } from "../../hooks/client/useClientBookings";
import { Booking } from "../../types/clientBookings";

interface BookingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}
const BookingInvoiceModal: React.FC<BookingInvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { t } = useLanguage();
  const { useGetInvoiceDetails, useGenerateInvoicePdf } = useClientBookings();
  const bookingId = booking?.id?.toString();

  const {
    data: invoiceResponse,
    isLoading,
    isError,
  } = useGetInvoiceDetails(bookingId, undefined);

  const generateInvoicePdfMutation = useGenerateInvoicePdf();

  // Handle loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">{t("loadingInvoiceDetails")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle error state
  if (isError || !invoiceResponse?.data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {t("errorLoadingInvoiceDetails")}
              </p>
              <Button onClick={onClose} variant="outline">
                {t("close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Destructure the invoice data
  const {
    invoiceDetails,
    customerDetails,
    orderDetails,
    vendorDetails,
    carDetails,
  } = invoiceResponse.data;

  const handleDownloadPDF = async () => {
    try {
      const blob = await generateInvoicePdfMutation.mutateAsync({
        invoiceId: invoiceDetails.id,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${orderDetails.bookingNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download invoice PDF", e);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            {t("invoice")}
          </DialogTitle>
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>{t("downloadPdf")}</span>
          </Button>
        </DialogHeader>

        <div className="bg-white p-8 border border-gray-200 rounded-lg print:shadow-none print:border-none">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className=" flex gap-2">
                  <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg w-fit">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Get Car
                  </h1>
                </div>
                <p className="text-gray-600">{t("premiumCarRentalService")}</p>
                <p className="text-sm text-gray-500">{vendorDetails.name}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                {t("invoice")}
              </h2>
              <p className="text-gray-600">#{orderDetails.bookingNumber}</p>
              <p className="text-gray-600">
                {format(new Date(orderDetails.creationdate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Customer & Rental Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-4 w-4 me-2" />
                {t("customerInformation")}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{customerDetails.fullName}</p>
                <p className="flex items-center">
                  <Mail className="h-3 w-3 me-1" />
                  {customerDetails.email}
                </p>
                <p className="flex items-center">
                  <Phone className="h-3 w-3 me-1" />
                  {customerDetails.phoneNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {t("nationalIdLabel")}: {customerDetails.idNumber}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-4 w-4 me-2" />
                {t("rentalDetails")}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">{t("pickup")}:</span>{" "}
                  {orderDetails.pickupLocation}
                </p>
                <p>
                  <span className="font-medium">{t("return")}:</span>{" "}
                  {orderDetails.dropOffLocation}
                </p>
                <p>
                  <span className="font-medium">{t("duration")}:</span>{" "}
                  {orderDetails.rentDays} {t("days")}
                </p>
                <p>
                  <span className="font-medium">{t("status")}:</span>{" "}
                  <span className="capitalize">{orderDetails.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 me-2" />
              {t("rentalPeriod")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("pickupDate")}</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(orderDetails.dateFrom), "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("returnDate")}</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(orderDetails.dateTo), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="h-4 w-4 me-2" />
              {t("vehicleInformation")}
            </h3>
            <div className="flex items-center gap-2">
              {carDetails.imageURLsCar?.[0] && (
                <img
                  src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                    carDetails.imageURLsCar[0]
                  }`}
                  alt={carDetails.carName}
                  className="h-16 w-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {carDetails.carName}
                </p>
                <p className="text-gray-600">
                  {carDetails.model} - {carDetails.type}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-500">
                  <p>
                    {t("transmission")}: {carDetails.transmission}
                  </p>
                  <p>
                    {t("doors")}: {carDetails.doors}
                  </p>
                  <p>
                    {t("engine")}: {carDetails.liter}
                  </p>
                  <p>
                    {t("typeLabel")}: {carDetails.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("description")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("days")}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("rate")}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Car Rental */}
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {carDetails.carName} {t("rentalLabel")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    {orderDetails.rentDays}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(
                      invoiceDetails.charges.carRentCharge /
                        orderDetails.rentDays
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(invoiceDetails.charges.carRentCharge)}
                  </td>
                </tr>

                {/* Protection Fee */}
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {t("protectionFee")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    1
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(invoiceDetails.charges.protectionFee)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(invoiceDetails.charges.protectionFee)}
                  </td>
                </tr>

                {/* Additional Services */}
                {invoiceDetails.paymentInfoDetalis &&
                  invoiceDetails.paymentInfoDetalis.length > 0 &&
                  invoiceDetails.paymentInfoDetalis.map((service, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        {service.carServiceName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                        1
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                        {formatCurrency(service.carServicePrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                        {formatCurrency(service.carServicePrice)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex  w-full justify-center">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{t("carRental")}</span>
                <span className="text-gray-900">
                  {formatCurrency(invoiceDetails.charges.carRentCharge)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{t("protectionFee")}</span>
                <span className="text-gray-900">
                  {formatCurrency(invoiceDetails.charges.protectionFee)}
                </span>
              </div>
              {invoiceDetails.paymentInfoDetalis &&
                invoiceDetails.paymentInfoDetalis.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">
                      {t("additionalServices")}
                    </span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        invoiceDetails.paymentInfoDetalis.reduce(
                          (sum, service) => sum + service.carServicePrice,
                          0
                        )
                      )}
                    </span>
                  </div>
                )}
              <div className="flex justify-between py-2 border-t border-gray-200 w-full">
                <span className="font-semibold text-gray-900">
                  {t("totalAmount")}
                </span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(invoiceDetails.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="text-lg font-medium">{t("thankYouChoosingGetCar")}</p>
            <p className="text-sm mt-2">{t("trustedCarRentalPartner")}</p>
            <div className="mt-4 text-xs space-y-1">
              <p>
                {t("forSupport")}: {vendorDetails.email} |{" "}
                {vendorDetails.phoneNumber}
              </p>
              <p>{t("visitUs")}: www.getcar.sa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BookingInvoiceModal;
