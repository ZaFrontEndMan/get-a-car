
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CarCard from './CarCard';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface SimilarCarsSliderProps {
  currentCarId: string;
}

const SimilarCarsSlider = ({ currentCarId }: SimilarCarsSliderProps) => {
  const { t } = useLanguage();
  const [similarOffers, setSimilarOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarOffers = async () => {
      try {
        setLoading(true);
        
        // Fetch similar offers (excluding the current car)
        const { data: offersData, error } = await supabase
          .from('offers')
          .select(`
            id,
            title,
            discount_percentage,
            cars (
              id,
              name,
              brand,
              model,
              images,
              daily_rate,
              weekly_rate,
              monthly_rate,
              seats,
              fuel_type,
              transmission,
              features
            )
          `)
          .neq('car_id', currentCarId)
          .eq('status', 'published')
          .limit(4);

        if (error) {
          console.error('Error fetching similar offers:', error);
          return;
        }

        // Transform the data to match CarCard format
        const transformedOffers = offersData?.map(offer => ({
          id: offer.cars.id,
          name: offer.cars.name,
          brand: offer.cars.brand,
          image: offer.cars.images?.[0] || '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png',
          price: Math.round(offer.cars.daily_rate * (1 - offer.discount_percentage / 100)),
          weeklyPrice: Math.round((offer.cars.weekly_rate || offer.cars.daily_rate * 7) * (1 - offer.discount_percentage / 100)),
          monthlyPrice: Math.round((offer.cars.monthly_rate || offer.cars.daily_rate * 30) * (1 - offer.discount_percentage / 100)),
          rating: 4.7, // Default rating
          features: offer.cars.features || [],
          seats: offer.cars.seats,
          fuel: offer.cars.fuel_type,
          transmission: offer.cars.transmission,
          isOffer: true,
          discount: `${offer.discount_percentage}%`
        })) || [];

        setSimilarOffers(transformedOffers);
      } catch (error) {
        console.error('Error fetching similar offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarOffers();
  }, [currentCarId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('similarCars')}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (similarOffers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('similarCars')}</h3>
        <p className="text-gray-600 text-center py-8">{t('noSimilarCarsFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('similarCars')}</h3>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {similarOffers.map(car => (
            <CarouselItem key={car.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <CarCard car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="px-0 mx-[12px]" />
        <CarouselNext className="mx-[13px]" />
      </Carousel>
    </div>
  );
};

export default SimilarCarsSlider;
