
import React from 'react';
import { Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BookingsEmptyState = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6">
        <Car className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noBookings')}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{t('noBookingsDescription')}</p>
    </div>
  );
};

export default BookingsEmptyState;
