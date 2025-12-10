import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Download,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Car,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Barcode from "react-barcode";
import LazyImage from "../ui/LazyImage";
import { useClientBookings } from "../../hooks/client/useClientBookings";
import { useGetBookingById } from "@/hooks/vendor/useVendorBooking";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";

interface BookingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any; // one Booking from your list, or null
  type?: "client" | "vendor";
}

const formatCurrency = (amount: number | undefined) =>
  amount != null ? (
    `${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} SAR`
  ) : (
    <span className="opacity-0">0.00 SAR</span>
  );

const BookingInvoiceModal: React.FC<BookingInvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
  type = "client",
}) => {
  const { t, language } = useLanguage();
  const { useGetInvoiceDetails, useGenerateInvoicePdf } = useClientBookings();
  const bookingId = booking?.id?.toString();

  const {
    data: invoiceResponse,
    isLoading,
    isError,
  } = type === "client"
    ? useGetInvoiceDetails(bookingId, undefined)
    : useGetBookingById(bookingId || "");

  const generateInvoicePdfMutation = useGenerateInvoicePdf();

  const VITE_UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL ?? "";

  // -- Loading fallback
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

  // -- Error fallback
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

  // -- Main data
  const {
    invoiceDetails,
    customerDetails,
    orderDetails,
    vendorDetails,
    carDetails,
  } = invoiceResponse.data;

  const carImages: string[] =
    Array.isArray(carDetails?.imageURLsCar) && carDetails.imageURLsCar.length
      ? carDetails.imageURLsCar
      : [];

  const vendorLogo = vendorDetails?.logo
    ? `${VITE_UPLOADS_BASE_URL}${vendorDetails.logo}`
    : "/logo.png";

  // Download PDF logic
  const handleDownloadPDF = async () => {
    try {
      const locale = "ar"; // or "en"
      const doc = await generateInvoicePDF(invoiceResponse.data, locale);
      doc.save(`Invoice-${orderDetails.bookingNumber}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error generating invoice");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6">
          <DialogTitle className="text-2xl font-bold">
            {t("invoice")}
          </DialogTitle>

          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
            disabled={generateInvoicePdfMutation.isPending}
          >
            <Download className="h-4 w-4" />
            <span>{t("downloadPdf")}</span>
          </Button>
        </DialogHeader>

        <div className="bg-white p-8 border border-gray-200 rounded-lg mt-4 print:shadow-none print:border-none">
          {/* Invoice header with logo and barcode */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <LazyImage
                src={vendorLogo}
                alt={vendorDetails?.name || "Vendor Logo"}
                className="h-14 w-32 object-contain bg-white rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {vendorDetails?.name || "GetCar"}
                </h1>
                <p className="text-gray-600 text-sm">
                  {t("premiumCarRentalService") || "Premium Car Rental Service"}
                </p>
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <h2 className="text-2xl font-bold text-gray-900 uppercase mb-2">
                {t("invoice")}
              </h2>
              <Barcode
                value={String(orderDetails?.id || "0")}
                width={1.5}
                height={50}
                fontSize={12}
                background="#ffffff"
                lineColor="#000000"
                margin={0}
              />
              <p className="text-gray-600 text-sm">
                #
                {orderDetails?.bookingNumber || (
                  <span className="opacity-0">---</span>
                )}
              </p>
              <p className="text-gray-600 text-sm">
                {orderDetails?.creationdate ? (
                  format(new Date(orderDetails.creationdate), "MMM dd, yyyy")
                ) : (
                  <span className="opacity-0">----</span>
                )}
              </p>
            </div>
          </div>

          {/* Customer + Rental Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-4 w-4 me-2" />
                {t("customerInformation") || "Customer"}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">
                  {customerDetails?.fullName || (
                    <span className="opacity-0">Name</span>
                  )}
                </p>
                <p className="flex items-center">
                  <Mail className="h-3 w-3 me-1" />
                  {customerDetails?.email || (
                    <span className="opacity-0">Email</span>
                  )}
                </p>
                <p className="flex items-center">
                  <Phone className="h-3 w-3 me-1" />
                  {customerDetails?.phoneNumber || (
                    <span className="opacity-0">Phone</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {t("nationalIdLabel") || "National ID"}:{" "}
                  {customerDetails?.idNumber || (
                    <span className="opacity-0">---</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-4 w-4 me-2" />
                {t("rentalDetails") || "Rental"}
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">
                    {t("pickup") || "Pickup"}:
                  </span>{" "}
                  {orderDetails?.pickupLocation || (
                    <span className="opacity-0">---</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">
                    {t("return") || "Return"}:
                  </span>{" "}
                  {orderDetails?.dropOffLocation || (
                    <span className="opacity-0">---</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">
                    {t("duration") || "Duration"}:
                  </span>{" "}
                  {orderDetails?.rentDays != null ? (
                    `${orderDetails.rentDays} ${t("days") || "days"}`
                  ) : (
                    <span className="opacity-0">0 days</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">
                    {t("status") || "Status"}:
                  </span>{" "}
                  <span className="capitalize">
                    {t(orderDetails?.status.toLowerCase()) || (
                      <span className="opacity-0">---</span>
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 me-2" />
              {t("rentalPeriod") || "Rental Period"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {t("pickupDate") || "Pickup Date"}
                  </p>
                  <p className="font-medium text-gray-900">
                    {orderDetails?.dateFrom ? (
                      format(new Date(orderDetails.dateFrom), "PPP")
                    ) : (
                      <span className="opacity-0">---</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {t("returnDate") || "Return Date"}
                  </p>
                  <p className="font-medium text-gray-900">
                    {orderDetails?.dateTo ? (
                      format(new Date(orderDetails.dateTo), "PPP")
                    ) : (
                      <span className="opacity-0">---</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="h-4 w-4 me-2" />
              {t("vehicleInformation") || "Vehicle"}
            </h3>
            <div className="flex items-center gap-2">
              {carImages[0] ? (
                <LazyImage
                  src={`${VITE_UPLOADS_BASE_URL}${carImages[0]}`}
                  alt={carDetails.carName || "Car"}
                  className="h-16 w-28 object-cover rounded-lg"
                />
              ) : (
                <LazyImage
                  src="/logo.png"
                  alt="GetCar Logo"
                  className="h-16 w-28 object-contain bg-white rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {carDetails.carName || <span className="opacity-0">Car</span>}
                </p>
                <p className="text-gray-600">
                  {carDetails.model || <span className="opacity-0">Model</span>}{" "}
                  - {carDetails.type || <span className="opacity-0">Type</span>}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-500">
                  <p>
                    {t("transmission") || "Transmission"}:{" "}
                    {carDetails.transmission || (
                      <span className="opacity-0">---</span>
                    )}
                  </p>
                  <p>
                    {t("doors") || "Doors"}:{" "}
                    {carDetails.doors || <span className="opacity-0">---</span>}
                  </p>
                  <p>
                    {t("engine") || "Engine"}:{" "}
                    {carDetails.liter || <span className="opacity-0">---</span>}
                  </p>
                  <p>
                    {t("typeLabel") || "Type"}:{" "}
                    {carDetails.type || <span className="opacity-0">---</span>}
                  </p>
                  {carDetails?.protectionPrice != null && (
                    <p>
                      {t("protectionFee") || "Protection Fee"}:{" "}
                      {formatCurrency(carDetails.protectionPrice as number)}
                    </p>
                  )}
                </div>
                {/* Gallery Thumbnails -- Only show if more than one */}
                <div className="flex gap-2 mt-2">
                  {carImages.slice(1, 5).map((img, idx) => (
                    <LazyImage
                      key={idx}
                      src={`${VITE_UPLOADS_BASE_URL}${img}`}
                      alt={`Car ${idx}`}
                      className="h-8 w-14 object-cover rounded border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("description") || "Description"}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("days") || "Days"}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("rate") || "Rate"}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    {t("amount") || "Amount"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {carDetails?.carName || (
                      <span className="opacity-0">car</span>
                    )}{" "}
                    {t("rentalLabel") || "Rental"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    {orderDetails.rentDays != null ? (
                      orderDetails.rentDays
                    ) : (
                      <span className="opacity-0">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(
                      (orderDetails?.totalPrice ?? 0) /
                        (orderDetails?.rentDays || 1)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(orderDetails?.totalPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {t("protectionFee") || "Protection Fee"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    1
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(
                      invoiceDetails?.charges?.protectionFee ??
                        (carDetails?.protectionPrice as number | undefined)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(
                      invoiceDetails?.charges?.protectionFee ??
                        (carDetails?.protectionPrice as number | undefined)
                    )}
                  </td>
                </tr>
                {invoiceDetails?.paymentInfoDetalis?.length
                  ? invoiceDetails.paymentInfoDetalis.map((service, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                          {service?.carServiceName || (
                            <span className="opacity-0">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                          1
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                          {formatCurrency(service?.carServicePrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                          {formatCurrency(service?.carServicePrice)}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex w-full justify-center">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  {t("carRental") || "Car Rental"}
                </span>
                <span className="text-gray-900">
                  {formatCurrency(orderDetails?.totalPrice)}
                </span>
              </div>
              {invoiceDetails?.charges?.protectionFee ? (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">
                    {t("protectionFee") || "Protection Fee"}
                  </span>
                  <span className="text-gray-900">
                    {formatCurrency(invoiceDetails?.charges?.protectionFee)}
                  </span>
                </div>
              ) : null}
              {invoiceDetails?.paymentInfoDetalis?.length ? (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">
                    {t("additionalServices") || "Additional Services"}
                  </span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      invoiceDetails.paymentInfoDetalis.reduce(
                        (sum, service) => sum + (service?.carServicePrice || 0),
                        0
                      )
                    )}
                  </span>
                </div>
              ) : null}
              {orderDetails?.webSiteAmount != null &&
                orderDetails.webSiteAmount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">
                      {t("paidAmount") || "Paid Amount"}
                    </span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(orderDetails.webSiteAmount)}
                    </span>
                  </div>
                )}
              <div className="flex justify-between gap-2 py-2 border-t border-gray-200 w-full">
                <span className="font-semibold text-gray-900">
                  {t("totalAmount") || "Total"}
                </span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(orderDetails?.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="text-lg font-medium">
              {t("thankYouChoosingGetCar") || "Thank you for choosing GetCar!"}
            </p>
            <p className="text-sm mt-2">
              {t("trustedCarRentalPartner") ||
                "Your trusted car rental partner."}
            </p>
            <div className="mt-4 text-xs space-y-1">
              <p>
                {t("forSupport") || "Support"}:{" "}
                {vendorDetails?.email || <span className="opacity-0">---</span>}{" "}
                |{" "}
                {vendorDetails?.phoneNumber || (
                  <span className="opacity-0">---</span>
                )}
              </p>
              <p>{t("visitUs") || "Visit us"}: www.getcar.sa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingInvoiceModal;
