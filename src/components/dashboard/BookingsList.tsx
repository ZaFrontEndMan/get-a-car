
import React, { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useBookingReturn } from '../../hooks/useBookingReturn';
import { useBookingViewMode } from '../../hooks/useBookingViewMode';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingsHeader from './bookings/BookingsHeader';
import BookingsLoadingState from './bookings/BookingsLoadingState';
import BookingsEmptyState from './bookings/BookingsEmptyState';
import BookingsFilteredEmptyState from './bookings/BookingsFilteredEmptyState';
import BookingGridView from './bookings/BookingGridView';
import BookingListView from './bookings/BookingListView';
import BookingTableView from './bookings/BookingTableView';
import BookingStatusFilter from '@/components/vendor/bookings/BookingStatusFilter';
import { getStatusCounts } from '@/utils/bookingUtils';

type BookingStatus = 'pending' | 'confirmed' | 'active' | 'in_progress' | 'return_requested' | 'completed' | 'cancelled';

const BookingsList: React.FC = () => {
  const { bookings, isLoading } = useBookings();
  const { handleReturnCar, isReturning } = useBookingReturn();
  const { viewMode, setViewMode } = useBookingViewMode();
  const { language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'all' || booking.booking_status === statusFilter
  );

  const statusCounts = getStatusCounts(bookings);

  if (isLoading) {
    return <BookingsLoadingState />;
  }

 
  const renderContent = () => {
    const commonProps = {
      bookings: filteredBookings,
      onReturnCar: handleReturnCar,
      isReturning
    };

    // Force grid view on mobile
    const isMobile = window.innerWidth < 768;
    const currentViewMode = isMobile ? 'grid' : viewMode;

    switch (currentViewMode) {
      case 'grid':
        return <BookingGridView {...commonProps} />;
      case 'list':
        return <BookingListView {...commonProps} />;
      case 'table':
        return <BookingTableView {...commonProps} />;
      default:
        return <BookingGridView {...commonProps} />;
    }
  };

  return (
    <div className={language === 'ar' ? 'text-right' : 'text-left'}>
      <BookingsHeader 
        bookingsCount={bookings.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mb-6">
        <BookingStatusFilter
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          totalBookings={bookings.length}
        />
      </div>
      
      {renderContent()}

      {filteredBookings.length === 0 && statusFilter !== 'all' && (
        <BookingsFilteredEmptyState statusFilter={statusFilter} />
      )}
    </div>
  );
};

export default BookingsList;
