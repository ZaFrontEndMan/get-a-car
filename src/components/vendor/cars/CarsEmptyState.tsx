
import React from 'react';
import { Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CarsEmptyStateProps {
  currentUser: any;
  onAddCar: () => void;
  error?: any;
}

const CarsEmptyState = ({ currentUser, onAddCar, error }: CarsEmptyStateProps) => {
  if (!currentUser) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to manage cars</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading cars</h3>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cars yet</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first car</p>
        <Button onClick={onAddCar}>Add First Car</Button>
      </CardContent>
    </Card>
  );
};

export default CarsEmptyState;
