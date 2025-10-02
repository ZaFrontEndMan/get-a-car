
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CarDetailsBookingCardProps {
  car: any;
  onBookNow: () => void;
}

const CarDetailsBookingCard = ({ car, onBookNow }: CarDetailsBookingCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Car</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant={car.is_available ? "default" : "secondary"}>
            {car.is_available ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge variant="outline">{car.condition}</Badge>
        </div>
        
        <Button 
          className="w-full" 
          disabled={!car.is_available}
          onClick={onBookNow}
        >
          {car.is_available ? 'Book Now' : 'Not Available'}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Free cancellation up to 24 hours before pickup
        </p>
      </CardContent>
    </Card>
  );
};

export default CarDetailsBookingCard;
