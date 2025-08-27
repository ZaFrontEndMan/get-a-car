
import React from 'react';
import { Shield } from 'lucide-react';

interface BookingServicesDisplayProps {
  selectedServices: string[];
  getServiceDetails: () => Array<{ id: string; name: string; price: number }>;
}

const BookingServicesDisplay = ({ selectedServices, getServiceDetails }: BookingServicesDisplayProps) => {
  if (selectedServices.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold">Selected Additional Services</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {getServiceDetails().map(service => (
          <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
            <span className="text-primary font-bold">
              +SAR {service.price}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Services Total:</span>
          <span className="font-bold text-lg text-primary">
            SAR {getServiceDetails().reduce((total, service) => total + service.price, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingServicesDisplay;
