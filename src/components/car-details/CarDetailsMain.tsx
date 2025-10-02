
import React from 'react';
import { Calendar, Users, Fuel, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CarDetailsMainProps {
  car: any;
}

const CarDetailsMain = ({ car }: CarDetailsMainProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        {car.images && car.images.length > 0 && (
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-t-lg"
          />
        )}
        
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-6">
            <div className="mb-3 md:mb-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">{car.brand} {car.model} • {car.year}</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">{car.daily_rate} SAR</div>
              <div className="text-gray-600 text-sm md:text-base">per day</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-1 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-xs md:text-sm lg:text-base truncate">{car.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
              <Fuel className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-xs md:text-sm lg:text-base truncate">{car.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
              <Settings className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-xs md:text-sm lg:text-base truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-xs md:text-sm lg:text-base">{car.year}</span>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600">Daily</div>
                <div className="text-sm md:text-lg font-semibold text-primary">{car.daily_rate} SAR</div>
              </div>
              {car.weekly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600">Weekly</div>
                  <div className="text-sm md:text-lg font-semibold text-primary">{car.weekly_rate} SAR</div>
                </div>
              )}
              {car.monthly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs md:text-sm text-gray-600">Monthly</div>
                  <div className="text-sm md:text-lg font-semibold text-primary">{car.monthly_rate} SAR</div>
                </div>
              )}
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Features</h4>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs md:text-sm">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarDetailsMain;
