
import React from 'react';

interface InvoiceTableProps {
  car: any;
  rentalDays: number;
  pricingType: string;
  selectedServices: string[];
}

const InvoiceTable = ({ car, rentalDays, pricingType, selectedServices }: InvoiceTableProps) => {
  const getServiceName = (serviceId: string) => {
    const services = {
      'insurance': 'Full protection',
      'gps': 'Navigation system',
      'driver': 'Additional driver',
      'delivery': 'Car delivery'
    };
    return services[serviceId as keyof typeof services] || serviceId;
  };

  const getServicePrice = (serviceId: string) => {
    const services = {
      'insurance': 500,
      'gps': 0,
      'driver': 500,
      'delivery': 500
    };
    return services[serviceId as keyof typeof services] || 0;
  };

  const basePrice = car.pricing[pricingType] * rentalDays;

  return (
    <div className="mb-4 sm:mb-6 px-3 sm:px-4 md:px-6">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[400px] sm:min-w-0">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Description</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium">Duration</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Price</th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-200">
                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm">Car rental charge</td>
                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center">{rentalDays} days</td>
                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{car.pricing[pricingType]} SAR/day</td>
                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-medium">{basePrice.toLocaleString()} SAR</td>
              </tr>
              {selectedServices.map(serviceId => (
                <tr key={serviceId} className="border-b border-gray-200">
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm">{getServiceName(serviceId)}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center">-</td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">{getServicePrice(serviceId)} SAR</td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-medium">{getServicePrice(serviceId)} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
