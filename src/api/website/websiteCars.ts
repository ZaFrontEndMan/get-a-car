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

// Filter interface for cars (client-side filtering)
interface CarsFilters {
  searchTerm?: string;
  priceRange?: [number, number];
  selectedVendors?: string[];
  selectedBranches?: string[];
  selectedTypes?: string[];
  selectedTransmissions?: string[];
  selectedFuelTypes?: string[];
}

// Get all cars (paginated)
export const getAllCars = async (
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
): Promise<AllCarsResponse> => {
  // Base params
  const params: any = { pageIndex, pageSize };
  
  // Add filters if provided
  if (filters) {
    if (filters.vendors && filters.vendors.length > 0) {
      params.vendors = filters.vendors.join(',');
    }
    if (filters.types && filters.types.length > 0) {
      params.types = filters.types.join(',');
    }
    if (filters.transmissions && filters.transmissions.length > 0) {
      params.transmissions = filters.transmissions.join(',');
    }
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      params.fuelTypes = filters.fuelTypes.join(',');
    }
    if (filters.branches && filters.branches.length > 0) {
      params.branches = filters.branches.join(',');
    }
    if (filters.priceRange) {
      params.minPrice = filters.priceRange[0];
      params.maxPrice = filters.priceRange[1];
    }
  }

  const { data } = await axiosInstance.get("/Client/Website/GetAllCars", {
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
