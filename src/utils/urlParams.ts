/**
 * Utility functions for handling URL parameters
 */

import { CarsFilters } from '../api/website/websiteCars';

/**
 * Parse URL search parameters and convert them to filter format
 * @param searchParams - URLSearchParams object from window.location.search
 * @returns CarsFilters object with parsed values
 */
export const parseUrlParamsToFilters = (searchParams: URLSearchParams): CarsFilters => {
  const filters: CarsFilters = {};

  // Parse vendor names
  const vendorParam = searchParams.get('vendor');
  if (vendorParam) {
    filters.vendorNames = vendorParam.split(',').map(v => v.trim()).filter(Boolean);
  }

  // Parse types
  const typeParam = searchParams.get('type');
  if (typeParam) {
    filters.types = typeParam.split(',').map(t => t.trim()).filter(Boolean);
  }

  // Parse fuel types
  const fuelTypeParam = searchParams.get('fuelType');
  if (fuelTypeParam) {
    filters.fuelTypes = fuelTypeParam.split(',').map(f => f.trim()).filter(Boolean);
  }

  // Parse branches
  const branchParam = searchParams.get('branch');
  if (branchParam) {
    filters.branches = branchParam.split(',').map(b => b.trim()).filter(Boolean);
  }

  // Parse transmissions
  const transmissionParam = searchParams.get('transmission');
  if (transmissionParam) {
    filters.transmissions = transmissionParam.split(',').map(t => t.trim()).filter(Boolean);
  }

  // Parse price range
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  if (minPriceParam || maxPriceParam) {
    filters.priceRange = {
      min: minPriceParam ? parseFloat(minPriceParam) : 0,
      max: maxPriceParam ? parseFloat(maxPriceParam) : 2000
    };
  }

  return filters;
};

/**
 * Convert filters to URL search parameters
 * @param filters - CarsFilters object
 * @returns URLSearchParams object
 */
export const filtersToUrlParams = (filters: CarsFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.vendorNames && filters.vendorNames.length > 0) {
    params.set('vendor', filters.vendorNames.join(','));
  }

  if (filters.types && filters.types.length > 0) {
    params.set('type', filters.types.join(','));
  }

  if (filters.fuelTypes && filters.fuelTypes.length > 0) {
    params.set('fuelType', filters.fuelTypes.join(','));
  }

  if (filters.branches && filters.branches.length > 0) {
    params.set('branch', filters.branches.join(','));
  }

  if (filters.transmissions && filters.transmissions.length > 0) {
    params.set('transmission', filters.transmissions.join(','));
  }

  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.set('minPrice', filters.priceRange.min.toString());
    }
    if (filters.priceRange.max < 2000) {
      params.set('maxPrice', filters.priceRange.max.toString());
    }
  }

  return params;
};

/**
 * Update browser URL with current filters without page reload
 * @param filters - CarsFilters object
 */
export const updateUrlWithFilters = (filters: CarsFilters): void => {
  const params = filtersToUrlParams(filters);
  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  
  // Update URL without page reload
  window.history.replaceState({}, '', newUrl);
};
