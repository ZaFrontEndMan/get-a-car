import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Slider } from '@/components/ui/slider';
import { useCarFilterData } from '@/hooks/useFilterData';

interface CarsFiltersProps {
  priceRange: number[];
  selectedTypes: string[];
  selectedCapacity: string[];
  selectedTransmission: string[];
  selectedVendors: string[];
  selectedBrands: string[];
  selectedFeatures: string[];
  selectedLocations: string[];
  onPriceRangeChange: (value: number[]) => void;
  onTypeToggle: (type: string) => void;
  onCapacityToggle: (capacity: string) => void;
  onTransmissionToggle: (transmission: string) => void;
  onVendorToggle: (vendor: string) => void;
  onBrandToggle: (brand: string) => void;
  onFeatureToggle: (feature: string) => void;
  onLocationToggle: (location: string) => void;
  onClearAll: () => void;
}

const CarsFilters = ({
  priceRange,
  selectedTypes,
  selectedCapacity,
  selectedTransmission,
  selectedVendors,
  selectedBrands,
  selectedFeatures,
  selectedLocations,
  onPriceRangeChange,
  onTypeToggle,
  onCapacityToggle,
  onTransmissionToggle,
  onVendorToggle,
  onBrandToggle,
  onFeatureToggle,
  onLocationToggle,
  onClearAll
}: CarsFiltersProps) => {
  const { t } = useLanguage();
  const { data: filterData, isLoading } = useCarFilterData();

  if (isLoading) {
    return (
      <div className="hidden lg:block flex-shrink-0" style={{ width: '200px' }}>
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="animate-pulse">Loading filters...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block flex-shrink-0" style={{ width: '200px' }}>
      <div className="sticky top-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold">{t('filters')}</h2>
              <button 
                onClick={onClearAll}
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                {t('clearAll')}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">{t('priceRange').toUpperCase()}</h3>
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={2000}
                step={50}
                className="mb-2"
              />
              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                {t('currency')} {priceRange[0]} - {t('currency')} {priceRange[1]}
              </div>
            </div>

            {/* Vendors */}
            {filterData?.vendors && filterData.vendors.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('vendors').toUpperCase()}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.vendors.map(vendor => (
                    <label key={vendor} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(vendor)}
                        onChange={() => onVendorToggle(vendor)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{vendor}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {filterData?.brands && filterData.brands.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('brands').toUpperCase()}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.brands.map(brand => (
                    <label key={brand} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => onBrandToggle(brand)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Type */}
            {filterData?.types && filterData.types.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('carType').toUpperCase()}
                </div>
                <div className="space-y-2">
                  {filterData.types.map(type => (
                    <label key={type} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.includes(type)}
                        onChange={() => onTypeToggle(type)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Transmission */}
            {filterData?.transmissions && filterData.transmissions.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('transmission').toUpperCase()}
                </div>
                <div className="space-y-2">
                  {filterData.transmissions.map(transmission => (
                    <label key={transmission} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedTransmission.includes(transmission)}
                        onChange={() => onTransmissionToggle(transmission)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{transmission}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity */}
            {filterData?.seatOptions && filterData.seatOptions.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('capacity').toUpperCase()}
                </div>
                <div className="space-y-2">
                  {filterData.seatOptions.map(seats => (
                    <label key={seats} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedCapacity.includes(seats.toString())}
                        onChange={() => onCapacityToggle(seats.toString())}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{seats} {t('seats')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {filterData?.features && filterData.features.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('features').toUpperCase()}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.features.map(feature => (
                    <label key={feature} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => onFeatureToggle(feature)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Locations */}
            {filterData?.locations && filterData.locations.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('locations').toUpperCase()}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.locations.map(location => (
                    <label key={location} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedLocations.includes(location)}
                        onChange={() => onLocationToggle(location)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsFilters;
