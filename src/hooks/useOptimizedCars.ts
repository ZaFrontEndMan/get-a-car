import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import {
  getAllCars,
  getVendorCarWithFilter,
  getMostPopularCars,
  AllCarsResponse,
  VendorCarsResponse,
  Car,
  CarsFilters,
  VendorCarsFilters,
} from "@/api/website/websiteCars";

const CACHE_TIME = 5 * 60 * 1000;
const STALE_TIME = 10 * 60 * 1000;
const PREFETCH_PAGES = 2;
const PREFETCH_DELAY = 500;

/**
 * Your original hook with keepPreviousData: true and vendor support
 * Maintains exact same API and behavior
 */
export const useOptimizedCars = (
  pageIndex: number,
  pageSize: number,
  filters?: CarsFilters
): UseQueryResult<AllCarsResponse> & {
  prefetchNextPages: () => void;
  prefetchPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} => {
  const queryClient = useQueryClient();

  const query = useQuery<AllCarsResponse>({
    queryKey: ["allCars", pageIndex, pageSize, JSON.stringify(filters || {})],
    queryFn: () => getAllCars(pageIndex, pageSize, filters),
    keepPreviousData: true, // Always keep previous data for smooth pagination
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const prefetchNextPages = useCallback(() => {
    if (query.data?.totalPages) {
      const totalPages = query.data.totalPages;

      for (let i = 1; i <= PREFETCH_PAGES; i++) {
        const nextPage = pageIndex + i;
        if (nextPage <= totalPages) {
          // Fixed: <= totalPages, not <
          queryClient.prefetchQuery({
            queryKey: [
              "allCars",
              nextPage,
              pageSize,
              JSON.stringify(filters || {}),
            ],
            queryFn: () => getAllCars(nextPage, pageSize, filters),
            staleTime: STALE_TIME,
            keepPreviousData: true,
          });
        }
      }
    }
  }, [query.data?.totalPages, pageIndex, pageSize, filters, queryClient]);

  const prefetchPreviousPage = useCallback(() => {
    if (pageIndex > 1) {
      // Fixed: pageIndex > 1, not > 0
      const prevPage = pageIndex - 1;
      queryClient.prefetchQuery({
        queryKey: [
          "allCars",
          prevPage,
          pageSize,
          JSON.stringify(filters || {}),
        ],
        queryFn: () => getAllCars(prevPage, pageSize, filters),
        staleTime: STALE_TIME,
        keepPreviousData: true,
      });
    }
  }, [pageIndex, pageSize, filters, queryClient]);

  // Your original prefetch timing logic (kept exactly the same)
  const prefetchTimerRef = useRef<NodeJS.Timeout>();
  const lastPrefetchRef = useRef<string>("");

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const prefetchKey = `${pageIndex}-${pageSize}-${JSON.stringify(
        filters || {}
      )}`; // Include filters in key

      if (lastPrefetchRef.current !== prefetchKey) {
        lastPrefetchRef.current = prefetchKey;

        if (prefetchTimerRef.current) {
          clearTimeout(prefetchTimerRef.current);
        }

        prefetchTimerRef.current = setTimeout(() => {
          prefetchNextPages();
        }, PREFETCH_DELAY);
      }
    }

    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, [
    query.isSuccess,
    query.data,
    pageIndex,
    pageSize,
    filters,
    prefetchNextPages,
  ]);

  // Added your requested pagination helpers
  const hasNextPage = !!(
    query.data && pageIndex < (query.data.totalPages || 0)
  );
  const hasPreviousPage = pageIndex > 1;

  return {
    ...query,
    prefetchNextPages,
    prefetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

/**
 * NEW: Vendor-specific version of your original hook
 * Same API and patterns as useOptimizedCars
 */
export const useOptimizedVendorCars = (
  vendorId: string,
  pageIndex: number,
  pageSize: number,
  filters?: VendorCarsFilters
): UseQueryResult<VendorCarsResponse> & {
  prefetchNextPages: () => void;
  prefetchPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} => {
  const queryClient = useQueryClient();

  const query = useQuery<VendorCarsResponse>({
    queryKey: [
      "vendorCars",
      vendorId,
      pageIndex,
      pageSize,
      JSON.stringify(filters || {}),
    ],
    queryFn: () =>
      getVendorCarWithFilter(vendorId, pageIndex, pageSize, filters),
    keepPreviousData: true, // Always keep previous data for smooth pagination
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const prefetchNextPages = useCallback(() => {
    if (query.data?.totalPages) {
      const totalPages = query.data.totalPages;

      for (let i = 1; i <= PREFETCH_PAGES; i++) {
        const nextPage = pageIndex + i;
        if (nextPage <= totalPages) {
          queryClient.prefetchQuery({
            queryKey: [
              "vendorCars",
              vendorId,
              nextPage,
              pageSize,
              JSON.stringify(filters || {}),
            ],
            queryFn: () =>
              getVendorCarWithFilter(vendorId, nextPage, pageSize, filters),
            staleTime: STALE_TIME,
            keepPreviousData: true,
          });
        }
      }
    }
  }, [
    query.data?.totalPages,
    pageIndex,
    pageSize,
    filters,
    vendorId,
    queryClient,
  ]);

  const prefetchPreviousPage = useCallback(() => {
    if (pageIndex > 1) {
      const prevPage = pageIndex - 1;
      queryClient.prefetchQuery({
        queryKey: [
          "vendorCars",
          vendorId,
          prevPage,
          pageSize,
          JSON.stringify(filters || {}),
        ],
        queryFn: () =>
          getVendorCarWithFilter(vendorId, prevPage, pageSize, filters),
        staleTime: STALE_TIME,
        keepPreviousData: true,
      });
    }
  }, [pageIndex, pageSize, filters, vendorId, queryClient]);

  // Same timing logic as original hook
  const prefetchTimerRef = useRef<NodeJS.Timeout>();
  const lastPrefetchRef = useRef<string>("");

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const prefetchKey = `${vendorId}-${pageIndex}-${pageSize}-${JSON.stringify(
        filters || {}
      )}`;

      if (lastPrefetchRef.current !== prefetchKey) {
        lastPrefetchRef.current = prefetchKey;

        if (prefetchTimerRef.current) {
          clearTimeout(prefetchTimerRef.current);
        }

        prefetchTimerRef.current = setTimeout(() => {
          prefetchNextPages();
        }, PREFETCH_DELAY);
      }
    }

    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, [
    query.isSuccess,
    query.data,
    pageIndex,
    pageSize,
    filters,
    vendorId,
    prefetchNextPages,
  ]);

  const hasNextPage = !!(
    query.data && pageIndex < (query.data.totalPages || 0)
  );
  const hasPreviousPage = pageIndex > 1;

  return {
    ...query,
    prefetchNextPages,
    prefetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
};

/**
 * Your original popular cars hook (enhanced with keepPreviousData for pagination)
 */
export const useOptimizedPopularCars = (
  pageIndex: number,
  pageSize: number
): UseQueryResult<Car[]> => {
  return useQuery<Car[]>({
    queryKey: ["mostPopularCars", pageIndex, pageSize],
    queryFn: () => getMostPopularCars(pageIndex, pageSize),
    keepPreviousData: true, // Added for smooth pagination
    staleTime: STALE_TIME * 2,
    gcTime: CACHE_TIME * 2,
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Your original cache management hook (enhanced with vendor support)
 */
export const useCarsCache = () => {
  const queryClient = useQueryClient();

  // Your original methods (unchanged)
  const invalidateAllCars = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["allCars"] });
  }, [queryClient]);

  const invalidatePopularCars = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["mostPopularCars"] });
  }, [queryClient]);

  // NEW: Vendor-specific invalidation
  const invalidateVendorCars = useCallback(
    (vendorId?: string) => {
      if (vendorId) {
        queryClient.invalidateQueries({ queryKey: ["vendorCars", vendorId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["vendorCars"] });
      }
    },
    [queryClient]
  );

  // NEW: Invalidate all car-related queries
  const invalidateAllCarQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["allCars"] });
    queryClient.invalidateQueries({ queryKey: ["vendorCars"] });
    queryClient.invalidateQueries({ queryKey: ["mostPopularCars"] });
  }, [queryClient]);

  // Your original clear method (enhanced)
  const clearCarsCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["allCars"] });
    queryClient.removeQueries({ queryKey: ["mostPopularCars"] });
    queryClient.removeQueries({ queryKey: ["vendorCars"] }); // NEW
  }, [queryClient]);

  // Your original prefetch method (unchanged)
  const prefetchCarsPage = useCallback(
    (pageIndex: number, pageSize: number, filters?: CarsFilters) => {
      return queryClient.prefetchQuery({
        queryKey: [
          "allCars",
          pageIndex,
          pageSize,
          JSON.stringify(filters || {}),
        ],
        queryFn: () => getAllCars(pageIndex, pageSize, filters),
        staleTime: STALE_TIME,
        keepPreviousData: true,
      });
    },
    [queryClient]
  );

  // NEW: Prefetch vendor cars page
  const prefetchVendorCarsPage = useCallback(
    (
      vendorId: string,
      pageIndex: number,
      pageSize: number,
      filters?: VendorCarsFilters
    ) => {
      return queryClient.prefetchQuery({
        queryKey: [
          "vendorCars",
          vendorId,
          pageIndex,
          pageSize,
          JSON.stringify(filters || {}),
        ],
        queryFn: () =>
          getVendorCarWithFilter(vendorId, pageIndex, pageSize, filters),
        staleTime: STALE_TIME,
        keepPreviousData: true,
      });
    },
    [queryClient]
  );

  return {
    // Your original methods
    invalidateAllCars,
    invalidatePopularCars,
    clearCarsCache,
    prefetchCarsPage,

    // NEW vendor methods
    invalidateVendorCars,
    invalidateAllCarQueries,
    prefetchVendorCarsPage,
  };
};

/**
 * Your original background sync hook (enhanced)
 */
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        // Your original logic + vendor cars
        queryClient.invalidateQueries({
          queryKey: ["allCars"],
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: ["vendorCars"],
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: ["mostPopularCars"],
          refetchType: "active",
        });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);
};

/**
 * NEW: Simple hooks for other car-related endpoints (same pattern)
 */
export const useCarDetails = (carId: number, offerId?: number) => {
  return useQuery({
    queryKey: ["carDetails", carId, offerId],
    queryFn: () => getRentalCarDetailsById(carId, offerId ?? carId),
    keepPreviousData: true, // Consistent with pagination
    staleTime: 30 * 60 * 1000, // 30 minutes for details
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useSimilarCars = (
  types: string[],
  pickUpLocations: string[],
  maxPrice: number
) => {
  return useQuery({
    queryKey: ["similarCars", { types, pickUpLocations, maxPrice }],
    queryFn: () => getSimilarCars({ types, pickUpLocations, maxPrice }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
