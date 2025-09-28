
import React from 'react';
import BookingCard from './BookingCard';
import VendorBookingMobileCard from './VendorBookingMobileCard';

interface Booking {
  id: number;
  booking_number: number;
  booking_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_amount: number;
  total_days: number;
  daily_rate: number;
  payment_status: string;
  special_requests: string;
  cars: Array<{
    id: number;
    name: string;
    images: string[];
    daily_rate: number;
    total_amount: number;
  }>;
}

interface VendorBookingGridViewProps {
  bookings: Booking[];
  onAcceptBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onStartProgress: (id: string) => void;
  onAcceptReturn: (id: string) => void;
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  isStartLoading: boolean;
  isReturnLoading: boolean;
}

const VendorBookingGridView = ({ 
  bookings, 
  onAcceptBooking, 
  onRejectBooking, 
  onStartProgress, 
  onAcceptReturn,
  isAcceptLoading,
  isRejectLoading,
  isStartLoading,
  isReturnLoading
}: VendorBookingGridViewProps) => {
  return (
    <div className="space-y-4">
      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <BookingCard 
            key={booking.id} 
            booking={booking}
            onAcceptBooking={onAcceptBooking}
            onRejectBooking={onRejectBooking}
            onStartProgress={onStartProgress}
            onAcceptReturn={onAcceptReturn}
            isAcceptLoading={isAcceptLoading}
            isRejectLoading={isRejectLoading}
            isStartLoading={isStartLoading}
            isReturnLoading={isReturnLoading}
          />
        ))}
      </div>
      
      {/* Mobile Stack View */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <VendorBookingMobileCard 
            key={booking.id} 
            booking={booking}
          />
        ))}
      </div>
    </div>
  );
};

export default VendorBookingGridView;
