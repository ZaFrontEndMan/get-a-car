
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PricingOptions from './PricingOptions';
import { Plus } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  selected: boolean;
}

interface OfferDetailsSidebarProps {
  offer: {
    car: {
      pricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
      originalPricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
    };
    locations: string[];
    dropoffLocations?: string[];
    discount: string;
    discountPercentage: number;
  };
  selectedPricing: 'daily' | 'weekly' | 'monthly';
  onPricingSelect: (option: 'daily' | 'weekly' | 'monthly') => void;
  additionalServices: Service[];
  selectedServices: string[];
  onServicesChange: (selected: string[]) => void;
  selectedPickup: string;
  selectedDropoff: string;
  onPickupChange: (location: string) => void;
  onDropoffChange: (location: string) => void;
  totalPrice: number;
  onBookNow: () => void;
}

const OfferDetailsSidebar = ({
  offer,
  selectedPricing,
  onPricingSelect,
  additionalServices,
  selectedServices,
  onServicesChange,
  selectedPickup,
  selectedDropoff,
  onPickupChange,
  onDropoffChange,
  totalPrice,
  onBookNow
}: OfferDetailsSidebarProps) => {
  const { t } = useLanguage();

  // Calculate pricing components
  const basePrice = offer.car.pricing[selectedPricing];
  const originalPrice = offer.car.originalPricing[selectedPricing];
  const discountAmount = originalPrice - basePrice;
  
  const servicesPrice = selectedServices.reduce((total, serviceId) => {
    const service = additionalServices.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  // Total = Rental Period + Additional Services - Discount
  const calculatedTotal = originalPrice + servicesPrice - discountAmount;

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter(id => id !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  console.log('OfferDetailsSidebar - Additional Services:', additionalServices);
  console.log('OfferDetailsSidebar - Selected Services:', selectedServices);

  return (
    <div className="space-y-6">
      {/* Pricing Options */}
      <PricingOptions 
        pricing={offer.car.pricing}
        selected={selectedPricing}
        onSelect={onPricingSelect}
      />

      {/* Location Picker */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <span>{t('pickupAndDropoff')}</span>
        </h3>
        
        <div className="space-y-6">
          {/* Pickup Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('pickupLocation')}</h4>
            <div className="space-y-2">
              {offer.locations.map((location, index) => (
                <div key={`pickup-${index}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <input
                    type="radio"
                    name="pickupLocation"
                    value={location}
                    checked={selectedPickup === location}
                    onChange={() => onPickupChange(location)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 ml-3 rtl:mr-3"
                  />
                  <span className="text-gray-900 px-3">{location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dropoff Location */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('dropoffLocation')}</h4>
            <div className="space-y-2">
              {(offer.dropoffLocations || offer.locations).map((location, index) => (
                <div key={`dropoff-${index}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                  <input
                    type="radio"
                    name="dropoffLocation"
                    value={location}
                    checked={selectedDropoff === location}
                    onChange={() => onDropoffChange(location)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 ml-3 rtl:mr-3"
                  />
                  <span className="text-gray-900 px-3">{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <Plus className="h-5 w-5 text-primary" />
          <span>{t('additionalServices')}</span>
        </h3>
        
        <div className="space-y-3">
          {additionalServices && additionalServices.length > 0 ? (
            additionalServices.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900 px-[7px]">{service.name}</span>
                    {service.description && (
                      <p className="text-xs text-gray-600 px-[7px]">{service.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-primary font-semibold">+{t('currency')} {service.price}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t('noAdditionalServices')}
            </div>
          )}
        </div>
      </div>

      {/* Total & Book Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('originalPrice')}:</span>
            <span className="text-sm font-medium">{t('currency')} {originalPrice}</span>
          </div>
          
          {servicesPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Additional Services:</span>
              <span className="text-sm font-medium">+{t('currency')} {servicesPrice}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('discount')} ({offer.discount}):</span>
            <span className="text-sm text-green-600">-{t('currency')} {discountAmount}</span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-2xl font-bold text-primary">{t('currency')} {calculatedTotal}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onBookNow}
          className="w-full gradient-primary text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {t('bookThisOffer')}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {t('freeCancellation')}
        </p>
      </div>
    </div>
  );
};

export default OfferDetailsSidebar;
