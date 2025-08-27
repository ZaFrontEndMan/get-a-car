
import React from 'react';
import FavoriteCard from './FavoriteCard';

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

interface FavoriteGridViewProps {
  favorites: Favorite[];
  onRemove: (id: number) => void;
  onBookNow: (id: number) => void;
}

const FavoriteGridView: React.FC<FavoriteGridViewProps> = ({ favorites, onRemove, onBookNow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          onRemove={onRemove}
          onBookNow={onBookNow}
        />
      ))}
    </div>
  );
};

export default FavoriteGridView;
