
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OffersFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClearFilters: () => void;
}

const OffersFilters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedVendors,
  setSelectedVendors,
  searchTerm,
  setSearchTerm,
  onClearFilters
}: OffersFiltersProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const { data: filterData, isLoading } = useQuery({
    queryKey: ['offers-filter-data'],
    queryFn: async () => {
      const { data: offers, error } = await supabase
        .from('offers')
        .select(`
          discount_percentage,
          cars (
            daily_rate,
            type,
            brand
          ),
          vendors (
            name
          )
        `)
        .eq('status', 'published');

      if (error) throw error;

      if (!offers) {
        return {
          vendors: [],
          categories: [],
          brands: []
        };
      }

      const vendors = [...new Set(offers.map(offer => offer.vendors?.name).filter(Boolean))];
      const categories = [...new Set(offers.map(offer => offer.cars?.type).filter(Boolean))];
      const brands = [...new Set(offers.map(offer => offer.cars?.brand).filter(Boolean))];

      return { vendors, categories, brands };
    },
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    );
  };

  const handleVendorToggle = (vendor: string) => {
    setSelectedVendors(
      selectedVendors.includes(vendor)
        ? selectedVendors.filter(v => v !== vendor)
        : [...selectedVendors, vendor]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedCategories(
      selectedCategories.includes(brand)
        ? selectedCategories.filter(c => c !== brand)
        : [...selectedCategories, brand]
    );
  };

  if (isLoading) {
    return (
      <div className="hidden lg:block flex-shrink-0 w-52">
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="animate-pulse">{t('loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block flex-shrink-0 w-52">
      <div className="sticky top-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold">{t('filters')}</h2>
              <button 
                onClick={onClearFilters}
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                {t('clearAll')}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">
                {t('search')}
              </h3>
              <input
                type="text"
                placeholder={t('searchOffers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xs ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3 text-xs text-gray-800 uppercase tracking-wide">
                {t('priceRange')}
              </h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
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
                  {t('vendors')}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.vendors.map(vendor => (
                    <label key={vendor} className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(vendor)}
                        onChange={() => handleVendorToggle(vendor)}
                        className={`${isRTL ? 'ml-2' : 'mr-2'} w-3 h-3 text-primary`}
                      />
                      <span className={`flex-1 text-gray-700 ${isRTL ? 'text-right pr-2' : 'text-left pl-2'}`}>
                        {vendor}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {filterData?.categories && filterData.categories.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('categories')}
                </div>
                <div className="space-y-2">
                  {filterData.categories.map(category => (
                    <label key={category} className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className={`${isRTL ? 'ml-2' : 'mr-2'} w-3 h-3 text-primary`}
                      />
                      <span className={`flex-1 text-gray-700 ${isRTL ? 'text-right pr-2' : 'text-left pl-2'}`}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {filterData?.brands && filterData.brands.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
                  {t('brands')}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterData.brands.map(brand => (
                    <label key={brand} className={`flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className={`${isRTL ? 'ml-2' : 'mr-2'} w-3 h-3 text-primary`}
                      />
                      <span className={`flex-1 text-gray-700 ${isRTL ? 'text-right pr-2' : 'text-left pl-2'}`}>
                        {brand}
                      </span>
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

export default OffersFilters;
