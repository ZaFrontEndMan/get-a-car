
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import CarCard from './CarCard';

interface VendorCarsListProps {
  vendorId: string;
  filters: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  cars: any[];
}

const VendorCarsList = ({ vendorId, filters, currentPage, onPageChange, cars }: VendorCarsListProps) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [filteredCars, setFilteredCars] = useState(cars);

  useEffect(() => {
    // Apply filters to cars
    let filtered = cars;

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      filtered = filtered.filter(car => 
        car.daily_rate >= filters.priceRange[0] && car.daily_rate <= filters.priceRange[1]
      );
    }

    // Car type filter
    if (filters.carType) {
      filtered = filtered.filter(car => 
        car.type?.toLowerCase().includes(filters.carType.toLowerCase())
      );
    }

    // Seats filter
    if (filters.seats) {
      filtered = filtered.filter(car => car.seats === parseInt(filters.seats));
    }

    // Fuel filter
    if (filters.fuel) {
      filtered = filtered.filter(car => 
        car.fuel_type?.toLowerCase().includes(filters.fuel.toLowerCase())
      );
    }

    // Transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(car => 
        car.transmission?.toLowerCase().includes(filters.transmission.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(car => 
        car.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    setFilteredCars(filtered);
  }, [cars, filters]);

  const carsPerPage = 12;
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const currentCars = filteredCars.slice(startIndex, startIndex + carsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('availableCars')} ({filteredCars.length})
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : currentCars.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {t('noCarsFound')}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previous')}
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorCarsList;
