
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../hooks/useWishlist';
import { Heart, Star, Users, Fuel, Settings } from 'lucide-react';

interface VendorCarCardProps {
  car: {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    weeklyPrice?: number;
    monthlyPrice?: number;
    rating: number;
    features: string[];
    seats: number;
    fuel: string;
    transmission: string;
  };
  isVendorDashboard?: boolean;
}

const VendorCarCard = ({ car, isVendorDashboard = false }: VendorCarCardProps) => {
  const { t } = useLanguage();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wishlistItem = {
      id: car.id,
      name: car.name,
      image: car.image,
      price: car.price,
      brand: car.brand
    };

    if (isInWishlist(car.id)) {
      removeFromWishlist(car.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to appropriate car details page
    const detailsUrl = isVendorDashboard 
      ? `/vendor-dashboard/cars/${car.id}` 
      : `/cars/${car.id}`;
    window.location.href = detailsUrl;
  };

  const isCarFavorite = isInWishlist(car.id);
  const linkPath = isVendorDashboard 
    ? `/vendor-dashboard/cars/${car.id}` 
    : `/cars/${car.id}`;

  return (
    <Link 
      to={linkPath}
      className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
    >
      <div className="relative">
        <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
        {!isVendorDashboard && (
          <button 
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 z-10 ${
              isCarFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4" fill={isCarFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
            <p className="text-gray-600 text-sm">{car.brand}</p>
          </div>
          <div className="flex items-center gap-1 rtl:gap-reverse">
            <Star className="h-4 w-4 text-accent fill-current" />
            <span className="text-sm font-medium">{car.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rtl:gap-reverse text-gray-600 text-sm mb-3">
          <div className="flex items-center gap-1 rtl:gap-reverse">
            <Users className="h-4 w-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1 rtl:gap-reverse">
            <Fuel className="h-4 w-4" />
            <span>{t(car.fuel.toLowerCase())}</span>
          </div>
          <div className="flex items-center gap-1 rtl:gap-reverse">
            <Settings className="h-4 w-4" />
            <span>{t(car.transmission.toLowerCase())}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-bold">{t('daily')}</span>
            <span className="text-lg font-bold text-primary">{t('currency')} {car.price}</span>
          </div>
          {car.weeklyPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('weekly')}</span>
              <span className="text-sm font-semibold text-gray-800">{t('currency')} {car.weeklyPrice}</span>
            </div>
          )}
          {car.monthlyPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('monthly')}</span>
              <span className="text-sm font-semibold text-gray-800">{t('currency')} {car.monthlyPrice}</span>
            </div>
          )}
        </div>

        <div 
          onClick={handleBookClick}
          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-center cursor-pointer"
        >
          {isVendorDashboard ? t('viewDetails') : t('bookNow')}
        </div>
      </div>
    </Link>
  );
};

export default VendorCarCard;
