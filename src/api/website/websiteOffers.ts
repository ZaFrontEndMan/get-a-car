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
export const getMostPopularOffers = async (
  pageIndex: number,
  pageSize: number
): Promise<Offer[]> => {
  const { data } = await axiosInstance.get(
    "/Client/Website/CarAllOffers?pageSize=22418337&pageIndex=22418337",
    {
      params: { pageIndex, pageSize },
    }
  );

  // API wraps inside `data`
  return data.data;
};
