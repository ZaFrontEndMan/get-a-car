// src/hooks/useCars.ts
import { useQuery } from "@tanstack/react-query";
import {
  getAllCars,
  getMostPopularCars,
  AllCarsResponse,
  Car,
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
    keepPreviousData: true, // smooth pagination
  });
};

// 🔹 Hook: Get most popular cars (short list, e.g. 6)
export const useMostPopularCars = (pageIndex: number, pageSize: number) => {
  return useQuery<Car[]>({
    queryKey: ["mostPopularCars", pageIndex, pageSize],
    queryFn: () => getMostPopularCars(pageIndex, pageSize),
  });
};
