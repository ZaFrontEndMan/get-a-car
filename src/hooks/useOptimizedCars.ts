import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  getAllCars,
  getMostPopularCars,
  AllCarsResponse,
  Car,
  CarsFilters,
} from "@/api/website/websiteCars";

const CACHE_TIME = 5 * 60 * 1000;
const STALE_TIME = 10 * 60 * 1000;
const PREFETCH_PAGES = 2;

export const useOptimizedCars = (
  pageIndex: number,
  pageSize: number,
  filters?: CarsFilters
): UseQueryResult<AllCarsResponse> & {
  prefetchNextPages: () => void;
  prefetchPreviousPage: () => void;
} => {
  const queryClient = useQueryClient();

  const query = useQuery<AllCarsResponse>({
    queryKey: ["allCars", pageIndex, pageSize, filters],
    queryFn: () => getAllCars(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

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
          });
        }
      }
    }
  };

  const prefetchPreviousPage = () => {
    if (pageIndex > 0) {
      const prevPage = pageIndex - 1;
      queryClient.prefetchQuery({
        queryKey: ["allCars", prevPage, pageSize, filters],
        queryFn: () => getAllCars(prevPage, pageSize, filters),
        staleTime: STALE_TIME,
      });
    }
  };

  const prefetchTimerRef = useRef<NodeJS.Timeout>();
  const lastPrefetchRef = useRef<string>("");

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const prefetchKey = `${pageIndex}-${pageSize}`;

      if (lastPrefetchRef.current !== prefetchKey) {
        lastPrefetchRef.current = prefetchKey;

        if (prefetchTimerRef.current) {
          clearTimeout(prefetchTimerRef.current);
        }

        prefetchTimerRef.current = setTimeout(() => {
          prefetchNextPages();
        }, 500);
      }
    }

    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, [query.isSuccess, query.data, pageIndex, pageSize]);

  return {
    ...query,
    prefetchNextPages,
    prefetchPreviousPage,
  };
};

export const useOptimizedPopularCars = (
  pageIndex: number,
  pageSize: number
) => {
  return useQuery<Car[]>({
    queryKey: ["mostPopularCars", pageIndex, pageSize],
    queryFn: () => getMostPopularCars(pageIndex, pageSize),
    staleTime: STALE_TIME * 2,
    gcTime: CACHE_TIME * 2,
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
  });
};

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

  const prefetchCarsPage = (
    pageIndex: number,
    pageSize: number,
    filters?: CarsFilters
  ) => {
    return queryClient.prefetchQuery({
      queryKey: ["allCars", pageIndex, pageSize, filters],
      queryFn: () => getAllCars(pageIndex, pageSize, filters),
      staleTime: STALE_TIME,
    });
  };

  return {
    invalidateAllCars,
    invalidatePopularCars,
    clearCarsCache,
    prefetchCarsPage,
  };
};

export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        queryClient.invalidateQueries({
          queryKey: ["allCars"],
          refetchType: "active",
        });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);
};
