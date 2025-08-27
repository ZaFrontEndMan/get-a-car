
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '../contexts/LanguageContext';

interface VendorFiltersProps {
  filters: {
    priceRange: number[];
    carType: string;
    seats: string;
    fuel: string;
    transmission: string;
    brand: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
}

const VendorFilters = ({ filters, onFilterChange }: VendorFiltersProps) => {
  const { t } = useLanguage();

  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const handleSelectChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [0, 1000],
      carType: '',
      seats: '',
      fuel: '',
      transmission: '',
      brand: '',
      location: ''
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold">{t('filters')}</h2>
          <button 
            onClick={clearAllFilters}
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
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={1000}
            step={25}
            className="mb-2"
          />
          <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
            {t('currency')} {filters.priceRange[0]} - {t('currency')} {filters.priceRange[1]}
          </div>
        </div>

        {/* Car Type */}
        <div>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
            {t('carType').toUpperCase()}
          </div>
          <select 
            value={filters.carType}
            onChange={(e) => handleSelectChange('carType', e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
            <option value="hatchback">Hatchback</option>
          </select>
        </div>

        {/* Seats */}
        <div>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
            {t('seats').toUpperCase()}
          </div>
          <select 
            value={filters.seats}
            onChange={(e) => handleSelectChange('seats', e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Seats</option>
            <option value="2">2 {t('seats')}</option>
            <option value="4">4 {t('seats')}</option>
            <option value="5">5 {t('seats')}</option>
            <option value="6">6 {t('seats')}</option>
            <option value="7">7 {t('seats')}</option>
            <option value="8+">8+ {t('seats')}</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
            {t('fuelType').toUpperCase()}
          </div>
          <select 
            value={filters.fuel}
            onChange={(e) => handleSelectChange('fuel', e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Fuel Types</option>
            <option value="petrol">{t('petrol')}</option>
            <option value="diesel">{t('diesel')}</option>
            <option value="electric">{t('electric')}</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
            {t('transmission').toUpperCase()}
          </div>
          <select 
            value={filters.transmission}
            onChange={(e) => handleSelectChange('transmission', e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Transmissions</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg mb-3">
            {t('brands').toUpperCase()}
          </div>
          <select 
            value={filters.brand}
            onChange={(e) => handleSelectChange('brand', e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Brands</option>
            <option value="toyota">Toyota</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
            <option value="honda">Honda</option>
            <option value="nissan">Nissan</option>
            <option value="kia">KIA</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VendorFilters;
