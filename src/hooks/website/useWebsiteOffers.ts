// src/hooks/useOffers.ts
import {
  getMostPopularOffers,
  getAllOffers,
  Offer,
  AllOffersResponse,
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
export const useMostPopularOffers = (pageIndex: number, pageSize: number) => {
  return useQuery<Offer[]>({
    queryKey: ["mostPopularOffers", pageIndex, pageSize],
    queryFn: () => getMostPopularOffers(pageIndex, pageSize),
    keepPreviousData: true,
  });
};
