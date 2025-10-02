
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, ShoppingCart } from 'lucide-react';

interface Favorite {
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
}

interface FavoriteListViewProps {
  favorites: Favorite[];
  onRemove: (id: number) => void;
  onBookNow: (id: number) => void;
}

const FavoriteListView: React.FC<FavoriteListViewProps> = ({ favorites, onRemove, onBookNow }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <div key={favorite.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4 rtl:gap-reverse">
            <img
              src={favorite.carImage}
              alt={favorite.carTitle}
              className="w-24 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{favorite.carTitle}</h3>
                </div>
                <div className="text-right rtl:text-left flex items-center gap-3 rtl:gap-reverse">
                  <div className="flex items-center gap-2 rtl:gap-reverse">
                    <img
                      src={favorite.vendorLogo}
                      alt={favorite.vendor}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{favorite.vendor}</span>
                  </div>
                  <span className="text-primary font-bold text-lg">{favorite.totalPrice}/{t('perDay')}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove(favorite.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 rtl:gap-reverse">
                  {favorite.features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-1 rtl:gap-reverse text-gray-500">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onBookNow(favorite.id);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 rtl:gap-reverse"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">{t('bookNow')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteListView;
