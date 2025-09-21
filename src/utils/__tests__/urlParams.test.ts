/**
 * Tests for URL parameter utilities
 */

import { parseUrlParamsToFilters, filtersToUrlParams, updateUrlWithFilters } from '../urlParams';

// Mock window.location and window.history
const mockLocation = {
  search: '',
  pathname: '/cars'
};

const mockHistory = {
  replaceState: jest.fn()
};

// Mock window object
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true
});

describe('URL Parameter Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.search = '';
    mockLocation.pathname = '/cars';
  });

  describe('parseUrlParamsToFilters', () => {
    it('should parse vendor parameter correctly', () => {
      const searchParams = new URLSearchParams('vendor=ahmed,GETCAR');
      const filters = parseUrlParamsToFilters(searchParams);
      
      expect(filters.vendorNames).toEqual(['ahmed', 'GETCAR']);
    });

    it('should parse multiple filter parameters', () => {
      const searchParams = new URLSearchParams('vendor=ahmed&type=SUV&fuelType=بنزين&minPrice=100&maxPrice=500');
      const filters = parseUrlParamsToFilters(searchParams);
      
      expect(filters.vendorNames).toEqual(['ahmed']);
      expect(filters.types).toEqual(['SUV']);
      expect(filters.fuelTypes).toEqual(['بنزين']);
      expect(filters.priceRange).toEqual({ min: 100, max: 500 });
    });

    it('should handle empty parameters', () => {
      const searchParams = new URLSearchParams('');
      const filters = parseUrlParamsToFilters(searchParams);
      
      expect(filters).toEqual({});
    });

    it('should handle comma-separated values', () => {
      const searchParams = new URLSearchParams('vendor=ahmed,GETCAR,TestVendor&type=SUV,Sedan');
      const filters = parseUrlParamsToFilters(searchParams);
      
      expect(filters.vendorNames).toEqual(['ahmed', 'GETCAR', 'TestVendor']);
      expect(filters.types).toEqual(['SUV', 'Sedan']);
    });
  });

  describe('filtersToUrlParams', () => {
    it('should convert filters to URL parameters', () => {
      const filters = {
        vendorNames: ['ahmed', 'GETCAR'],
        types: ['SUV'],
        fuelTypes: ['بنزين'],
        priceRange: { min: 100, max: 500 }
      };
      
      const params = filtersToUrlParams(filters);
      
      expect(params.get('vendor')).toBe('ahmed,GETCAR');
      expect(params.get('type')).toBe('SUV');
      expect(params.get('fuelType')).toBe('بنزين');
      expect(params.get('minPrice')).toBe('100');
      expect(params.get('maxPrice')).toBe('500');
    });

    it('should handle empty filters', () => {
      const filters = {};
      const params = filtersToUrlParams(filters);
      
      expect(params.toString()).toBe('');
    });

    it('should skip default price range values', () => {
      const filters = {
        priceRange: { min: 0, max: 2000 }
      };
      
      const params = filtersToUrlParams(filters);
      
      expect(params.get('minPrice')).toBeNull();
      expect(params.get('maxPrice')).toBeNull();
    });
  });

  describe('updateUrlWithFilters', () => {
    it('should update URL with filters', () => {
      const filters = {
        vendorNames: ['ahmed'],
        types: ['SUV']
      };
      
      updateUrlWithFilters(filters);
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '?vendor=ahmed&type=SUV'
      );
    });

    it('should clear URL when no filters', () => {
      const filters = {};
      
      updateUrlWithFilters(filters);
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        '',
        '/cars'
      );
    });
  });
});
