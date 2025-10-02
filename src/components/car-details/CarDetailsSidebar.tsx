
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CarDetailsSidebarProps {
  car: any;
  additionalServices?: any[];
  onBookNow: (selectedServices: string[], selectedPickup: string, selectedDropoff: string, totalPrice: number) => void;
}

const CarDetailsSidebar = ({
  car,
  additionalServices = [],
  onBookNow
}: CarDetailsSidebarProps) => {
  const { t } = useLanguage();
  const [selectedPricing, setSelectedPricing] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedPickup, setSelectedPickup] = React.useState('');
  const [selectedDropoff, setSelectedDropoff] = React.useState('');
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const pricingOptions = [
    {
      key: 'daily' as const,
      label: t('daily'),
      price: car.daily_rate,
      savings: null
    },
    {
      key: 'weekly' as const,
      label: t('weekly'),
      price: car.weekly_rate || car.daily_rate * 7,
      savings: '5%'
    },
    {
      key: 'monthly' as const,
      label: t('monthly'),
      price: car.monthly_rate || car.daily_rate * 30,
      savings: '15%'
    }
  ];

  // Use pickup and dropoff locations from the car data
  const pickupLocations = car.pickup_locations || ['Riyadh City Center', 'King Khalid Airport', 'Al Olaya District'];
  const dropoffLocations = car.dropoff_locations || ['Riyadh City Center', 'King Khalid Airport', 'Al Olaya District'];

  const calculateTotalPrice = () => {
    const basePrice = pricingOptions.find(p => p.key === selectedPricing)?.price || car.daily_rate;
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + servicesPrice;
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handleBookNow = () => {
    const totalPrice = calculateTotalPrice();
    console.log('CarDetailsSidebar - Booking with:', {
      selectedServices,
      selectedPickup,
      selectedDropoff,
      totalPrice
    });
    onBookNow(selectedServices, selectedPickup, selectedDropoff, totalPrice);
  };

  return (
    <div className="space-y-4">
      {/* Pricing Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('selectRentalPeriod')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pricingOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedPricing(option.key)}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedPricing === option.key
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                  {option.savings && (
                    <div className="text-xs text-green-600">{t('save')} {option.savings}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-primary">{t('currency')} {option.price}</div>
                  <div className="text-xs text-gray-600">
                    {t('per')} {option.key === 'daily' ? t('day') : option.key === 'weekly' ? t('week') : t('month')}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Pickup & Dropoff */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {t('pickupAndDropoff')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pickup Location */}
          <div>
            <h4 className="font-medium mb-2 text-sm">{t('pickupLocation')}</h4>
            <div className="space-y-2">
              {pickupLocations.slice(0, 3).map((location, index) => (
                <div key={`pickup-${index}`} className="flex items-center">
                  <input
                    type="radio"
                    name="pickupLocation"
                    value={location}
                    checked={selectedPickup === location}
                    onChange={() => setSelectedPickup(location)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 mr-3"
                  />
                  <span className="text-xs text-gray-700 mx-2 flex-1 truncate">{location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dropoff Location */}
          <div>
            <h4 className="font-medium mb-2 text-sm">{t('dropoffLocation')}</h4>
            <div className="space-y-2">
              {dropoffLocations.slice(0, 3).map((location, index) => (
                <div key={`dropoff-${index}`} className="flex items-center">
                  <input
                    type="radio"
                    name="dropoffLocation"
                    value={location}
                    checked={selectedDropoff === location}
                    onChange={() => setSelectedDropoff(location)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 mr-3"
                  />
                  <span className="text-xs text-gray-700 mx-2 flex-1 truncate">{location}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            {t('additionalServices')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {false ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <span className="text-xs text-gray-600 mt-2">{t('loadingServices')}</span>
            </div>
          ) : additionalServices.length > 0 ? (
            additionalServices
              .filter(service => service.is_active)
              .slice(0, 3)
              .map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-gray-900 text-sm mx-2 block truncate">{service.name}</span>
                      {service.description && (
                        <p className="text-xs text-gray-600 truncate">{service.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-primary font-semibold text-sm flex-shrink-0 ml-2">+{t('currency')} {service.price}</span>
                </div>
              ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t('noAdditionalServices')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Price & Book Button */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">{t('totalPrice')}:</span>
              <span className="text-xl font-bold text-primary">{t('currency')} {calculateTotalPrice()}</span>
            </div>
            <Button
              onClick={handleBookNow}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold text-sm"
              disabled={!car.is_available}
            >
              {car.is_available ? t('bookNow') : t('notAvailable')}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              {t('freeCancellation')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarDetailsSidebar;
