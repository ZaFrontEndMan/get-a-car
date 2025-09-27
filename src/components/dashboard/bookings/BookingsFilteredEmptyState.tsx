
import React from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { bookingStatusLabels } from '../BookingsList';

interface BookingsFilteredEmptyStateProps {
  statusFilter: string;
}

const BookingsFilteredEmptyState = ({ statusFilter }: BookingsFilteredEmptyStateProps) => {
  const { t, language } = useLanguage();
  const statusLabel = language === 'ar' ? bookingStatusLabels[statusFilter as any] : statusFilter;
  return (
    <div className="text-center py-12">
      <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no')} {statusLabel} {t('bookings')}</h3>
      <p className="text-gray-500">{t('noBookingsFoundWithSelectedStatus')}</p>
    </div>
  );
};

export default BookingsFilteredEmptyState;
