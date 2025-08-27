
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCarFilterData = () => {
  return useQuery({
    queryKey: ['car-filter-data'],
    queryFn: async () => {
      console.log('Fetching car filter data...');
      
      const { data: cars, error } = await supabase
        .from('cars')
        .select('brand, model, type, fuel_type, transmission, seats, features, pickup_locations, vendors(name)')
        .eq('is_available', true);

      if (error) {
        console.error('Car filter data error:', error);
        throw error;
      }

      console.log('Car filter raw data:', cars);

      if (!cars) {
        return {
          brands: [],
          models: [],
          types: [],
          fuelTypes: [],
          transmissions: [],
          seatOptions: [],
          features: [],
          locations: [],
          vendors: []
        };
      }

      // Extract unique values for filters
      const brands = [...new Set(cars.map(car => car.brand).filter((brand): brand is string => Boolean(brand)))];
      const models = [...new Set(cars.map(car => car.model).filter((model): model is string => Boolean(model)))];
      const types = [...new Set(cars.map(car => car.type).filter((type): type is string => Boolean(type)))];
      const fuelTypes = [...new Set(cars.map(car => car.fuel_type).filter((fuel): fuel is string => Boolean(fuel)))];
      const transmissions = [...new Set(cars.map(car => car.transmission).filter((trans): trans is string => Boolean(trans)))];
      const seatOptions = [...new Set(cars.map(car => car.seats).filter((seats): seats is number => seats !== null && seats !== undefined))].sort((a, b) => a - b);
      const vendors = [...new Set(cars.map(car => car.vendors?.name).filter((vendor): vendor is string => Boolean(vendor)))];
      
      // Extract all features and locations
      const allFeatures = cars.reduce((acc, car) => {
        if (car.features && Array.isArray(car.features)) {
          acc.push(...car.features);
        }
        return acc;
      }, [] as string[]);
      
      const allLocations = cars.reduce((acc, car) => {
        if (car.pickup_locations && Array.isArray(car.pickup_locations)) {
          acc.push(...car.pickup_locations);
        }
        return acc;
      }, [] as string[]);

      const features = [...new Set(allFeatures)];
      const locations = [...new Set(allLocations)];

      const filterData = {
        brands,
        models,
        types,
        fuelTypes,
        transmissions,
        seatOptions,
        features,
        locations,
        vendors
      };

      console.log('Processed filter data:', filterData);
      return filterData;
    },
  });
};

export const useVendorFilterData = () => {
  return useQuery({
    queryKey: ['vendor-filter-data'],
    queryFn: async () => {
      console.log('Fetching vendor filter data...');
      
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('location, cars(type, brand)')
        .eq('verified', true);

      if (error) {
        console.error('Vendor filter data error:', error);
        throw error;
      }

      console.log('Vendor filter raw data:', vendors);

      if (!vendors) {
        return {
          locations: [],
          carTypes: [],
          carBrands: []
        };
      }

      // Extract unique locations
      const locations = [...new Set(vendors.map(vendor => vendor.location).filter((location): location is string => Boolean(location)))];
      
      // Extract car types and brands from vendors' cars
      const allCarTypes: string[] = [];
      const allCarBrands: string[] = [];
      
      vendors.forEach(vendor => {
        if (vendor.cars && Array.isArray(vendor.cars)) {
          vendor.cars.forEach((car: any) => {
            if (car.type) allCarTypes.push(car.type);
            if (car.brand) allCarBrands.push(car.brand);
          });
        }
      });

      const carTypes = [...new Set(allCarTypes)];
      const carBrands = [...new Set(allCarBrands)];

      const filterData = {
        locations,
        carTypes,
        carBrands
      };

      console.log('Processed vendor filter data:', filterData);
      return filterData;
    },
  });
};
