
import React from 'react';
import { Users, Fuel, Settings, Calendar } from 'lucide-react';
import CarFeatures from './CarFeatures';

interface CarDetailsInfoProps {
  car: {
    name: string;
    brand: string;
    year: number;
    seats: number;
    fuel: string;
    transmission: string;
    features: string[];
    pricing: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  selectedPricing: 'daily' | 'weekly' | 'monthly';
}

const CarDetailsInfo = ({ car, selectedPricing }: CarDetailsInfoProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
          <p className="text-gray-600">{car.brand} • {car.year}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">SAR {car.pricing[selectedPricing]}</div>
          <div className="text-gray-600">per {selectedPricing.replace('ly', '')}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
          <span>{car.seats} Seats</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Fuel className="h-5 w-5 text-primary" />
          <span>{car.fuel}</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
          <span>{car.transmission}</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{car.year}</span>
        </div>
      </div>

      <CarFeatures features={car.features} />
    </div>
  );
};

export default CarDetailsInfo;
