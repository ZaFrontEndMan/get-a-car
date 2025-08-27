
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Car, Clock, Shield } from 'lucide-react';

interface BookingCarInfoProps {
  car: any;
  pricingType: string;
  rentalDays: number;
  onAdjustDays: (increment: boolean) => void;
}

const BookingCarInfo = ({ car, pricingType, rentalDays, onAdjustDays }: BookingCarInfoProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative">
          <img 
            src={car.image} 
            alt={car.name} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md" 
          />
          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-2">
            <Car className="h-4 w-4" />
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-2">{car.brand}</p>
          <div className="flex items-center justify-center lg:justify-start gap-2 text-primary font-semibold">
            <Shield className="h-4 w-4" />
            <span className="text-sm sm:text-base">SAR {car.pricing[pricingType]} per day</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Rental Days</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAdjustDays(false)} 
                className="h-10 w-10 p-0 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                disabled={rentalDays <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="font-bold text-lg text-gray-900">{rentalDays}</span>
                <span className="text-sm text-gray-600 ml-1">days</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAdjustDays(true)} 
                className="h-10 w-10 p-0 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCarInfo;
