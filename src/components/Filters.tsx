
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Filter, X } from 'lucide-react';
import { Slider } from './ui/slider';
import { useCarFilterData } from '@/hooks/useFilterData';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
  priceRange: number[];
  selectedBrands: string[];
  selectedTypes: string[];
  selectedFeatures: string[];
  selectedLocations: string[];
  selectedCapacity: string[];
  selectedTransmission: string[];
  onPriceRangeChange: (value: number[]) => void;
  onBrandToggle: (brand: string) => void;
  onTypeToggle: (type: string) => void;
  onFeatureToggle: (feature: string) => void;
  onLocationToggle: (location: string) => void;
  onCapacityToggle: (capacity: string) => void;
  onTransmissionToggle: (transmission: string) => void;
  onClearAll: () => void;
}

const Filters = ({
  onFilterChange,
  isOpen,
  onClose,
  priceRange,
  selectedBrands,
  selectedTypes,
  selectedFeatures,
  selectedLocations,
  selectedCapacity,
  selectedTransmission,
  onPriceRangeChange,
  onBrandToggle,
  onTypeToggle,
  onFeatureToggle,
  onLocationToggle,
  onCapacityToggle,
  onTransmissionToggle,
  onClearAll
}: FiltersProps) => {
  const { t } = useLanguage();
  const { data: filterData, isLoading } = useCarFilterData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t('filters')}
            </h2>
            <button onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">{t('priceRange')} ({t('perDay')})</h3>
            <Slider 
              value={priceRange} 
              onValueChange={onPriceRangeChange} 
              max={2000} 
              step={50} 
              className="mb-2" 
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('currency')} {priceRange[0]}</span>
              <span>{t('currency')} {priceRange[1]}</span>
            </div>
          </div>

          {/* Brands */}
          {filterData?.brands && filterData.brands.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('brands')}</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterData.brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onBrandToggle(brand)}
                      className="mr-2" 
                    />
                    <span className="px-[3px]">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Types */}
          {filterData?.types && filterData.types.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('carType')}</h3>
              <div className="space-y-2">
                {filterData.types.map(type => (
                  <label key={type} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={() => onTypeToggle(type)}
                      className="mr-2" 
                    />
                    <span className="px-[4px]">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Transmission */}
          {filterData?.transmissions && filterData.transmissions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('transmission')}</h3>
              <div className="space-y-2">
                {filterData.transmissions.map(transmission => (
                  <label key={transmission} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedTransmission.includes(transmission)}
                      onChange={() => onTransmissionToggle(transmission)}
                      className="mr-2" 
                    />
                    <span className="px-[4px]">{transmission}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Capacity */}
          {filterData?.seatOptions && filterData.seatOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('capacity')}</h3>
              <div className="space-y-2">
                {filterData.seatOptions.map(seats => (
                  <label key={seats} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCapacity.includes(seats.toString())}
                      onChange={() => onCapacityToggle(seats.toString())}
                      className="mr-2" 
                    />
                    <span className="px-[4px]">{seats} {t('seats')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {filterData?.features && filterData.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('features')}</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterData.features.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => onFeatureToggle(feature)}
                      className="mr-2" 
                    />
                    <span className="px-[4px]">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {filterData?.locations && filterData.locations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('locations')}</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterData.locations.map(location => (
                  <label key={location} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedLocations.includes(location)}
                      onChange={() => onLocationToggle(location)}
                      className="mr-2" 
                    />
                    <span className="px-[4px]">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={() => {
                onFilterChange({
                  priceRange,
                  selectedBrands,
                  selectedTypes,
                  selectedFeatures,
                  selectedLocations,
                  selectedCapacity,
                  selectedTransmission
                });
                onClose();
              }}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              {t('applyFilters')}
            </button>
            <button 
              onClick={() => {
                onClearAll();
                onClose();
              }}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {t('clearAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
