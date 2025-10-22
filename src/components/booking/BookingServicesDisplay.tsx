import React from "react";
import { Shield } from "lucide-react";

interface BookingServicesDisplayProps {
  selectedServices: string[];
  getServiceDetails: () => Array<{ id: string; name: string; price: number }>;
}

const BookingServicesDisplay = ({
  selectedServices,
  getServiceDetails,
  formattedPricing,
}: BookingServicesDisplayProps) => {
  if (selectedServices.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold">
          Selected Additional Services
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <span className="text-sm font-medium animate-in zoom-in-50 duration-300 delay-200">
          +{formattedPricing.servicesPrice}
        </span>
      </div>
    </div>
  );
};

export default BookingServicesDisplay;
