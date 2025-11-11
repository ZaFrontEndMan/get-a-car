// src/hooks/useCars.ts
import { useQuery } from "@tanstack/react-query";
import {
  getAllCars,
  getVendorCarWithFilter, // Add this import
  getMostPopularCars,
  getRentalCarDetailsById,
  getCarDetailsById,
  getSimilarCars,
  AllCarsResponse,
  VendorCarsResponse, // Add this import for vendor response type
  Car,
  RentalCarDetailsResponse,
} from "@/api/website/websiteCars";

// 🔹 Hook: Get all cars (paginated)
export const useAllCars = (
  pageIndex: number,
  pageSize: number,
  filters?: {
    vendors?: string[];
    types?: string[];
    transmissions?: string[];
    fuelTypes?: string[];
    branches?: string[];
    priceRange?: [number, number];
  }
) => {
  return useQuery<AllCarsResponse>({
    queryKey: ["allCars", pageIndex, pageSize, filters],
    queryFn: () => getAllCars(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData, // smooth pagination
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    keepPreviousData: true,
  });
};

// 🔹 NEW: Hook: Get vendor-specific cars with filters
export const useGetVendorCarWithFilter = (
  vendorId: string,
  pageIndex: number,
  pageSize: number,
  filters?: {
    types?: string[];
    transmissions?: string[];
    fuelTypes?: string[];
    branches?: string[];
    priceRange?: [number, number];
  }
) => {
  return useQuery<VendorCarsResponse>({
    queryKey: ["vendorCars", vendorId, pageIndex, pageSize, filters],
    queryFn: () =>
      getVendorCarWithFilter(vendorId, pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData, // smooth pagination
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    enabled: !!vendorId && vendorId.length > 0, // Only enable when vendorId is valid
  });
};

// 🔹 Hook: Get most popular cars (short list, e.g. 6)
export const useMostPopularCars = (pageIndex: number, pageSize: number) => {
  return useQuery<Car[]>({
    queryKey: ["mostPopularCars", pageIndex, pageSize],
    queryFn: () => getMostPopularCars(pageIndex, pageSize),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// 🔹 Hook: Get rental car details by ID
export const useRentalCarDetails = (carId: number, offerId: number) => {
  return useQuery<RentalCarDetailsResponse>({
    queryKey: ["rentalCarDetails", carId, offerId],
    // If offerId is provided (>0), fetch with offer; otherwise fetch by car only
    queryFn: () =>
      offerId > 0
        ? getRentalCarDetailsById(carId, offerId)
        : getCarDetailsById(carId),
    enabled: carId > 0, // Allow when carId exists (with or without offerId)
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 🔹 Hook: Get car details by ID only
export const useCarDetailsById = (carId: number) => {
  return useQuery<RentalCarDetailsResponse>({
    queryKey: ["carDetails", carId],
    queryFn: () => getCarDetailsById(carId),
    enabled: carId > 0, // Only run query if carId is valid
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// 🔹 Hook: Get similar cars
export const useSimilarCars = (requestBody: {
  types: string[];
  pickUpLocations: string[];
  maxPrice: number;
}) => {
  // Only enable query if we have valid data
  const enabled =
    (requestBody.types.length > 0 || requestBody.pickUpLocations.length > 0) &&
    requestBody.maxPrice > 0;

  return useQuery<{ isSuccess: boolean; customMessage: string; data: Car[] }>({
    queryKey: ["similarCars", requestBody],
    queryFn: () => getSimilarCars(requestBody),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
