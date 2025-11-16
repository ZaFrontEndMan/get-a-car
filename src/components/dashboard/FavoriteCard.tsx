
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, ShoppingCart } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface FavoriteCardProps {
  favorite: {
    id: number;
    carTitle: string;
    carImage: string;
    totalPrice: string;
    vendor: string;
    vendorLogo: string;
    features: Array<{
      icon: React.ComponentType<{ className?: string }>;
      label: string;
    }>;
  };
  onRemove: (id: number) => void;
  onBookNow: (id: number) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onRemove, onBookNow }) => {
  const { t } = useLanguage();

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Removing favorite with ID:', favorite.id);
    onRemove(favorite.id);
  };

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Booking car with ID:', favorite.id);
    onBookNow(favorite.id);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[380px] md:h-[400px] relative">
      <div className="relative">
        <LazyImage
          src={favorite.carImage}
          alt={favorite.carTitle}
          className="w-full h-40 md:h-48 object-cover"
        />
        <button
          type="button"
          onClick={handleRemoveClick}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-700 hover:bg-white transition-colors z-20 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 rtl:gap-reverse">
          <LazyImage
            src={favorite.vendorLogo}
            alt={favorite.vendor}
            className="w-4 h-4 rounded-full"
          />
          <span className="text-xs font-medium text-gray-700">{favorite.vendor}</span>
        </div>
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base md:text-lg text-gray-900">{favorite.carTitle}</h3>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 rtl:gap-reverse mb-3">
          {favorite.features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center gap-1 rtl:gap-reverse text-gray-500">
                <IconComponent className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs">{feature.label}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-primary font-bold text-lg">{favorite.totalPrice}/{t('perDay')}</span>
          </div>
          <button
            type="button"
            onClick={handleBookNowClick}
            className="w-full bg-primary text-white px-3 md:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 rtl:gap-reverse text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{t('bookNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
