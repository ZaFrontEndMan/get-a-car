import React from 'react';
import { Calendar, Car, User, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VendorBookingListViewProps {
  bookings: any[];
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onStartProgress: (id: string) => void;
  onAcceptReturn: (id: string) => void;
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  isStartLoading: boolean;
  isReturnLoading: boolean;
}

const VendorBookingListView = ({
  bookings,
  onAcceptBooking,
  onRejectBooking,
  onStartProgress,
  onAcceptReturn,
  isAcceptLoading,
  isRejectLoading,
  isStartLoading,
  isReturnLoading,
}: VendorBookingListViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'return_requested': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButtons = (booking: any) => {
    const status = booking.booking_status;
    
    switch (status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => onAcceptBooking(booking.id)}
              disabled={isAcceptLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
            <Button
              onClick={() => onRejectBooking(booking.id)}
              disabled={isRejectLoading}
              variant="destructive"
              size="sm"
            >
              Reject
            </Button>
          </div>
        );
      case 'active':
        return (
          <Button
            onClick={() => onStartProgress(booking.id)}
            disabled={isStartLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Trip
          </Button>
        );
      case 'return_requested':
        return (
          <Button
            onClick={() => onAcceptReturn(booking.id)}
            disabled={isReturnLoading}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
          >
            Accept Return
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                #{booking.booking_number}
              </div>
              <Badge className={getStatusColor(booking.booking_status)}>
                {booking.booking_status?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(booking.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">{booking.customer_name}</div>
                <div className="text-xs text-gray-500">{booking.customer_email}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">{booking.cars?.name}</div>
                <div className="text-xs text-gray-500">{booking.cars?.brand} {booking.cars?.model}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">
                  {new Date(booking.pickup_date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  to {new Date(booking.return_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">SAR {booking.total_amount}</div>
                <div className="text-xs text-gray-500">Total amount</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{booking.pickup_location}</span>
            </div>
            {getActionButtons(booking)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorBookingListView;