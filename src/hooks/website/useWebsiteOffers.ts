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

// 🔹 Hook: Get all offers (paginated only - filtering done locally)
export const useAllOffers = (pageIndex: number, pageSize: number) => {
  return useQuery<AllOffersResponse>({
    queryKey: ["allOffers", pageIndex, pageSize],
    queryFn: () => getAllOffers(pageIndex, pageSize),
    keepPreviousData: true,
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
