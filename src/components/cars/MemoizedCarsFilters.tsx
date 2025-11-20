import React, { memo } from "react";
import CarsFilters from "./CarsFilters";
import {
  CarsFilters as CarsFiltersType,
  VendorCarsFilters,
  CarFilter,
} from "@/api/website/websiteCars";

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
    vendorNames?: CarFilter[];
    branches?: CarFilter[];
    types?: CarFilter[];
    transmissions?: CarFilter[];
    fuelTypes?: CarFilter[];
    makes?: CarFilter[]; // New: for vendor-specific filtering
    carCapacities?: CarFilter[]; // New: for vendor-specific filtering
    maxPrice?: number;
  };
  // New props for vendor mode awareness
  isVendorMode?: boolean;
  vendorId?: string;
}

const MemoizedCarsFilters = memo<MemoizedCarsFiltersProps>(
  ({
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    selectedVendors,
    setSelectedVendors,
    searchTerm,
    setSearchTerm,
    onClearFilters,
    filterData,
    isVendorMode = false,
    vendorId,
    withDriver,
    ...props
  }) => {
    // Skip memoization if vendor mode changes (forces re-render for UI updates)
    const memoKey = `${isVendorMode}-${vendorId}-${searchTerm}-${JSON.stringify(
      priceRange
    )}-${JSON.stringify(selectedCategories)}-${JSON.stringify(
      selectedVendors
    )}`;

    return (
      <CarsFilters
        {...props}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedVendors={selectedVendors}
        setSelectedVendors={setSelectedVendors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClearFilters={onClearFilters}
        filterData={filterData}
        isVendorMode={isVendorMode}
        vendorId={vendorId}
        withDriver={withDriver}
        memoKey={memoKey} // Pass memo key to force re-render when needed
      />
    );
  }
);

MemoizedCarsFilters.displayName = "MemoizedCarsFilters";

export default MemoizedCarsFilters;
