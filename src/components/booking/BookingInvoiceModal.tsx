import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useLanguage } from "../../contexts/LanguageContext";
import { Download, Car, Mail, MapPin, Calendar, Clock, User, Phone, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useClientBookings } from "../../hooks/client/useClientBookings";
import { Booking } from "../../types/clientBookings";
import { InvoiceResponse } from "../../types/invoiceDetails";

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
  const { useGetInvoiceDetails } = useClientBookings();
  const bookingId = booking?.id?.toString();

  const {
    data: invoiceResponse,
    isLoading,
    isError,
  } = useGetInvoiceDetails(bookingId, undefined);

  // Handle loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invoice details...</p>
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
              <p className="text-red-600 mb-4">Error loading invoice details</p>
              <Button onClick={onClose} variant="outline">
                Close
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

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF for booking:", orderDetails.bookingNumber);
    alert("PDF download functionality would be implemented here");
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
          <DialogTitle className="text-2xl font-bold">Invoice</DialogTitle>
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </DialogHeader>

        <div className="bg-white p-8 border border-gray-200 rounded-lg print:shadow-none print:border-none">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Get Car
                </h1>
                <p className="text-gray-600">Premium Car Rental Service</p>
                <p className="text-sm text-gray-500">{vendorDetails.name}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
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
                <User className="h-4 w-4 mr-2" />
                Customer Information
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{customerDetails.fullName}</p>
                <p className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {customerDetails.email}
                </p>
                <p className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {customerDetails.phoneNumber}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {customerDetails.idNumber}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Rental Details
              </h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Pickup:</span>{" "}
                  {orderDetails.pickupLocation}
                </p>
                <p>
                  <span className="font-medium">Return:</span>{" "}
                  {orderDetails.dropOffLocation}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {orderDetails.rentDays} days
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{orderDetails.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Rental Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Pickup Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(orderDetails.dateFrom), "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Return Date</p>
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
              <Car className="h-4 w-4 mr-2" />
              Vehicle Information
            </h3>
            <div className="flex items-center space-x-4">
              {carDetails.imageURLsCar?.[0] && (
                <img
                  src={carDetails.imageURLsCar[0].startsWith('http') ? carDetails.imageURLsCar[0] : `/${carDetails.imageURLsCar[0]}`}
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
                  <p>Transmission: {carDetails.transmission}</p>
                  <p>Doors: {carDetails.doors}</p>
                  <p>Engine: {carDetails.liter}</p>
                  <p>Type: {carDetails.type}</p>
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
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b border-gray-200">
                    Days
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-b border-gray-200">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Car Rental */}
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {carDetails.carName} Rental
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    {orderDetails.rentDays}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(invoiceDetails.charges.carRentCharge / orderDetails.rentDays)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(invoiceDetails.charges.carRentCharge)}
                  </td>
                </tr>

                {/* Protection Fee */}
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    Protection Fee
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
                  invoiceDetails.paymentInfoDetalis.map(
                    (service, index) => (
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
                    )
                  )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Car Rental</span>
                  <span className="text-gray-900">
                    {formatCurrency(invoiceDetails.charges.carRentCharge)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Protection Fee</span>
                  <span className="text-gray-900">
                    {formatCurrency(invoiceDetails.charges.protectionFee)}
                  </span>
                </div>
                {invoiceDetails.paymentInfoDetalis && invoiceDetails.paymentInfoDetalis.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Additional Services</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        invoiceDetails.paymentInfoDetalis.reduce((sum, service) => sum + service.carServicePrice, 0)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(invoiceDetails.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="text-lg font-medium">
              Thank you for choosing Get Car!
            </p>
            <p className="text-sm mt-2">
              Your trusted car rental partner in Saudi Arabia
            </p>
            <div className="mt-4 text-xs space-y-1">
              <p>For support: {vendorDetails.email} | {vendorDetails.phoneNumber}</p>
              <p>Visit us: www.getcar.sa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BookingInvoiceModal;

