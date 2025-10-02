
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Fuel,
  Settings,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';

interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  fuel_type: string;
  transmission: string;
  daily_rate: number;
  weekly_rate?: number;
  monthly_rate?: number;
  is_available: boolean;
  is_featured: boolean;
  images: string[];
  features: string[];
  pickup_locations: string[];
  condition: string;
  color?: string;
  license_plate?: string;
  mileage_limit?: number;
  deposit_amount?: number;
}

interface CarMobileCardProps {
  car: CarData;
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
}

const CarMobileCard = ({ car, onEdit, onDelete, onDuplicate, onView }: CarMobileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with Image */}
          <div className="flex gap-3">
            <div className="w-20 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {car.images && car.images.length > 0 ? (
                <img 
                  src={car.images[0]} 
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg truncate">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">{car.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={car.is_available ? 'default' : 'secondary'}>
                      {car.is_available ? 'Available' : 'Not Available'}
                    </Badge>
                    {car.is_featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    SAR {car.daily_rate}/day
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs mt-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        More
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span>{car.seats} seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3 text-gray-400" />
              <span className="capitalize">{car.fuel_type}</span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Type</p>
                  <p className="text-gray-600 capitalize">{car.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Transmission</p>
                  <p className="text-gray-600 capitalize">{car.transmission}</p>
                </div>
              </div>

              {(car.color || car.license_plate) && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {car.color && (
                    <div>
                      <p className="font-medium text-gray-700">Color</p>
                      <p className="text-gray-600 capitalize">{car.color}</p>
                    </div>
                  )}
                  {car.license_plate && (
                    <div>
                      <p className="font-medium text-gray-700">License Plate</p>
                      <p className="text-gray-600">{car.license_plate}</p>
                    </div>
                  )}
                </div>
              )}

              {(car.weekly_rate || car.monthly_rate) && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">Pricing</p>
                  <div className="flex items-center gap-4">
                    {car.weekly_rate && (
                      <span className="text-gray-600">SAR {car.weekly_rate}/week</span>
                    )}
                    {car.monthly_rate && (
                      <span className="text-gray-600">SAR {car.monthly_rate}/month</span>
                    )}
                  </div>
                </div>
              )}

              {car.features && car.features.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{car.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {car.pickup_locations && car.pickup_locations.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">Pickup Locations</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {car.pickup_locations.slice(0, 2).join(', ')}
                      {car.pickup_locations.length > 2 && ` +${car.pickup_locations.length - 2} more`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(car)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>View</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(car)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(car)}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>Duplicate</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(car.id)}
              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarMobileCard;
