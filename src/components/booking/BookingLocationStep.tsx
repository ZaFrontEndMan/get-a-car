
import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingLocationStepProps {
  bookingData: {
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
  };
  onInputChange: (field: string, value: string) => void;
  pickupLocations: string[];
  dropoffLocations: string[];
  selectedPickup?: string;
  selectedDropoff?: string;
}

const BookingLocationStep = ({ 
  bookingData, 
  onInputChange, 
  pickupLocations, 
  dropoffLocations,
  selectedPickup,
  selectedDropoff
}: BookingLocationStepProps) => {
  const { t } = useLanguage();

  // Set default locations when they are provided
  useEffect(() => {
    if (selectedPickup && !bookingData.pickupLocation) {
      onInputChange('pickupLocation', selectedPickup);
    }
    if (selectedDropoff && !bookingData.returnLocation) {
      onInputChange('returnLocation', selectedDropoff);
    }
  }, [selectedPickup, selectedDropoff, bookingData.pickupLocation, bookingData.returnLocation, onInputChange]);

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 rtl:gap-reverse mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold">{t('pickupAndDropoff')}</h3>
      </div>
      
      {/* Show selected pickup/dropoff if provided */}
      {(selectedPickup || selectedDropoff) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm mb-2 text-blue-800">{t('preSelectedLocations')}:</h4>
          {selectedPickup && (
            <div className="flex items-center gap-2 mb-1 rtl:flex-row-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">{t('pickup')}: {selectedPickup}</span>
            </div>
          )}
          {selectedDropoff && (
            <div className="flex items-center gap-2 rtl:flex-row-reverse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">{t('dropoff')}: {selectedDropoff}</span>
            </div>
          )}
          <p className="text-xs text-blue-600 mt-2">{t('canChangeLocations')}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('pickupDate')}</label>
          <Input
            type="date"
            value={bookingData.pickupDate}
            onChange={(e) => onInputChange('pickupDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('returnDate')}</label>
          <Input
            type="date"
            value={bookingData.returnDate}
            onChange={(e) => onInputChange('returnDate', e.target.value)}
            min={bookingData.pickupDate}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('pickupLocation')}</label>
          <Select 
            value={bookingData.pickupLocation} 
            onValueChange={(value) => onInputChange('pickupLocation', value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('selectPickupLocation')} />
            </SelectTrigger>
            <SelectContent>
              {pickupLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('returnLocation')}</label>
          <Select 
            value={bookingData.returnLocation} 
            onValueChange={(value) => onInputChange('returnLocation', value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('selectDropoffLocation')} />
            </SelectTrigger>
            <SelectContent>
              {dropoffLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BookingLocationStep;
