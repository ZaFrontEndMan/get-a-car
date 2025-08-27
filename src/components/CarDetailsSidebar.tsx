
import React from 'react';
import PricingOptions from './PricingOptions';
import LocationPicker from './LocationPicker';
import AdditionalServices from './AdditionalServices';

interface Service {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface CarDetailsSidebarProps {
  car: {
    pricing: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    locations: string[];
  };
  selectedPricing: 'daily' | 'weekly' | 'monthly';
  onPricingSelect: (option: 'daily' | 'weekly' | 'monthly') => void;
  additionalServices: Service[];
  selectedServices: string[];
  onServicesChange: (selected: string[]) => void;
  selectedPickup?: string;
  selectedDropoff?: string;
  onPickupChange: (location: string) => void;
  onDropoffChange: (location: string) => void;
  totalPrice: number;
  onBookNow: () => void;
}

const CarDetailsSidebar = ({
  car,
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
}: CarDetailsSidebarProps) => {
  return (
    <div className="space-y-6">
      <PricingOptions 
        pricing={car.pricing}
        selected={selectedPricing}
        onSelect={onPricingSelect}
      />

      <LocationPicker 
        locations={car.locations}
        selectedPickup={selectedPickup}
        selectedDropoff={selectedDropoff}
        onPickupChange={onPickupChange}
        onDropoffChange={onDropoffChange}
      />

      <AdditionalServices 
        services={additionalServices}
        selected={selectedServices}
        onSelectionChange={onServicesChange}
      />

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="text-2xl font-bold text-primary">SAR {totalPrice}</span>
        </div>
        <button
          onClick={onBookNow}
          className="w-full gradient-primary text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Book Now
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Free cancellation up to 24 hours before pickup
        </p>
      </div>
    </div>
  );
};

export default CarDetailsSidebar;
