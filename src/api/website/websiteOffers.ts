// src/api/website/websiteOffers.ts
import axiosInstance from "./../../utils/axiosInstance";

// ---------- Types ----------
export interface Offer {
  id: number;
  offerTitle: string;
  offerDescription: string;
  offerImage: string;
  oldPricePerDay: number;
  oldPricePerWeek: number;
  oldPricePerMonth: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  companyLogo: string;
  carId: number;
  fuelType: string;
  branch: string;
  vendorName: string;
  transmission: string;
  type: string;
}

export interface FilterOption {
  name: string;
  quantity: number;
}

export interface PopularCar {
  carID: number;
  name: string;
  model: string;
  liter: string;
  doors: string;
  type: string;
  image: string | null;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  availability: boolean;
  isWishList: boolean | null;
  isGoodRating: boolean | null;
  bookingCount: number;
}

export interface CarFilter {
  header: "vendorNames" | "branches" | "types" | "transmissions" | "fuelTypes";
  filterData: FilterOption[];
}

export interface PopularCarsResponse {
  isSuccess: boolean;
  data: PopularCar[];
}

export interface PopularOffersResponse {
  isSuccess: boolean;
  data: Offer[];
}

// Updated AllOffersResponse to match your actual API structure
export interface AllOffersResponse {
  isSuccess: boolean;
  customMessage: string;
  data: {
    carSearchResult: Offer[];
    carsCommonProp: {
      data: CarFilter[];
      maxPrice: number;
    };
    totalRecord: number;
    totalPages: number;
    pageIndex: number;
    pageSize: number;
  };
}

// ---------- Filter Interfaces ----------
export interface OfferFilters {
  vendorNames?: string[];
  types?: string[];
  fuelTypes?: string[];
  branches?: string[];
  transmissions?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

// ---------- Helper Functions ----------
// Build request body for offers filtering - WRAPS in carFilterationDto
const buildOffersFilterRequestBody = (
  filters?: OfferFilters
): {
  vendorNames?: string[];
  types?: string[];
  fuelTypes?: string[];
  branches?: string[];
  transmissions?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
} => {
  // Build the inner object first
  const innerFilters = {
    vendorNames: filters?.vendorNames || [],
    types: filters?.types || [],
    fuelTypes: filters?.fuelTypes || [],
    branches: filters?.branches || [],
    transmissions: filters?.transmissions || [],
    priceRange: filters?.priceRange,
  };

  // Wrap everything in carFilterationDto
  return {
    vendorNames: innerFilters.vendorNames,
    types: innerFilters.types,
    fuelTypes: innerFilters.fuelTypes,
    branches: innerFilters.branches,
    transmissions: innerFilters.transmissions,
    priceRange: innerFilters.priceRange,
  };
};

// ---------- API Functions ----------
// Get all offers with server-side filtering (fixed structure)
export const getAllOffers = async (
  pageIndex: number,
  pageSize: number,
  filters?: OfferFilters
): Promise<AllOffersResponse> => {
  // Build the REQUIRED carFilterationDto structure
  const requestBody = buildOffersFilterRequestBody(filters);

  // Prepare pagination parameters
  const params: any = {
    pageIndex,
    pageSize,
  };

  try {
    const { data } = await axiosInstance.post(
      "/Client/Website/FilterCarAllOffers", // Your filtering endpoint
      requestBody, // Always complete carFilterationDto object
      { params }
    );

    // Return the entire response (including isSuccess and customMessage)
    return data;
  } catch (error: any) {
    console.error("Error fetching offers:", error);
    console.error("Request body was:", requestBody);
    if (error.response?.data) {
      console.error("API Error Response:", error.response.data);
    }
    throw error;
  }
};

// Get all offers (legacy - no filtering, pagination only)
export const getAllOffersLegacy = async (
  pageIndex: number,
  pageSize: number
): Promise<AllOffersResponse> => {
  // Build empty filters to maintain consistent API structure
  const emptyFilters = buildOffersFilterRequestBody({
    vendorNames: [],
    types: [],
    fuelTypes: [],
    branches: [],
    transmissions: [],
    priceRange: undefined,
  });

  return getAllOffers(pageIndex, pageSize, {
    vendorNames: [],
    types: [],
    fuelTypes: [],
    branches: [],
    transmissions: [],
  });
};

// Get most popular offers (short list)
export const getMostPopularOffers = async (
  pageIndex: number = 1,
  pageSize: number = 5
): Promise<PopularOffersResponse> => {
  const params = {
    pageIndex,
    pageSize,
  };

  try {
    const { data } = await axiosInstance.get(
      "/Client/Website/getMostPopularOffers",
      {
        params,
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching popular offers:", error);
    throw error;
  }
};

// Get most popular cars (existing function - unchanged)
export const getMostPopularCars = async (
  pageIndex: number = 1,
  pageSize: number = 8
): Promise<PopularCarsResponse> => {
  const params = {
    pageIndex,
    pageSize,
  };

  try {
    const { data } = await axiosInstance.get(
      "/Client/Website/GetMostPopularCars",
      {
        params,
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching popular cars:", error);
    throw error;
  }
};

// ---------- Additional Helper Functions ----------
// Clean up string data (remove \r\n and trim whitespace)
export const cleanString = (str?: string): string => {
  return str ? str.replace(/\r?\n/g, "").trim() : "";
};

// Get offer image URL (handles your specific path format)
export const getOfferImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop";
  }

  // Replace backslashes with forward slashes and ensure proper path
  const cleanPath = imagePath.replace(/\\/g, "/").trim();
  return `https://test.get2cars.com/${cleanPath}`;
};

// Get company logo URL
export const getCompanyLogoUrl = (logoPath?: string): string | null => {
  if (!logoPath) {
    return null;
  }

  // Replace backslashes with forward slashes and ensure proper path
  const cleanPath = logoPath.replace(/\\/g, "/").trim();
  return `https://test.get2cars.com/${cleanPath}`;
};

// Calculate discount percentage (with safety checks)
export const calculateDiscount = (
  oldPrice: number,
  newPrice: number
): string => {
  if (!oldPrice || oldPrice <= 0 || !newPrice || newPrice < 0) {
    return "0%";
  }

  // Ensure discount doesn't exceed 100%
  const discountPercent = Math.min(
    Math.round(((oldPrice - newPrice) / oldPrice) * 100),
    100
  );
  return `${discountPercent}%`;
};

// ---------- Type Guards ----------
// Check if response is successful
export const isSuccessfulResponse = (
  response: any
): response is AllOffersResponse => {
  return response && response.isSuccess === true;
};

// Extract filter data from carsCommonProp
export const extractFilterData = (carsCommonProp?: {
  data: CarFilter[];
  maxPrice?: number;
}): {
  vendorNames?: FilterOption[];
  branches?: FilterOption[];
  types?: FilterOption[];
  transmissions?: FilterOption[];
  fuelTypes?: FilterOption[];
  maxPrice?: number;
} => {
  if (!carsCommonProp?.data) {
    return {
      vendorNames: [],
      branches: [],
      types: [],
      transmissions: [],
      fuelTypes: [],
      maxPrice: 2000,
    };
  }

  const filterMap = new Map<string, FilterOption[]>();
  carsCommonProp.data.forEach((item) => {
    if (item.filterData && item.filterData.length > 0) {
      filterMap.set(item.header, item.filterData);
    }
  });

  return {
    vendorNames: filterMap.get("vendorNames"),
    branches: filterMap.get("branches"),
    types: filterMap.get("types"),
    transmissions: filterMap.get("transmissions"),
    fuelTypes: filterMap.get("fuelTypes"),
    maxPrice: carsCommonProp.maxPrice || 2000,
  };
};

// Validate filter data
export const validateFilters = (filters?: OfferFilters): OfferFilters => {
  if (!filters) {
    return {
      vendorNames: [],
      types: [],
      fuelTypes: [],
      branches: [],
      transmissions: [],
    };
  }

  return {
    vendorNames: filters.vendorNames?.filter(Boolean) || [],
    types: filters.types?.filter(Boolean) || [],
    fuelTypes: filters.fuelTypes?.filter(Boolean) || [],
    branches: filters.branches?.filter(Boolean) || [],
    transmissions: filters.transmissions?.filter(Boolean) || [],
  };
};

// Create empty filter object (for consistent API calls)
export const createEmptyFilters = (): OfferFilters => ({
  vendorNames: [],
  types: [],
  fuelTypes: [],
  branches: [],
  transmissions: [],
});
