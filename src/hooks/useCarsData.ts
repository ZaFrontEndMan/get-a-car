
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CarsFilters {
  searchTerm?: string;
  priceRange?: number[];
  selectedTypes?: string[];
  selectedCapacity?: string[];
  selectedTransmission?: string[];
  selectedBrands?: string[];
  selectedFeatures?: string[];
  selectedLocations?: string[];
  selectedVendors?: string[];
}

export const useCarsData = (filters?: CarsFilters) => {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select(`
          *,
          vendors (
            id,
            name,
            logo_url
          )
        `);

      // Apply filters if provided
      if (filters) {
        if (filters.searchTerm) {
          query = query.or(`name.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%,model.ilike.%${filters.searchTerm}%`);
        }

        if (filters.priceRange && filters.priceRange.length >= 2 && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000)) {
          query = query.gte('daily_rate', filters.priceRange[0]).lte('daily_rate', filters.priceRange[1]);
        }

        if (filters.selectedTypes && filters.selectedTypes.length > 0) {
          query = query.in('type', filters.selectedTypes);
        }

        if (filters.selectedCapacity && filters.selectedCapacity.length > 0) {
          const capacityNumbers = filters.selectedCapacity.map(c => parseInt(c));
          query = query.in('seats', capacityNumbers);
        }

        if (filters.selectedTransmission && filters.selectedTransmission.length > 0) {
          query = query.in('transmission', filters.selectedTransmission);
        }

        if (filters.selectedBrands && filters.selectedBrands.length > 0) {
          query = query.in('brand', filters.selectedBrands);
        }

        if (filters.selectedLocations && filters.selectedLocations.length > 0) {
          query = query.overlaps('pickup_locations', filters.selectedLocations);
        }

        if (filters.selectedFeatures && filters.selectedFeatures.length > 0) {
          query = query.overlaps('features', filters.selectedFeatures);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars:', error);
        throw error;
      }

      let filteredData = data || [];

      // Apply vendor filtering on the client side since we need to filter by vendor names
      if (filters?.selectedVendors && filters.selectedVendors.length > 0) {
        console.log('Filtering by vendors:', filters.selectedVendors);
        filteredData = filteredData.filter(car => {
          const vendorName = car.vendors?.name;
          const isIncluded = vendorName && filters.selectedVendors.includes(vendorName);
          if (isIncluded) {
            console.log('Car matched vendor filter:', car.name, 'from vendor:', vendorName);
          }
          return isIncluded;
        });
        console.log('Filtered cars by vendor:', filteredData.length);
      }

      return filteredData;
    },
    staleTime: 300000, // 5 minutes
  });
};
