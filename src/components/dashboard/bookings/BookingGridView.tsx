import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Phone, RotateCcw, Mail, Car, Clock, CreditCard } from 'lucide-react';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookingWithCar } from '@/hooks/useBookings';
import { getStatusConfig } from '@/components/vendor/bookings/bookingUtils';
interface BookingGridViewProps {
  bookings: BookingWithCar[];
  onReturnCar: (bookingId: string) => void;
  isReturning: boolean;
}
const BookingGridView = ({
  bookings,
  onReturnCar,
  isReturning
}: BookingGridViewProps) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithCar | null>(null);
  const canReturnCar = (status: string) => {
    return status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'active' || status.toLowerCase() === 'in_progress';
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookings.map(booking => {
      const statusConfig = getStatusConfig(booking.booking_status);
      const StatusIcon = statusConfig.icon;
      return <Card key={booking.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                      <img src={booking.car.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442'} alt={booking.car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg truncate mb-1 mx-[8px]">
                      {booking.car.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2 mx-[9px]">
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <Badge variant="outline" className={`${statusConfig.color} border-0 px-3 py-1 text-xs font-medium`}>
                      <StatusIcon className="h-3 w-3 mr-1.5" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    SAR {booking.total_amount}
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {booking.total_days} {booking.total_days === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Booking Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1 mx-[8px]">Pickup</p>
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {format(new Date(booking.pickup_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-rose-700 uppercase tracking-wide mb-1">Return</p>
                    <p className="font-semibold text-slate-900 text-sm truncate mx-[8px]">
                      {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 mx-[8px]">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">From</p>
                    <p className="font-medium text-slate-900 text-sm truncate">{booking.pickup_location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center mt-0.5">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">To</p>
                    <p className="font-medium text-slate-900 text-sm truncate">{booking.return_location}</p>
                  </div>
                </div>
              </div>

              {/* Vendor & Payment Info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{booking.vendor.name}</p>
                    {booking.vendor.phone && <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Phone className="h-3 w-3" />
                        <span className="mx-[8px]">{booking.vendor.phone}</span>
                      </div>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-slate-400 mx-[6px]" />
                  <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'} className={`text-xs font-medium ${booking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                    {booking.payment_status}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                {canReturnCar(booking.booking_status) && <Button size="sm" onClick={() => onReturnCar(booking.id)} disabled={isReturning} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return Car
                  </Button>}
                <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)} className="flex-1 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium">
                  <Mail className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </CardContent>
          </Card>;
    })}
      
      <BookingInvoiceModal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} booking={selectedBooking} />
    </div>;
};
export default BookingGridView;