
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingCarCardProps {
  car: {
    id: string;
    name: string;
    brand: string;
    image: string;
    daily_rate: number;
  };
  rentalDays: number;
  onAdjustDays: (increment: boolean) => void;
}

const BookingCarCard = ({ car, rentalDays, onAdjustDays }: BookingCarCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse flex-1">
          <img 
            src={car.image} 
            alt={car.name}
            className="w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg truncate">{car.name}</h3>
            <p className="text-gray-600 text-sm">{car.brand}</p>
            <p className="text-primary font-semibold text-sm sm:text-base">
              {t('currency')} {car.daily_rate} {t('perDay')}
            </p>
          </div>
        </div>
        
        {/* Rental Days Counter - Mobile Optimized with RTL support */}
        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-center sm:flex-col sm:space-y-2">
            <span className="text-xs sm:text-sm text-gray-600">{t('rentalDays')}</span>
            <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
              <button 
                onClick={() => onAdjustDays(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <span className="font-bold text-lg sm:text-xl min-w-[2rem] text-center">{rentalDays}</span>
              <button 
                onClick={() => onAdjustDays(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCarCard;
