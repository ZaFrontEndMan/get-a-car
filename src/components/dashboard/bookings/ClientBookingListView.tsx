import React, { useState } from 'react';
import { format } from 'date-fns';
import { RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types/clientBookings';
import { getStatusConfig } from '@/components/vendor/bookings/bookingUtils';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';

interface ClientBookingListViewProps {
  bookings: Booking[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
}

const ClientBookingListView = ({ bookings, onReturnCar, isReturning }: ClientBookingListViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const canReturnCar = (status: string) => {
    return status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'active' || status.toLowerCase() === 'in_progress' || status === 'InProgress';
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.bookingStatus);
        
        return (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={booking.carImage ? (booking.carImage.startsWith('http') ? booking.carImage : `/${booking.carImage}`) : 'https://images.unsplash.com/photo-1549924231-f129b911e442'}
                  alt={booking.carName}
                  className="h-16 w-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.carName}</h3>
                  <p className="text-gray-600">{booking.vendorName}</p>
                  <p className="text-sm text-gray-500">#{booking.bookingNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.fromDate), 'MMM dd')} - {format(new Date(booking.toDate), 'MMM dd')}
                  </p>
                  <p className="font-semibold text-gray-900">SAR {booking.totalPrice}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={`border text-xs ${statusConfig.color}`}>
                    {statusConfig.label}
                  </Badge>
                  <div className="flex space-x-2">
                    {canReturnCar(booking.bookingStatus) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReturnCar(booking.id.toString())}
                        disabled={isReturning}
                        className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Return</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center space-x-1 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Invoice</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default ClientBookingListView;
