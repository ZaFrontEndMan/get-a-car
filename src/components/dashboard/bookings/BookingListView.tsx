
import React, { useState } from 'react';
import { format } from 'date-fns';
import { RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingWithCar } from '@/hooks/useBookings';
import { getStatusConfig } from '@/components/vendor/bookings/bookingUtils';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';
import { useLanguage } from '@/contexts/LanguageContext';
import LazyImage from '@/components/ui/LazyImage';

interface BookingListViewProps {
  bookings: BookingWithCar[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
}

const BookingListView = ({ bookings, onReturnCar, isReturning }: BookingListViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithCar | null>(null);
  const { t } = useLanguage();
  
  const canReturnCar = (status: string) => {
    return status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'active' || status.toLowerCase() === 'in_progress';
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.booking_status);
        
        return (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LazyImage
                  src={booking.car.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442'}
                  alt={booking.car.name}
                  className="h-16 w-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.car.name}</h3>
                  <p className="text-gray-600">{booking.car.brand} {booking.car.model}</p>
                  <p className="text-sm text-gray-500">#{booking.booking_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.pickup_date), 'MMM dd')} - {format(new Date(booking.return_date), 'MMM dd')}
                  </p>
                  <p className="font-semibold text-gray-900">SAR {booking.total_amount}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={`border text-xs ${statusConfig.color}`}>
                    {statusConfig.label}
                  </Badge>
                  <div className="flex gap-2">
                    {canReturnCar(booking.booking_status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReturnCar(booking.id)}
                        disabled={isReturning}
                        className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4 me-2" />
                        <span>{t('return')}</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center gap-1 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                    >
                      <Mail className="h-4 w-4 me-2" />
                      <span>{t('invoice')}</span>
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

export default BookingListView;
