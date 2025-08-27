
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useVendorFilterData } from '@/hooks/useFilterData';

interface VendorsFiltersProps {
  ratingRange: number[];
  selectedLocations: string[];
  selectedCarModels: string[];
  selectedOffers: string[];
  onRatingRangeChange: (value: number[]) => void;
  onLocationToggle: (location: string) => void;
  onCarModelToggle: (model: string) => void;
  onOfferToggle: (offer: string) => void;
  onClearAll: () => void;
}

const VendorsFilters = ({
  ratingRange,
  selectedLocations,
  selectedCarModels,
  selectedOffers,
  onRatingRangeChange,
  onLocationToggle,
  onCarModelToggle,
  onOfferToggle,
  onClearAll
}: VendorsFiltersProps) => {
  const { data: filterData, isLoading } = useVendorFilterData();

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
              <h2 className="text-sm font-bold">Filters</h2>
              <button 
                onClick={onClearAll}
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Rating Range */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">RATING</h3>
              <Slider
                value={ratingRange}
                onValueChange={onRatingRangeChange}
                max={5}
                step={0.1}
                className="mb-2"
              />
              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)} ⭐
              </div>
            </div>

            {/* Location */}
            {filterData?.locations && filterData.locations.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  LOCATION
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

            {/* Car Types */}
            {filterData?.carTypes && filterData.carTypes.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  CAR TYPES
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.carTypes.map(type => (
                    <label key={type} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedCarModels.includes(type)}
                        onChange={() => onCarModelToggle(type)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Car Brands */}
            {filterData?.carBrands && filterData.carBrands.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  CAR BRANDS
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.carBrands.map(brand => (
                    <label key={brand} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedOffers.includes(brand)}
                        onChange={() => onOfferToggle(brand)}
                        className="mr-2 w-3 h-3 text-primary" 
                      />
                      <span className="flex-1 text-gray-700 px-[7px]">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div>
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                VERIFICATION
              </div>
              <label className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input 
                  type="checkbox" 
                  className="mr-2 w-3 h-3 text-primary" 
                />
                <span className="text-gray-700 px-[7px]">Verified Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsFilters;
