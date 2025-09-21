import axiosInstance from "./../../utils/axiosInstance";

// ---------- Types ----------

// Car object
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
}

// Rental Car Details Response Types
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

// Filter option
export interface FilterOption {
  name: string;
  quantity: number;
}

// Filter group (vendorNames, branches, types, transmissions, fuelTypes)
export interface CarFilter {
  header: "vendorNames" | "branches" | "types" | "transmissions" | "fuelTypes";
  filterData: FilterOption[];
}

// API response for all cars
export interface AllCarsResponse {
  carSearchResult: Car[];
  carsCommonProp: {
    data: CarFilter[];
    maxPrice: number;
  };
  totalRecord: number;
  totalPages: number;
}

// ---------- API Functions ----------

// Server-side filter interface
export interface CarsFilters {
  vendorNames?: string[];
  types?: string[];
  transmissions?: string[];
  fuelTypes?: string[];
  branches?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

// Get all cars with server-side filtering (POST request)
export const getAllCars = async (
  pageIndex: number,
  pageSize: number,
  filters?: CarsFilters
): Promise<AllCarsResponse> => {
  // Prepare request body with only filters
  const requestBody: Record<string, unknown> = {};

  // Add filters to body if provided
  if (filters) {
    if (filters.vendorNames && filters.vendorNames.length > 0) {
      requestBody.vendorNames = filters.vendorNames;
    }
    if (filters.types && filters.types.length > 0) {
      requestBody.types = filters.types;
    }
    if (filters.transmissions && filters.transmissions.length > 0) {
      requestBody.transmissions = filters.transmissions;
    }
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      requestBody.fuelTypes = filters.fuelTypes;
    }
    if (filters.branches && filters.branches.length > 0) {
      requestBody.branches = filters.branches;
    }
    if (filters.priceRange) {
      requestBody.priceRange = filters.priceRange;
    }
  }

  // Add pagination as query parameters
  const params = {
    pageIndex,
    pageSize,
  };

  const { data } = await axiosInstance.post("/Client/Website/FilterGetAllCars", requestBody, {
    params,
  });

  // API wraps inside `data`
  return data.data;
};

// Get most popular cars (short list, e.g. top 6)
export const getMostPopularCars = async (
  pageIndex: number,
  pageSize: number
): Promise<Car[]> => {
  const { data } = await axiosInstance.get("/Client/Website/GetAllCars", {
    params: { pageIndex, pageSize },
  });

  return data.data.carSearchResult; // ✅ make sure we return array of cars
};

// Get rental car details by ID
export const getRentalCarDetailsById = async (
  carId: number,
  offerId: number
): Promise<RentalCarDetailsResponse> => {
  const { data } = await axiosInstance.get("/Client/Website/GetRentalCarDetaisById", {
    params: { carId, offerId },
  });

  return data;
};

// Get car details by ID only (without offerId)
export const getCarDetailsById = async (
  carId: number
): Promise<RentalCarDetailsResponse> => {
  const { data } = await axiosInstance.get("/Client/Website/GetRentalCarDetaisById", {
    params: { carId, offerId: carId }, // Use carId as offerId for backward compatibility
  });

  return data;
};

// Get similar cars
export const getSimilarCars = async (requestBody: {
  types: string[];
  pickUpLocations: string[];
  maxPrice: number;
}): Promise<{ isSuccess: boolean; customMessage: string; data: Car[] }> => {
  const { data } = await axiosInstance.post("/Client/Website/GetSimilarCars", requestBody);
  return data;
};
