
import React from 'react';
import { X, Car, Fuel, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CarDetailsModalProps {
  car: any;
  onClose: () => void;
}

const CarDetailsModal = ({ car, onClose }: CarDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{car.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900">Brand & Model</h4>
              <p className="text-gray-600">{car.brand} {car.model}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Year</h4>
              <p className="text-gray-600">{car.year}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Type</h4>
              <p className="text-gray-600">{car.type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Fuel Type</h4>
              <p className="text-gray-600">{car.fuel_type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Transmission</h4>
              <p className="text-gray-600">{car.transmission}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Seats</h4>
              <p className="text-gray-600">{car.seats}</p>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Daily Rate</div>
                <div className="text-lg font-semibold text-primary">{car.daily_rate} SAR</div>
              </div>
              {car.weekly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Weekly Rate</div>
                  <div className="text-lg font-semibold text-primary">{car.weekly_rate} SAR</div>
                </div>
              )}
              {car.monthly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Monthly Rate</div>
                  <div className="text-lg font-semibold text-primary">{car.monthly_rate} SAR</div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vehicle Details</h4>
              <div className="space-y-2">
                {car.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span>{car.color}</span>
                  </div>
                )}
                {car.license_plate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">License Plate:</span>
                    <span>{car.license_plate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <Badge variant="outline">{car.condition}</Badge>
                </div>
                {car.mileage_limit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Mileage Limit:</span>
                    <span>{car.mileage_limit} KM</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <Badge variant={car.is_available ? "default" : "secondary"}>
                    {car.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <Badge variant={car.is_featured ? "default" : "outline"}>
                    {car.is_featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {car.deposit_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit:</span>
                    <span>{car.deposit_amount} SAR</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Branch Info */}
          {car.branches && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Branch</h4>
              <p className="text-gray-600">{car.branches.name}</p>
            </div>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarDetailsModal;
