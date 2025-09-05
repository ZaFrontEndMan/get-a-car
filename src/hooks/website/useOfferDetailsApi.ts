import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosInstance from '../../utils/axiosInstance';
import { Offer } from '@/api/website/websiteOffers';

export const useOfferDetailsApi = (id: string | undefined) => {
  const { t } = useLanguage();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [similarOffers, setSimilarOffers] = useState([]);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch offer details from API
        const { data } = await axiosInstance.get(`/Client/Website/GetOfferDetails/${id}`);
        const offerData = data.data;

        if (!offerData) {
          toast.error('Offer not found');
          return;
        }

        // Transform additional services
        const transformedServices = offerData.additionalServices?.map((service: any, index: number) => ({
          id: `service-${index}`,
          name: service.name || '',
          description: service.description || '',
          price: service.price || 0,
          category: 'premium',
          selected: false
        })) || [];

        setAdditionalServices(transformedServices);

        // Fetch similar offers
        const similarResponse = await axiosInstance.get('/Client/Website/GetSimilarOffers', {
          params: { offerId: id, pageIndex: 0, pageSize: 4 }
        });
        
        const similarOffersData = similarResponse.data.data || [];
        
        const formattedSimilarOffers = similarOffersData.map((offer: Offer) => ({
          id: offer.id.toString(),
          title: offer.offerTitle,
          car: {
            id: offer.carId.toString(),
            name: offer.offerTitle,
            brand: offer.type || '',
            model: '',
            image: offer.offerImage || '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png',
            dailyRate: offer.totalPrice,
            originalRate: offer.oldPricePerDay,
            seats: 4, // Default value
            fuel: offer.fuelType || 'Petrol',
            transmission: offer.transmission || 'Automatic',
            vendor: {
              name: offer.vendorName || 'Unknown Vendor',
              logo: offer.companyLogo
            }
          },
          discount: Math.round(((offer.oldPricePerDay - offer.totalPrice) / offer.oldPricePerDay) * 100),
          validUntil: offer.endDate
        }));
        
        setSimilarOffers(formattedSimilarOffers);

        // Transform the data to match the expected format
        const transformedOffer = {
          id: offerData.id.toString(),
          title: offerData.offerTitle,
          title_ar: '', // API doesn't provide Arabic titles yet
          description: offerData.offerDescription,
          description_ar: '', // API doesn't provide Arabic descriptions yet
          discount: `${Math.round(((offerData.oldPricePerDay - offerData.totalPrice) / offerData.oldPricePerDay) * 100)}%`,
          discountPercentage: Math.round(((offerData.oldPricePerDay - offerData.totalPrice) / offerData.oldPricePerDay) * 100),
          validUntil: offerData.endDate,
          car: {
            id: offerData.carId.toString(),
            name: offerData.offerTitle,
            brand: offerData.type || '',
            model: '',
            year: new Date().getFullYear(),
            color: '',
            image: offerData.offerImage || '/uploads/10b7fec1-615a-4b01-ae08-d35764ce917a.png',
            gallery: [offerData.offerImage] || [],
            rating: 4.5,
            reviews: 156,
            seats: 4, // Default value
            fuel: offerData.fuelType || 'Petrol',
            transmission: offerData.transmission || 'Automatic',
            type: offerData.type || 'Sedan',
            condition: 'Excellent',
            mileageLimit: 250,
            features: [],
            pricing: {
              daily: offerData.totalPrice,
              weekly: offerData.totalPrice * 7 * 0.9, // 10% discount for weekly
              monthly: offerData.totalPrice * 30 * 0.8 // 20% discount for monthly
            },
            originalPricing: {
              daily: offerData.oldPricePerDay,
              weekly: offerData.oldPricePerWeek,
              monthly: offerData.oldPricePerMonth
            },
            daily_rate: offerData.totalPrice,
            original_daily_rate: offerData.oldPricePerDay,
            vendor_id: '1', // Default value
            deposit_amount: 2000 // Default value
          },
          vendor: {
            id: '1', // Default value
            name: offerData.vendorName || 'Unknown Vendor',
            rating: 4.8,
            totalReviews: 0,
            image: offerData.companyLogo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
            verified: true,
            location: offerData.branch || 'Main Branch',
            phone: '',
            email: '',
            website: '',
            carsCount: 10 // Default value
          },
          locations: [offerData.branch || 'Main Branch'],
          dropoffLocations: [offerData.branch || 'Main Branch'],
          policies: [
            t('minimumAge'),
            t('validDrivingLicenseRequired'),
            `${t('securityDeposit')}: ${t('currency')} 2000`,
            t('fuelReturnSameLevel'),
            t('freeCancellation24Hours'),
            `${t('offerValidUntil')} ${new Date(offerData.endDate).toLocaleDateString()}`,
            `${t('discount')}: ${Math.round(((offerData.oldPricePerDay - offerData.totalPrice) / offerData.oldPricePerDay) * 100)}% ${t('off')}`
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