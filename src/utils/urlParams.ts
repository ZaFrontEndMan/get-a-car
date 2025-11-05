import { CarsFilters } from "../api/website/websiteCars";

// Helper type for vendor-aware filters
type VendorAwareFilters = CarsFilters | { vendorId?: string };

export const parseUrlParamsToFilters = (
  searchParams: URLSearchParams
): CarsFilters => {
  const filters: CarsFilters = {};

  const vendorParam = searchParams.get("vendor");
  if (vendorParam) {
    const vendors = vendorParam
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (vendors.length > 0) filters.vendorNames = vendors;
  }

  const typeParam = searchParams.get("type");
  if (typeParam) {
    const types = typeParam
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (types.length > 0) filters.types = types;
  }

  const fuelTypeParam = searchParams.get("fuelType");
  if (fuelTypeParam) {
    const fuelTypes = fuelTypeParam
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    if (fuelTypes.length > 0) filters.fuelTypes = fuelTypes;
  }

  const branchParam = searchParams.get("branch");
  if (branchParam) {
    const branches = branchParam
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    if (branches.length > 0) filters.branches = branches;
  }

  const transmissionParam = searchParams.get("transmission");
  if (transmissionParam) {
    const transmissions = transmissionParam
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (transmissions.length > 0) filters.transmissions = transmissions;
  }

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  if (minPriceParam || maxPriceParam) {
    const min = minPriceParam ? parseFloat(minPriceParam) : 0;
    const max = maxPriceParam ? parseFloat(maxPriceParam) : 2000;
    if (min !== 0 || max !== 2000) {
      filters.priceRange = { min, max };
    }
  }

  const pickupLocationParam = searchParams.get("pickupLocation");
  if (pickupLocationParam) filters.pickupLocation = pickupLocationParam;

  const dropOffLocationParam = searchParams.get("dropOffLocation");
  if (dropOffLocationParam) filters.dropOffLocation = dropOffLocationParam;

  const pickupDateParam = searchParams.get("pickupDate");
  if (pickupDateParam) filters.pickupDate = pickupDateParam;

  const dropoffDateParam = searchParams.get("dropoffDate");
  if (dropoffDateParam) filters.dropoffDate = dropoffDateParam;

  const withDriverParam = searchParams.get("withDriver");
  if (withDriverParam)
    filters.withDriver = withDriverParam.toLowerCase() === "true";

  return filters;
};

export const filtersToUrlParams = (filters: CarsFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.vendorNames?.length) {
    params.set("vendor", filters.vendorNames.join(","));
  }

  if (filters.types?.length) {
    params.set("type", filters.types.join(","));
  }

  if (filters.fuelTypes?.length) {
    params.set("fuelType", filters.fuelTypes.join(","));
  }

  if (filters.branches?.length) {
    params.set("branch", filters.branches.join(","));
  }

  if (filters.transmissions?.length) {
    params.set("transmission", filters.transmissions.join(","));
  }

  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.set("minPrice", filters.priceRange.min.toString());
    }
    if (filters.priceRange.max < 2000) {
      params.set("maxPrice", filters.priceRange.max.toString());
    }
  }

  if (filters.pickupLocation) {
    params.set("pickupLocation", filters.pickupLocation);
  }

  if (filters.dropOffLocation) {
    params.set("dropOffLocation", filters.dropOffLocation);
  }

  if (filters.pickupDate) {
    params.set("pickupDate", filters.pickupDate);
  }

  if (filters.dropoffDate) {
    params.set("dropoffDate", filters.dropoffDate);
  }

  if (filters.withDriver !== undefined) {
    params.set("withDriver", filters.withDriver.toString());
  }

  return params;
};

// Updated function with optional vendorId parameter
export const updateUrlWithFilters = (
  filters: CarsFilters,
  vendorId?: string | undefined
): void => {
  const params = filtersToUrlParams(filters);

  // If vendorId is provided, add it to the URL params
  if (vendorId) {
    params.set("id", vendorId);
  }

  const queryString = params.toString();
  const newUrl = queryString ? `?${queryString}` : window.location.pathname;

  window.history.replaceState({}, "", newUrl);
};

export const areFiltersEqual = (
  filters1: CarsFilters,
  filters2: CarsFilters
): boolean => {
  return JSON.stringify(filters1) === JSON.stringify(filters2);
};
