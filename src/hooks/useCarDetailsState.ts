
import { useState } from 'react';

export const useCarDetailsState = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<string>('');
  const [selectedDropoff, setSelectedDropoff] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const additionalServices = [
    { id: 'insurance', name: 'Full Insurance', price: 50, selected: false },
    { id: 'gps', name: 'GPS Navigation', price: 25, selected: false },
    { id: 'driver', name: 'Additional Driver', price: 200, selected: false },
    { id: 'delivery', name: 'Car Delivery', price: 75, selected: false }
  ];

  const locations = [
    'Riyadh City Center',
    'King Khalid International Airport', 
    'Al Olaya District',
    'King Abdulaziz Road',
    'Diplomatic Quarter',
    'Al Malaz District'
  ];

  const calculateTotalPrice = (car: any) => {
    if (!car) return 0;
    const basePrice = car.daily_rate;
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + servicesPrice;
  };

  const handleBookNow = (services: string[], pickup: string, dropoff: string, price: number) => {
    console.log('useCarDetailsState - handleBookNow called with:', {
      services,
      pickup,
      dropoff,
      price
    });
    setSelectedServices(services);
    setSelectedPickup(pickup);
    setSelectedDropoff(dropoff);
    setTotalPrice(price);
    setIsBookingOpen(true);
  };

  const handleServicesChange = (services: string[]) => {
    setSelectedServices(services);
  };

  const handlePickupChange = (location: string) => {
    setSelectedPickup(location);
  };

  const handleDropoffChange = (location: string) => {
    setSelectedDropoff(location);
  };

  return {
    isBookingOpen,
    setIsBookingOpen,
    selectedPricing,
    setSelectedPricing,
    selectedServices,
    selectedPickup,
    selectedDropoff,
    totalPrice,
    additionalServices,
    locations,
    calculateTotalPrice,
    handleBookNow,
    handleServicesChange,
    handlePickupChange,
    handleDropoffChange
  };
};
