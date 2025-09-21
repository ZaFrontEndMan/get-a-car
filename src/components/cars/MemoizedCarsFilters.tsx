import React, { memo } from 'react';
import CarsFilters from './CarsFilters';
import { CarsFilters as CarsFiltersType } from '@/api/website/websiteCars';

interface MemoizedCarsFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClearFilters: () => void;
  filterData?: {
    vendorNames?: { name: string; quantity: number }[];
    branches?: { name: string; quantity: number }[];
    types?: { name: string; quantity: number }[];
    transmissions?: { name: string; quantity: number }[];
    fuelTypes?: { name: string; quantity: number }[];
    maxPrice?: number;
  };
}

const MemoizedCarsFilters = memo<MemoizedCarsFiltersProps>((props) => {
  return <CarsFilters {...props} />;
});

MemoizedCarsFilters.displayName = 'MemoizedCarsFilters';

export default MemoizedCarsFilters;
