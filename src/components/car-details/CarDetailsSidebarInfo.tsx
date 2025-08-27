
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CarDetailsSidebarInfoProps {
  car: any;
}

const CarDetailsSidebarInfo = ({ car }: CarDetailsSidebarInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Car Details */}
      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <div className="font-medium">{car.type}</div>
            </div>
            <div>
              <span className="text-gray-600">Color:</span>
              <div className="font-medium">{car.color}</div>
            </div>
            <div>
              <span className="text-gray-600">License:</span>
              <div className="font-medium">{car.license_plate}</div>
            </div>
            {car.mileage_limit && (
              <div>
                <span className="text-gray-600">Daily Limit:</span>
                <div className="font-medium">{car.mileage_limit} KM</div>
              </div>
            )}
          </div>
          
          {car.deposit_amount > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm font-medium text-yellow-800">
                Deposit Required: {car.deposit_amount} SAR
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Info */}
      {car.vendors && (
        <Card>
          <CardHeader>
            <CardTitle>Rental Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">{car.vendors.name}</div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{car.vendors.email}</span>
                </div>
                {car.vendors.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{car.vendors.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branch Info */}
      {car.branches && (
        <Card>
          <CardHeader>
            <CardTitle>Pickup Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">{car.branches.name}</div>
              <div className="text-sm text-gray-600">{car.branches.address}</div>
              <div className="text-sm text-gray-600">{car.branches.city}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarDetailsSidebarInfo;
