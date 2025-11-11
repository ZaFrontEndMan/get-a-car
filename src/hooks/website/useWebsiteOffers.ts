// src/hooks/useOffers.ts
import {
  getMostPopularOffers,
  getMostPopularCars,
  getAllOffers,
  Offer,
  AllOffersResponse,
  PopularCarsResponse,
  PopularOffersResponse,
} from "@/api/website/websiteOffers";
import { useQuery } from "@tanstack/react-query";

// Define filter interface
interface OfferFilters {
  searchTerm?: string;
  priceRange?: [number, number];
  selectedVendors?: string[];
  selectedCategories?: string[];
}

// Updated hook to support server-side filtering
export const useAllOffers = (
  pageIndex: number = 1,
  pageSize: number = 12,
  filters?: {
    searchTerm?: string;
    vendors?: string[];
    types?: string[];
    transmissions?: string[];
    fuelTypes?: string[];
    branches?: string[];
    priceRange?: [number, number];
  }
) => {
  return useQuery<AllOffersResponse>({
    queryKey: ["allOffers", pageIndex, pageSize, JSON.stringify(filters)],
    queryFn: () => getAllOffers(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData, // smooth pagination
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    enabled: !!pageIndex && !!pageSize,
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// 🔹 Hook: Get most popular offers
export const useMostPopularOffers = () => {
  return useQuery<PopularOffersResponse>({
    queryKey: ["mostPopularOffers"],
    queryFn: () => getMostPopularOffers(),
    keepPreviousData: true,
  });
};

// 🔹 Hook: Get most popular cars
export const useMostPopularCars = () => {
  return useQuery<PopularCarsResponse>({
    queryKey: ["mostPopularCars"],
    queryFn: () => getMostPopularCars(),
    keepPreviousData: true,
  });
};
