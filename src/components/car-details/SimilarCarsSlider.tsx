import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LazyImage from '../ui/LazyImage';
interface SimilarCarsSliderProps {
  currentCarId: string;
  carType?: string;
  priceRange?: [number, number];
  locations?: string[];
}
const SimilarCarsSlider = ({
  currentCarId,
  carType,
  priceRange,
  locations
}: SimilarCarsSliderProps) => {
  const {
    data: similarCars,
    isLoading
  } = useQuery({
    queryKey: ['similar-cars', currentCarId, carType, priceRange, locations],
    queryFn: async () => {
      let query = supabase.from('cars').select(`
          id,
          name,
          brand,
          model,
          daily_rate,
          images,
          type,
          pickup_locations,
          vendors (
            name
          )
        `).eq('is_available', true).neq('id', currentCarId).limit(6);

      // Filter by type if provided
      if (carType) {
        query = query.eq('type', carType);
      }

      // Filter by price range if provided
      if (priceRange) {
        query = query.gte('daily_rate', priceRange[0]).lte('daily_rate', priceRange[1]);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      let filteredData = data || [];

      // Client-side filtering for locations if provided
      if (locations && locations.length > 0) {
        filteredData = filteredData.filter(car => {
          if (!car.pickup_locations) return false;
          return locations.some(location => car.pickup_locations.includes(location));
        });
      }
      return filteredData;
    }
  });
  if (isLoading) {
    return <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Cars</h3>
        <div className="flex gap-4">
          {[1, 2, 3].map(i => <div key={i} className="w-80 h-48 bg-gray-200 rounded-lg animate-pulse" />)}
        </div>
      </div>;
  }
  if (!similarCars || similarCars.length === 0) {
    return null;
  }
  return <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Cars</h3>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {similarCars.map(car => <CarouselItem key={car.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Link to={`/cars/${car.id}`}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                      <LazyImage src={car.images?.[0] || '/placeholder.svg'} alt={car.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-gray-900 truncate">
                        {car.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600">
                        {car.brand} {car.model}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{car.type}</Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {car.daily_rate} SAR
                          </div>
                          <div className="text-xs text-gray-500">per day</div>
                        </div>
                      </div>
                      
                      {car.vendors && <p className="text-xs text-gray-500 truncate">
                          by {car.vendors.name}
                        </p>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious className="px-0 mx-[24px]" />
        <CarouselNext className="mx-[26px]" />
      </Carousel>
    </div>;
};
export default SimilarCarsSlider;