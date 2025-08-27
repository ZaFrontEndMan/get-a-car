
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useOfferDetailsState = () => {
  const { user } = useAuth();
  const [selectedPricing, setSelectedPricing] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPickup, setSelectedPickup] = useState('');
  const [selectedDropoff, setSelectedDropoff] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const calculateTotalPrice = (offer: any, additionalServices: any[]) => {
    if (!offer) return 0;
    
    // Get base price (original price without discount)
    const basePrice = offer.car.originalPricing[selectedPricing];
    
    // Calculate additional services price
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    
    // Calculate discount amount
    const discountAmount = basePrice * (offer.discountPercentage / 100);
    
    // Total = Rental Period + Additional Services - Discount
    const total = basePrice + servicesPrice - discountAmount;
    
    return Math.max(0, total); // Ensure total is never negative
  };

  const handleBookNow = () => {
    if (!user) {
      setIsLoginOpen(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsBookingOpen(true);
  };

  return {
    selectedPricing,
    setSelectedPricing,
    selectedServices,
    setSelectedServices,
    selectedPickup,
    setSelectedPickup,
    selectedDropoff,
    setSelectedDropoff,
    isBookingOpen,
    setIsBookingOpen,
    isLoginOpen,
    setIsLoginOpen,
    calculateTotalPrice,
    handleBookNow,
    handleLoginSuccess
  };
};
