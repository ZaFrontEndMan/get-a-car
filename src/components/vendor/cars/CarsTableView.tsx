
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Star, Copy } from 'lucide-react';

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

interface CarsTableViewProps {
  cars: CarData[];
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
  isDeleting: boolean;
}

const CarsTableView = ({ cars, onEdit, onDelete, onDuplicate, onView, isDeleting }: CarsTableViewProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Brand & Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Fuel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Daily Rate</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[0]} 
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{car.name}</p>
                    {car.is_featured && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                        <Star className="h-2 w-2 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{car.brand} {car.model}</span>
              </TableCell>
              <TableCell>{car.year}</TableCell>
              <TableCell className="capitalize">{car.type}</TableCell>
              <TableCell>{car.seats}</TableCell>
              <TableCell className="capitalize">{car.fuel_type}</TableCell>
              <TableCell>
                <Badge variant={car.is_available ? 'default' : 'secondary'}>
                  {car.is_available ? 'Available' : 'Not Available'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-green-600">
                  SAR {car.daily_rate}/day
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(car)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(car)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate(car)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(car.id)}
                    disabled={isDeleting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarsTableView;
