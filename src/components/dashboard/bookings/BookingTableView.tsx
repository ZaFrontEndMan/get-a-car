
import React, { useState } from 'react';
import { format } from 'date-fns';
import { RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingWithCar } from '@/hooks/useBookings';
import { getStatusConfig } from '@/components/vendor/bookings/bookingUtils';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';

interface BookingTableViewProps {
  bookings: BookingWithCar[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
}

const BookingTableView = ({ bookings, onReturnCar, isReturning }: BookingTableViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithCar | null>(null);
  
  const canReturnCar = (status: string) => {
    return status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'active' || status.toLowerCase() === 'in_progress';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <TableComponent>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold">Car</TableHead>
            <TableHead className="font-semibold">Booking #</TableHead>
            <TableHead className="font-semibold">Dates</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.booking_status);
            
            return (
              <TableRow key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={booking.car.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442'}
                      alt={booking.car.name}
                      className="h-12 w-16 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{booking.car.name}</div>
                      <div className="text-sm text-gray-500">{booking.car.brand} {booking.car.model}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">{booking.booking_number}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(booking.pickup_date), 'MMM dd, yyyy')} - 
                    {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-900">SAR {booking.total_amount}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`border ${statusConfig.color}`}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {canReturnCar(booking.booking_status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReturnCar(booking.id)}
                        disabled={isReturning}
                        className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Return Car</span>
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

export default BookingTableView;
