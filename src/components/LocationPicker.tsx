
import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LocationPickerProps {
  locations: string[];
  selectedPickup?: string;
  selectedDropoff?: string;
  onPickupChange: (location: string) => void;
  onDropoffChange: (location: string) => void;
}

const LocationPicker = ({ 
  locations, 
  selectedPickup, 
  selectedDropoff, 
  onPickupChange, 
  onDropoffChange 
}: LocationPickerProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 rtl:gap-reverse">
        <MapPin className="h-5 w-5 text-primary" />
        <span>{t('pickupAndDropoff')}</span>
      </h3>
      
      <div className="space-y-6">
        {/* Pickup Location */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('pickupLocation')}</h4>
          <div className="space-y-2">
            {locations.map((location, index) => (
              <div key={`pickup-${index}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                <input
                  type="radio"
                  name="pickupLocation"
                  value={location}
                  checked={selectedPickup === location}
                  onChange={() => onPickupChange(location)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 mr-3 rtl:ml-3"
                />
                <span className="text-gray-900">{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dropoff Location */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('dropoffLocation')}</h4>
          <div className="space-y-2">
            {locations.map((location, index) => (
              <div key={`dropoff-${index}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                <input
                  type="radio"
                  name="dropoffLocation"
                  value={location}
                  checked={selectedDropoff === location}
                  onChange={() => onDropoffChange(location)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 mr-3 rtl:ml-3"
                />
                <span className="text-gray-900">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
