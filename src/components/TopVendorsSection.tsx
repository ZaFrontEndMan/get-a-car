
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import VendorCard from './VendorCard';
import { supabase } from '@/integrations/supabase/client';

const TopVendorsSection = () => {
  const { t, language } = useLanguage();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['top-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          id,
          name,
          email,
          phone,
          location,
          rating,
          total_reviews,
          verified,
          logo_url,
          cars (id)
        `)
        .eq('verified', true)
        .eq('show_on_website', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        rating: vendor.rating || 0,
        image: vendor.logo_url || '/placeholder.svg',
        verified: vendor.verified || false,
        carsCount: vendor.cars?.length || 0,
        branchCount: 1,
        location: vendor.location || 'Saudi Arabia'
      }));
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading vendors...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[9px]">
              {t('topVendors')}
            </h2>
            <div className="w-24 h-1 gradient-primary rounded-full"></div>
          </div>
          <Link 
            to="/vendors" 
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span>{t('viewAll')}</span>
            {language === 'ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Link>
        </div>

        {vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('noVendorsAvailable') || 'No vendors available'}</p>
          </div>
        ) : (
          <Carousel 
            opts={{
              align: "start"
            }} 
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {vendors.map((vendor, index) => (
                <CarouselItem 
                  key={vendor.id} 
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div 
                    className="animate-fade-in" 
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <VendorCard vendor={vendor} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default TopVendorsSection;
