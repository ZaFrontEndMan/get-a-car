
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Phone, Mail, Clock, CheckCircle, XCircle, PlayCircle, Car, CreditCard, FileText } from 'lucide-react';
import { getStatusConfig } from './bookingUtils';
import BookingInvoiceModal from '@/components/booking/BookingInvoiceModal';

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
  isReturnLoading
}: BookingCardProps) => {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const statusConfig = getStatusConfig(booking.booking_status || 'pending');
  const StatusIcon = statusConfig.icon;

  console.log('BookingCard - Booking status:', booking.booking_status, 'Booking ID:', booking.id);

  return (
    <div className="w-full">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  {booking.cars?.images?.[0] && (
                    <img
                      src={booking.cars.images[0]}
                      alt={booking.cars.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${statusConfig.dotColor} ring-2 ring-white shadow-sm`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 truncate">{booking.cars?.name}</CardTitle>
                <p className="text-slate-600 font-medium text-sm mb-2 truncate">{booking.cars?.brand} {booking.cars?.model}</p>
                <div className="flex flex-col gap-2 mb-2">
                  <Badge variant="outline" className={`${statusConfig.color} border-0 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium w-fit`}>
                    <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">#{booking.booking_number}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                SAR {booking.total_amount?.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                {booking.total_days} {booking.total_days === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 flex flex-col">
          {/* Customer Information */}
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Customer Information</h4>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-slate-900 truncate text-sm sm:text-base">{booking.customer_name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm truncate">{booking.customer_email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">{booking.customer_phone}</span>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 border border-emerald-100">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Pickup Date</p>
              </div>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">
                {new Date(booking.pickup_date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-rose-50 rounded-lg p-3 sm:p-4 border border-rose-100">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-500 rounded-md flex items-center justify-center">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <p className="text-xs font-medium text-rose-700 uppercase tracking-wide">Return Date</p>
              </div>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">
                {new Date(booking.return_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3 bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-100">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-md flex items-center justify-center mt-0.5">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Pickup Location</p>
                <p className="font-medium text-slate-900 text-sm break-words">{booking.pickup_location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-md flex items-center justify-center mt-0.5">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Return Location</p>
                <p className="font-medium text-slate-900 text-sm break-words">{booking.return_location}</p>
              </div>
            </div>
          </div>

          {/* Pricing & Payment */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h5 className="font-semibold text-indigo-900 text-sm sm:text-base">Payment Details</h5>
              </div>
              <Badge 
                variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}
                className={`text-xs font-medium ${
                  booking.payment_status === 'paid' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {booking.payment_status || 'pending'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Daily Rate</span>
                <span className="font-semibold text-slate-900">SAR {booking.daily_rate?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Days</span>
                <span className="font-semibold text-slate-900">{booking.total_days}</span>
              </div>
              <div className="border-t border-indigo-200 pt-2">
                <div className="flex items-center justify-between font-bold text-base sm:text-lg text-indigo-900">
                  <span>Total Amount</span>
                  <span>SAR {booking.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-100">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-amber-600 mr-2" />
                <h5 className="font-semibold text-amber-900 text-sm sm:text-base">Special Requests</h5>
              </div>
              <p className="text-amber-800 text-sm break-words">{booking.special_requests}</p>
            </div>
          )}

          {/* Action Buttons - Fixed layout */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {booking.booking_status === 'pending' && (
                  <>
                    <Button
                      onClick={() => onAcceptBooking(booking.id)}
                      disabled={isAcceptLoading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm text-sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onRejectBooking(booking.id)}
                      disabled={isRejectLoading}
                      className="flex-1 font-medium shadow-sm text-sm"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {booking.booking_status === 'active' && (
                  <Button
                    onClick={() => onStartProgress(booking.id)}
                    disabled={isStartLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm text-sm"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Trip
                  </Button>
                )}

                {booking.booking_status === 'return_requested' && (
                  <Button
                    onClick={() => onAcceptReturn(booking.id)}
                    disabled={isReturnLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm text-sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Return
                  </Button>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm"
                onClick={() => setIsInvoiceOpen(true)}
              >
                <FileText className="h-4 w-4" />
                <span>View Invoice</span>
              </Button>
            </div>
          </div>
        </CardContent>
        
        <BookingInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          booking={booking}
        />
      </Card>
    </div>
  );
};

export default BookingCard;
