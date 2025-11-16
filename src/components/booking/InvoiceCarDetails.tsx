
import React from 'react';
import LazyImage from '../ui/LazyImage';

interface InvoiceCarDetailsProps {
  car: any;
}

const InvoiceCarDetails = ({ car }: InvoiceCarDetailsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 px-3 sm:px-4 md:px-6">
      <div>
        <h5 className="text-sm font-semibold mb-2 sm:mb-3">Car details</h5>
        <div className="flex items-center gap-3 sm:gap-4">
          <LazyImage src={car.image} alt={car.name} className="w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 object-cover rounded-lg flex-shrink-0" />
          <div>
            <h6 className="text-sm font-medium">{car.name}</h6>
            <p className="text-xs text-gray-600">Hatchback car rental car</p>
          </div>
        </div>
        
        {/* Car Features */}
        <div className="grid grid-cols-1 gap-2 mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">5/5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">Automatic Transmission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">4 Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">4-5 Doors</span>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-sm font-semibold mb-2 sm:mb-3">Additional services</h5>
        <p className="text-xs text-gray-600 mb-2 sm:mb-3">Enhance your experience with unwind convenience</p>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">Air conditioning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">Child seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-xs">Navigation system</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCarDetails;
