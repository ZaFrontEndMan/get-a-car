
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '../contexts/LanguageContext';
import CarCard from './CarCard';

const PopularCarsSection = () => {
  const { t } = useLanguage();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['popular-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          vendors (
            id,
            name,
            logo_url
          )
        `)
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(8);

      if (error) throw error;

      const mappedCars = data.map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        image: car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        price: car.daily_rate,
        weeklyPrice: car.weekly_rate,
        monthlyPrice: car.monthly_rate,
        rating: 4.5, // You might want to add a rating field to your cars table
        features: car.features || [],
        seats: car.seats,
        fuel: car.fuel_type,
        transmission: car.transmission,
        vendor: car.vendors ? {
          id: car.vendors.id,
          name: car.vendors.name,
          logo_url: car.vendors.logo_url
        } : undefined
      }));

      console.log('Mapped popular cars:', mappedCars);
      return mappedCars;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('popularCars')}</h2>
            <p className="text-gray-600">{t('popularCarsDesc')}</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('popularCars')}</h2>
          <p className="text-gray-600">{t('popularCarsDesc')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCarsSection;
