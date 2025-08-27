import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { Download, Car, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
interface BookingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any; // Will be properly typed based on your booking interface
}
const BookingInvoiceModal: React.FC<BookingInvoiceModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const {
    t
  } = useLanguage();
  if (!booking) return null;
  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading PDF for booking:', booking.id);
    alert('PDF download functionality would be implemented here');
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">Invoice</DialogTitle>
          <Button onClick={handleDownloadPDF} className="flex items-center space-x-2">
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mx-[10px]">Get Car</h1>
                <p className="text-gray-600">Premium Car Rental Service</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600">#{booking.booking_number}</p>
              <p className="text-gray-600">{format(new Date(booking.created_at), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Customer & Rental Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center mx-[10px]">
                <Mail className="h-4 w-4 mr-2 mx-[5px]" />
                Customer Information
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{booking.customer_name}</p>
                <p>{booking.customer_email}</p>
                <p>{booking.customer_phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Rental Details
              </h3>
              <div className="text-gray-600 space-y-1">
                <p><span className="font-medium">Pickup:</span> {booking.pickup_location}</p>
                <p><span className="font-medium">Return:</span> {booking.return_location}</p>
                <p><span className="font-medium">Duration:</span> {booking.total_days} days</p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center mx-[8px]">
              <Calendar className="h-4 w-4 mr-2" />
              Rental Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Pickup Date</p>
                  <p className="font-medium text-gray-900">{format(new Date(booking.pickup_date), 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Return Date</p>
                  <p className="font-medium text-gray-900">{format(new Date(booking.return_date), 'PPP')}</p>
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
              {booking.cars?.images?.[0] && <img src={booking.cars.images[0]} alt={booking.cars.name} className="h-16 w-24 object-cover rounded-lg" />}
              <div>
                <p className="font-medium text-gray-900">{booking.cars?.name}</p>
                <p className="text-gray-600">{booking.cars?.brand} {booking.cars?.model}</p>
                <p className="text-sm text-gray-500">Daily Rate: {formatCurrency(booking.daily_rate)}</p>
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
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {booking.cars?.name} Rental
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                    {booking.total_days}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(booking.daily_rate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {formatCurrency(booking.subtotal)}
                  </td>
                </tr>
                
                {/* Additional Services */}
                {booking.additional_services && booking.additional_services.length > 0 && booking.additional_services.map((service: any, index: number) => <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        {service.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-200">
                        1
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                        {formatCurrency(service.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                        {formatCurrency(service.price)}
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(booking.subtotal)}</span>
                </div>
                {booking.service_fees > 0 && <div className="flex justify-between py-2">
                    <span className="text-gray-600">Additional Services</span>
                    <span className="text-gray-900">{formatCurrency(booking.service_fees)}</span>
                  </div>}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(booking.total_amount)}</span>
                </div>
                {booking.deposit_paid > 0 && <div className="flex justify-between py-2">
                    <span className="text-gray-600">Deposit Paid</span>
                    <span className="text-green-600">{formatCurrency(booking.deposit_paid)}</span>
                  </div>}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Special Requests</h4>
              <p className="text-yellow-700">{booking.special_requests}</p>
            </div>}

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="text-lg font-medium">Thank you for choosing Get Car!</p>
            <p className="text-sm mt-2">Your trusted car rental partner in Saudi Arabia</p>
            <div className="mt-4 text-xs space-y-1">
              <p>For support: support@getcar.sa | +966 11 123 4567</p>
              <p>Visit us: www.getcar.sa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default BookingInvoiceModal;