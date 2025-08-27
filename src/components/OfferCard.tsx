
import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Clock, Tag } from 'lucide-react';

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    discount: string;
    validUntil: string;
    image: string;
    terms: string[];
    vendor?: {
      id: string;
      name: string;
      logo_url?: string;
    };
  };
  onFavorite?: (offerId: string) => void;
  isFavorite?: boolean;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { language, t } = useLanguage();

  const getLocalizedTitle = () => {
    if (language === 'ar' && offer.title_ar) {
      return offer.title_ar;
    }
    return offer.title;
  };

  const getLocalizedDescription = () => {
    if (language === 'ar' && offer.description_ar) {
      return offer.description_ar;
    }
    return offer.description;
  };

  // Truncate description to 15 words
  const truncateDescription = (text: string, wordLimit: number = 15) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(offer.id)) {
      removeFromFavorites(offer.id);
    } else {
      addToFavorites({
        id: offer.id,
        type: 'offer',
        name: getLocalizedTitle(),
        image: offer.image,
        price: offer.discount + ' OFF'
      });
    }
  };

  const handleClaimClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const isOfferFavorite = isFavorite(offer.id);

  return (
    <Link to={`/offers/${offer.id}`} className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      <div className="relative">
        <img src={offer.image} alt={getLocalizedTitle()} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold bg-sky-950">
          {offer.discount} OFF
        </div>
        
        {/* Vendor Logo */}
        {offer.vendor?.logo_url && (
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
            <img 
              src={offer.vendor.logo_url} 
              alt={offer.vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <button 
          onClick={handleFavoriteClick} 
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 z-10 ${
            isOfferFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className="h-4 w-4" fill={isOfferFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{getLocalizedTitle()}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{truncateDescription(getLocalizedDescription(), 15)}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-center text-blue-700 text-lg">
            {t('validUntil')} {new Date(offer.validUntil).toLocaleDateString()}
          </span>
        </div>

        <div 
          onClick={handleClaimClick} 
          className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold cursor-pointer text-center"
        >
          {t('claimOffer')}
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;
