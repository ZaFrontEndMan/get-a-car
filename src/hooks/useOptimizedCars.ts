import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getAllCars,
  getMostPopularCars,
  AllCarsResponse,
  Car,
  CarsFilters,
} from "@/api/website/websiteCars";

// Cache configuration
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const PREFETCH_PAGES = 2; // Number of pages to prefetch ahead

// Enhanced hook with caching and prefetching
export const useOptimizedCars = (
  pageIndex: number,
  pageSize: number,
  filters?: CarsFilters
): UseQueryResult<AllCarsResponse> & {
  prefetchNextPages: () => void;
  prefetchPreviousPage: () => void;
} => {
  const queryClient = useQueryClient();

  // Main query with optimized caching
  const query = useQuery<AllCarsResponse>({
    queryKey: ["allCars", pageIndex, pageSize, filters],
    queryFn: () => getAllCars(pageIndex, pageSize, filters),
    keepPreviousData: true,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Prefetch next pages function
  const prefetchNextPages = () => {
    if (query.data) {
      const totalPages = query.data.totalPages;
      
      for (let i = 1; i <= PREFETCH_PAGES; i++) {
        const nextPage = pageIndex + i;
        if (nextPage < totalPages) {
          queryClient.prefetchQuery({
            queryKey: ["allCars", nextPage, pageSize, filters],
            queryFn: () => getAllCars(nextPage, pageSize, filters),
            staleTime: STALE_TIME,
            cacheTime: CACHE_TIME,
          });
        }
      }
    }
  };

  // Prefetch previous page function
  const prefetchPreviousPage = () => {
    if (pageIndex > 0) {
      const prevPage = pageIndex - 1;
      queryClient.prefetchQuery({
        queryKey: ["allCars", prevPage, pageSize, filters],
        queryFn: () => getAllCars(prevPage, pageSize, filters),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
      });
    }
  };

  // Auto-prefetch on successful data load
  useEffect(() => {
    if (query.isSuccess && query.data) {
      // Prefetch next pages after a short delay
      const timer = setTimeout(() => {
        prefetchNextPages();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [query.isSuccess, query.data, pageIndex, pageSize, filters]);

  return {
    ...query,
    prefetchNextPages,
    prefetchPreviousPage,
  };
};

// Optimized popular cars hook with background refetch
export const useOptimizedPopularCars = (
  pageIndex: number,
  pageSize: number
) => {
  return useQuery<Car[]>({
    queryKey: ["mostPopularCars", pageIndex, pageSize],
    queryFn: () => getMostPopularCars(pageIndex, pageSize),
    staleTime: STALE_TIME * 2, // Popular cars change less frequently
    cacheTime: CACHE_TIME * 2,
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 60 * 1000, // Background refetch every 10 minutes
    retry: 1,
  });
};

// Hook for invalidating cars cache when needed
export const useCarsCache = () => {
  const queryClient = useQueryClient();

  const invalidateAllCars = () => {
    queryClient.invalidateQueries({ queryKey: ["allCars"] });
  };

  const invalidatePopularCars = () => {
    queryClient.invalidateQueries({ queryKey: ["mostPopularCars"] });
  };

  const clearCarsCache = () => {
    queryClient.removeQueries({ queryKey: ["allCars"] });
    queryClient.removeQueries({ queryKey: ["mostPopularCars"] });
  };

  const prefetchCarsPage = (pageIndex: number, pageSize: number, filters?: CarsFilters) => {
    return queryClient.prefetchQuery({
      queryKey: ["allCars", pageIndex, pageSize, filters],
      queryFn: () => getAllCars(pageIndex, pageSize, filters),
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
    });
  };

  return {
    invalidateAllCars,
    invalidatePopularCars,
    clearCarsCache,
    prefetchCarsPage,
  };
};

// Background sync hook for keeping data fresh
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up background sync every 5 minutes
    const interval = setInterval(() => {
      // Only refetch if user is active and online
      if (document.visibilityState === 'visible' && navigator.onLine) {
        queryClient.invalidateQueries({ 
          queryKey: ["allCars"],
          refetchType: 'active'
        });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);
};