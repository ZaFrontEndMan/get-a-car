
import React from 'react';
import { Search } from 'lucide-react';
import CarCard from '../CarCard';

interface CarsGridProps {
  cars: any[];
  viewMode: 'grid' | 'list';
}

const CarsGrid = ({ cars, viewMode }: CarsGridProps) => {
  if (cars.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 mb-8 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {cars.map((car, index) => (
        <div
          key={car.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CarCard car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarsGrid;
