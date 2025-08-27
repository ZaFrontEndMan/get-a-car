
import React from 'react';
import { Star } from 'lucide-react';

interface CarDetailsHeaderProps {
  car: {
    name: string;
    brand: string;
    year: number;
    image: string;
    gallery: string[];
    rating: number;
    reviews: number;
    pricing: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  selectedPricing: 'daily' | 'weekly' | 'monthly';
}

const CarDetailsHeader = ({ car, selectedPricing }: CarDetailsHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="font-medium">{car.rating}</span>
          <span className="text-gray-600">({car.reviews})</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 p-4">
        {car.gallery.slice(1).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${car.name} ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default CarDetailsHeader;
