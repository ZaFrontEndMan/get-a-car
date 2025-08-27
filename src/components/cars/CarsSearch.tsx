
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Grid3X3, List, Filter } from 'lucide-react';

interface CarsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFiltersOpen: () => void;
  currentCars: any[];
  currentPage: number;
  totalPages: number;
}

const CarsSearch = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFiltersOpen,
  currentCars,
  currentPage,
  totalPages
}: CarsSearchProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 ${
            isRTL ? 'right-4' : 'left-4'
          }`} />
          <input 
            type="text" 
            placeholder={t('searchCars') || 'Search cars...'} 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all ${
              isRTL ? 'text-right' : 'text-left'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'grid' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'list' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button 
            onClick={onFiltersOpen}
            className="lg:hidden bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
          >
            <Filter className="h-5 w-5" />
            <span>{t('filters')}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            {currentCars.length} {t('carsFoundText') || 'cars found'}
          </span>
          <span>
            {t('page') || 'Page'} {currentPage} {t('of') || 'of'} {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('sortBy') || 'Sort by'}:</span>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
            <option>{t('sortByPriceLowToHigh') || t('priceLowToHigh') || 'Price: Low to High'}</option>
            <option>{t('sortByPriceHighToLow') || t('priceHighToLow') || 'Price: High to Low'}</option>
            <option>{t('sortByNewestFirst') || t('newestFirst') || 'Newest First'}</option>
            <option>{t('sortByMostPopular') || t('mostPopular') || 'Most Popular'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarsSearch;
