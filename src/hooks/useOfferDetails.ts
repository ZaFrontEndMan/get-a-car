
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

export const useOfferDetails = (id: string | undefined) => {
  const { t } = useLanguage();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [similarOffers, setSimilarOffers] = useState([]);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch offer with car and vendor details
        const { data: offerData, error: offerError } = await supabase
          .from('offers')
          .select(`
            *,
            cars (
              *,
              pickup_locations,
              dropoff_locations,
              vendors (
                id,
                name,
                rating,
                total_reviews,
                verified,
                logo_url,
                location,
                phone,
                email,
                website
              )
            )
          `)
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (offerError) {
          console.error('Error fetching offer:', offerError);
          toast.error('Failed to load offer details');
          return;
        }

        if (!offerData) {
          toast.error('Offer not found');
          return;
        }

        // Transform additional services from car's paid_features column
        let transformedServices = [];
        const carPaidFeatures = offerData.cars.paid_features;
        
        if (Array.isArray(carPaidFeatures)) {
          transformedServices = carPaidFeatures.map((feature: any, index: number) => ({
            id: `paid-feature-${index}`,
            name: feature.title || feature.name || '',
            description: feature.description || '',
            price: feature.price || 0,
            category: 'premium',
            selected: false
          }));
        }

        setAdditionalServices(transformedServices);

        // Fetch similar offers
        const { data: similarOffersData, error: similarError } = await supabase
          .from('offers')
          .select(`
            *,
            cars (
              id,
              name,
              brand,
              model,
              images,
              daily_rate,
              seats,
              fuel_type,
              transmission,
              vendors (
                name,
                rating,
                verified
              )
            )
          `)
          .eq('status', 'published')
          .neq('id', id)
          .limit(4);

        if (!similarError && similarOffersData) {
          const formattedSimilarOffers = similarOffersData.map(offer => ({
            id: offer.id,
            title: offer.title,
            car: {
              id: offer.cars.id,
              name: offer.cars.name,
              brand: offer.cars.brand,
              model: offer.cars.model,
              image: offer.cars.images?.[0] || '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png',
              dailyRate: Math.round(offer.cars.daily_rate * (1 - offer.discount_percentage / 100)),
              originalRate: offer.cars.daily_rate,
              seats: offer.cars.seats,
              fuel: offer.cars.fuel_type,
              transmission: offer.cars.transmission,
              vendor: offer.cars.vendors
            },
            discount: offer.discount_percentage,
            validUntil: offer.valid_until
          }));
          setSimilarOffers(formattedSimilarOffers);
        }

        // Get vendor cars count
        const { data: vendorCarsCount } = await supabase
          .from('cars')
          .select('id', { count: 'exact' })
          .eq('vendor_id', offerData.cars.vendors.id);

        // Transform the data to match the expected format
        const transformedOffer = {
          id: offerData.id,
          title: offerData.title,
          title_ar: offerData.title_ar,
          description: offerData.description,
          description_ar: offerData.description_ar,
          discount: `${offerData.discount_percentage}%`,
          discountPercentage: offerData.discount_percentage,
          validUntil: offerData.valid_until,
          car: {
            id: offerData.cars.id,
            name: offerData.cars.name,
            brand: offerData.cars.brand,
            model: offerData.cars.model,
            year: offerData.cars.year,
            color: offerData.cars.color,
            image: offerData.cars.images?.[0] || '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png',
            gallery: offerData.cars.images || [],
            rating: 4.5,
            reviews: 156,
            seats: offerData.cars.seats,
            fuel: offerData.cars.fuel_type,
            transmission: offerData.cars.transmission,
            type: offerData.cars.type,
            condition: offerData.cars.condition,
            mileageLimit: offerData.cars.mileage_limit,
            features: offerData.cars.features || [],
            pricing: {
              daily: offerData.cars.daily_rate,
              weekly: offerData.cars.weekly_rate || offerData.cars.daily_rate * 7,
              monthly: offerData.cars.monthly_rate || offerData.cars.daily_rate * 30
            },
            originalPricing: {
              daily: offerData.cars.daily_rate,
              weekly: offerData.cars.weekly_rate || offerData.cars.daily_rate * 7,
              monthly: offerData.cars.monthly_rate || offerData.cars.daily_rate * 30
            },
            daily_rate: offerData.cars.daily_rate,
            original_daily_rate: offerData.cars.daily_rate,
            vendor_id: offerData.cars.vendor_id,
            deposit_amount: offerData.cars.deposit_amount || 2000
          },
          vendor: {
            id: offerData.cars.vendors.id,
            name: offerData.cars.vendors.name,
            rating: offerData.cars.vendors.rating || 4.8,
            totalReviews: offerData.cars.vendors.total_reviews || 0,
            image: offerData.cars.vendors.logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
            verified: offerData.cars.vendors.verified,
            location: offerData.cars.vendors.location,
            phone: offerData.cars.vendors.phone,
            email: offerData.cars.vendors.email,
            website: offerData.cars.vendors.website,
            carsCount: vendorCarsCount?.length || 0
          },
          locations: offerData.cars.pickup_locations || [
            'Riyadh City Center', 
            'King Khalid Airport', 
            'Al Olaya District'
          ],
          dropoffLocations: offerData.cars.dropoff_locations || offerData.cars.pickup_locations || [
            'Riyadh City Center', 
            'King Khalid Airport', 
            'Al Olaya District'
          ],
          policies: [
            t('minimumAge'),
            t('validDrivingLicenseRequired'),
            `${t('securityDeposit')}: ${t('currency')} ${offerData.cars.deposit_amount || 2000}`,
            t('fuelReturnSameLevel'),
            t('freeCancellation24Hours'),
            `${t('offerValidUntil')} ${new Date(offerData.valid_until).toLocaleDateString()}`,
            `${t('discount')}: ${offerData.discount_percentage}% ${t('off')}`
          ]
        };

        setOffer(transformedOffer);
      } catch (error) {
        console.error('Error fetching offer details:', error);
        toast.error('Failed to load offer details');
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [id, t]);

  return { offer, loading, additionalServices, similarOffers };
};
