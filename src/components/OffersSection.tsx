import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const OffersSection = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    data: offers = [],
    isLoading
  } = useQuery({
    queryKey: ['home-offers'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('offers').select(`
          id,
          title,
          title_ar,
          description,
          description_ar,
          discount_percentage,
          valid_until,
          cars (
            id,
            name,
            images
          ),
          vendors (
            id,
            name,
            logo_url
          )
        `).eq('status', 'published').order('created_at', {
        ascending: false
      }).limit(4);
      if (error) throw error;
      return data.map(offer => ({
        id: offer.id,
        title: offer.title,
        title_ar: offer.title_ar,
        description: offer.description,
        description_ar: offer.description_ar,
        discount: `${offer.discount_percentage}% OFF`,
        image: offer.cars?.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&crop=center',
        validUntil: offer.valid_until,
        vendor: offer.vendors ? {
          id: offer.vendors.id,
          name: offer.vendors.name,
          logo_url: offer.vendors.logo_url
        } : undefined
      }));
    }
  });
  const getLocalizedTitle = (offer: any) => {
    if (language === 'ar' && offer.title_ar) {
      return offer.title_ar;
    }
    return offer.title;
  };
  const getLocalizedDescription = (offer: any) => {
    if (language === 'ar' && offer.description_ar) {
      return offer.description_ar;
    }
    return offer.description;
  };
  if (isLoading) {
    return <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading offers...</span>
          </div>
        </div>
      </section>;
  }
  return <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[13px]">
              {t('specialOffers')}
            </h2>
            <div className="w-24 h-1 gradient-primary rounded-full"></div>
          </div>
          <Link to="/offers" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium">
            <span>{t('viewAll')}</span>
            {language === 'ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Link>
        </div>

        {offers.length === 0 ? <div className="text-center py-12">
            <p className="text-gray-600">No offers available at the moment</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => <Link key={offer.id} to={`/offers/${offer.id}`} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in overflow-hidden block flex flex-col h-full" style={{
          animationDelay: `${index * 0.1}s`
        }}>
                <div className="relative">
                  <img src={offer.image} alt={getLocalizedTitle(offer)} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-4 right-4 bg-red text-white px-3 py-1 rounded-full font-bold text-sm">
                    {offer.discount}
                  </div>
                  
                  {/* Vendor Logo */}
                  {offer.vendor?.logo_url && <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
                      <img src={offer.vendor.logo_url} alt={offer.vendor.name} className="w-full h-full object-cover" />
                    </div>}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{getLocalizedTitle(offer)}</h3>
                  <p className="text-gray-600 mb-3 flex-grow">{getLocalizedDescription(offer)}</p>
                  <p className="text-sm text-secondary font-medium mb-4 text-center">
                    {t('validUntil')} {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                  
                  <div className="w-full gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse mt-auto bg-blue-900">
                    <span>{t('viewOffer')}</span>
                    {language === 'ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </div>
              </Link>)}
          </div>}
      </div>
    </section>;
};
export default OffersSection;