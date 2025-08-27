
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Car } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface VendorCarsTableProps {
  cars: Car[];
}

export const VendorCarsTable: React.FC<VendorCarsTableProps> = ({ cars }) => {
  const isMobile = useIsMobile();

  const CarCard = ({ car }: { car: Car }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{car.name}</h3>
          <p className="text-sm text-gray-600">{car.brand} {car.model}</p>
        </div>
        <Badge variant={car.is_available ? "default" : "secondary"}>
          {car.is_available ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Year:</span>
          <span className="text-sm font-medium">{car.year}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Daily Rate:</span>
          <span className="text-sm font-medium text-green-600">SAR {car.daily_rate}/day</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Added:</span>
          <span className="text-sm">{new Date(car.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Management</CardTitle>
        <CardDescription>All cars registered under this vendor</CardDescription>
      </CardHeader>
      <CardContent>
        {cars.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No cars found for this vendor
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="space-y-4">
                {cars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car Details</TableHead>
                    <TableHead>Specifications</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map(car => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{car.name}</div>
                          <div className="text-sm text-gray-500">
                            {car.brand} {car.model}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Year: {car.year}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          SAR {car.daily_rate}/day
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={car.is_available ? "default" : "secondary"}>
                          {car.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(car.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
