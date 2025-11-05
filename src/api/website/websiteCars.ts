import axiosInstance from "./../../utils/axiosInstance";

export interface Car {
  carID: number;
  name: string;
  model: string;
  fuelType: string;
  branch: string;
  liter: string;
  doors: string;
  description: string;
  image: string | null;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  availability: boolean;
  isWishList: boolean | null;
  bookingCount: number;
  vendorName: string;
  transmission: string;
  vendorId: string;
  type: string;
  companyLogo: string;
  isGoodRating: number;
  pickUpLocations?: string[];
}

export interface CancellationPolicy {
  name: string;
  description: string;
}

export interface Protection {
  name: string;
  description: string;
}

export interface ProtectionsDto {
  protections: Protection[];
  protectionPrice: number | null;
}

export interface LocationDto {
  address: string | null;
  id: number;
}

export interface OptionalExtra {
  name: string;
  description: string;
  price: number;
}

export interface RentalCarDetails {
  carId: number;
  name: string;
  vendorName: string;
  liter: string;
  doors: string;
  type: string;
  description: string;
  model: string;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  companyLogo: string;
  isGoodRating: number;
  ratingCount: number;
  isWishList: boolean;
  vendorId: string;
  isOfferedCar: boolean;
  startDateAvailableBooking: string | null;
  endDateAvailableBooking: string | null;
  withDriver: boolean;
  withDriverPricePerDay: number | null;
  cancellationPoliciesDto: CancellationPolicy[];
  protectionsDto: ProtectionsDto;
  pickUpLocationDto: LocationDto[];
  dropOffLocationDto: LocationDto[];
  imageURLs: string[];
  optionalExtras: OptionalExtra[];
  offerCollectionForCars: unknown | null;
}

export interface RentalCarDetailsResponse {
  isSuccess: boolean;
  customMessage: string;
  data: RentalCarDetails;
}

export interface FilterOption {
  name: string;
  quantity: number;
}

export interface CarFilter {
  header:
    | "vendorNames"
    | "branches"
    | "types"
    | "transmissions"
    | "fuelTypes"
    | "makes"
    | "carCapacities";
  filterData: FilterOption[];
}

export interface CarsFilters {
  vendorNames?: string[];
  types?: string[];
  transmissions?: string[];
  fuelTypes?: string[];
  branches?: string[];
  makes?: string[]; // New: car makes/models
  carCapacities?: string[]; // New: passenger capacity or similar
  priceRange?: {
    min: number;
    max: number;
  };
  pickupLocation?: string;
  dropOffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  withDriver?: boolean;
}

// NEW: Export VendorCarsFilters type for use in hooks
export type VendorCarsFilters = Omit<CarsFilters, "vendorNames">;

export interface AllCarsResponse {
  carSearchResult: Car[];
  carsCommonProp: {
    data: CarFilter[];
    maxPrice: number;
  };
  totalRecord: number;
  totalPages: number;
  pageIndex: number;
}

export interface VendorCarsResponse {
  carSearchResult: Car[];
  carsCommonProp: {
    data: CarFilter[];
    maxPrice: number;
  };
  totalRecord: number;
  totalPages: number;
  pageIndex: number;
}

// Shared helper function to build request body from filters
const buildFilterRequestBody = (
  filters?: CarsFilters
): Record<string, unknown> => {
  const requestBody: Record<string, unknown> = {};

  if (!filters) {
    return requestBody;
  }

  // Common filter logic for arrays
  if (filters.vendorNames?.length) {
    requestBody.vendorNames = filters.vendorNames;
  }
  if (filters.types?.length) {
    requestBody.types = filters.types;
  }
  if (filters.transmissions?.length) {
    requestBody.transmissions = filters.transmissions;
  }
  if (filters.fuelTypes?.length) {
    requestBody.fuelTypes = filters.fuelTypes;
  }
  if (filters.branches?.length) {
    requestBody.branches = filters.branches;
  }
  if (filters.makes?.length) {
    requestBody.makes = filters.makes;
  }
  if (filters.carCapacities?.length) {
    requestBody.carCapacities = filters.carCapacities;
  }
  // Price range
  if (filters.priceRange) {
    requestBody.priceRange = filters.priceRange;
  }
  // Location and date filters
  if (filters.pickupLocation) {
    requestBody.pickupLocation = filters.pickupLocation;
  }
  if (filters.dropOffLocation) {
    requestBody.dropOffLocation = filters.dropOffLocation;
  }
  if (filters.pickupDate) {
    requestBody.pickupDate = filters.pickupDate;
  }
  if (filters.dropoffDate) {
    requestBody.dropoffDate = filters.dropoffDate;
  }
  if (filters.withDriver !== undefined) {
    requestBody.withDriver = filters.withDriver;
  }

  return requestBody;
};

// Get all cars with optional filters
export const getAllCars = async (
  pageIndex: number,
  pageSize: number,
  filters?: CarsFilters
): Promise<AllCarsResponse> => {
  const requestBody = buildFilterRequestBody(filters);

  const params = {
    pageIndex,
    pageSize,
  };

  const { data } = await axiosInstance.post(
    "/Client/Website/FilterGetAllCars",
    requestBody,
    { params }
  );

  return data.data;
};

// Get vendor-specific cars with filters
export const getVendorCarWithFilter = async (
  vendorId: string,
  pageIndex: number,
  pageSize: number,
  filters?: VendorCarsFilters // Now using the exported type
): Promise<VendorCarsResponse> => {
  const requestBody = buildFilterRequestBody(filters as CarsFilters); // Cast for the helper function
  
  // Always include vendorId for this endpoint
  requestBody.vendorId = vendorId;

  const params = {
    pageIndex,
    pageSize,
  };

  const { data } = await axiosInstance.post(
    "/Client/Website/GetVendorCarWithFilter",
    requestBody,
    { params }
  );

  return data.data;
};

// Get most popular cars (no filters)
export const getMostPopularCars = async (
  pageIndex: number,
  pageSize: number
): Promise<Car[]> => {
  const { data } = await axiosInstance.get("/Client/Website/GetAllCars", {
    params: { pageIndex, pageSize },
  });

  return data.data.carSearchResult;
};

// Get rental car details by ID with offer
export const getRentalCarDetailsById = async (
  carId: number,
  offerId: number
): Promise<RentalCarDetailsResponse> => {
  const { data } = await axiosInstance.get(
    "/Client/Website/GetRentalCarDetaisById",
    {
      params: { carId, offerId },
    }
  );

  return data;
};

// Get car details by ID (uses carId as offerId)
export const getCarDetailsById = async (
  carId: number
): Promise<RentalCarDetailsResponse> => {
  const { data } = await axiosInstance.get(
    "/Client/Website/GetRentalCarDetaisById",
    {
      params: { carId, offerId: carId },
    }
  );

  return data;
};

// Get similar cars based on criteria
export const getSimilarCars = async (requestBody: {
  types: string[];
  pickUpLocations: string[];
  maxPrice: number;
}): Promise<{ isSuccess: boolean; customMessage: string; data: Car[] }> => {
  const { data } = await axiosInstance.post(
    "/Client/Website/GetSimilarCars",
    requestBody
  );
  return data;
};
