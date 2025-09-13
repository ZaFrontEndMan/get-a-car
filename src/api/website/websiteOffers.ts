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
  fuelType?: string;
  branch?: string;
  vendorName?: string;
  transmission?: string;
  type?: string;
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

export interface PopularCarsResponse {
  isSuccess: boolean;
  data: PopularCar[];
}

export interface PopularOffersResponse {
  isSuccess: boolean;
  data: Offer[];
}

export interface CarFilter {
  header: string;
  filterData: { name: string; quantity: number }[];
}

export interface AllOffersResponse {
  carSearchResult: Offer[];
  carsCommonProp: {
    data: CarFilter[];
    maxPrice: number;
  };
  totalRecord: number;
  totalPages: number;
}

// ---------- API Functions ----------

// Filter interface for offers
interface OfferFilters {
  searchTerm?: string;
  priceRange?: [number, number];
  selectedVendors?: string[];
  selectedCategories?: string[];
}

// Get all offers (paginated only - filtering done locally)
export const getAllOffers = async (
  pageIndex: number,
  pageSize: number
): Promise<AllOffersResponse> => {
  // Prepare pagination parameters
  const params: any = {
    pageIndex,
    pageSize,
  };

  const { data } = await axiosInstance.get("/Client/Website/CarAllOffers", {
    params,
  });

  // API wraps inside `data`
  return data.data;
};

// Get most popular offers (short list)
export const getMostPopularOffers = async (): Promise<PopularOffersResponse> => {
  const { data } = await axiosInstance.get("/Client/Website/getMostPopularOffers");
  return data;
};

// Get most popular cars
export const getMostPopularCars = async (): Promise<PopularCarsResponse> => {
  const { data } = await axiosInstance.get("/Client/Website/GetMostPopularCars");
  return data;
};
