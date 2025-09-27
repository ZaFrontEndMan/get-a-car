import axiosInstance from "../../utils/axiosInstance";
import { Favorite } from "../../types/favorites";
import { getImageUrl } from "@/utils/imageUtils";

// -----------------------
// API Response Types
// -----------------------
export interface ApiResponse<T> {
  isSuccess: boolean;
  customMessage?: string;
  data: T;
}

export interface WishlistItemApi {
  id: number;
  carId: number;
  carName: string;
  vendorName: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  liter?: string | null;
  doors?: string | null;
  type?: string | null;
  people?: number | null;
  carImage: string[];
  status: boolean;
}

// Helper to normalize unknown errors
const toError = (err: unknown, fallback: string) => {
  try {
    const anyErr: any = err;
    const msg = anyErr?.response?.data?.customMessage || anyErr?.message || fallback;
    return new Error(msg);
  } catch (_) {
    return new Error(fallback);
  }
};

// -----------------------
// API Calls
// -----------------------

// Get all favorites for the current user (Client WishList)
export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const { data } = await axiosInstance.get<ApiResponse<WishlistItemApi[]>>(
      "/Client/WishList/GetCustomerWishList"
    );

    if (!data?.isSuccess) {
      throw new Error(data?.customMessage || "Failed to fetch favorites");
    }

    const items = Array.isArray(data.data) ? data.data : [];

    const normalizePath = (p?: string) => (p ? p.replace(/\\/g, "/") : "");

    // Map API format -> UI Favorite type
    const mapped: Favorite[] = items.map((item) => ({
      id: String(item.id),
      user_id: "", // not provided by API
      car_id: String(item.carId),
      created_at: new Date().toISOString(), // not provided by API
      car: {
        id: String(item.carId),
        name: item.carName || "",
        brand: "", // unknown from API
        model: "", // unknown from API
        year: Number.parseInt(item.carName) || new Date().getFullYear(),
        type: item.type || "",
        daily_rate: item.pricePerDay ?? 0,
        images: (item.carImage || []).map((p) => getImageUrl(normalizePath(p))),
        vendor: {
          name: item.vendorName || "",
          logo_url: null, // not provided by API
        },
      },
    }));

    return mapped;
  } catch (err) {
    throw toError(err, "Unable to load favorites");
  }
};

// Add a car to favorites (Website endpoint expects carId)
export const addFavorite = async (carId: string | number) => {
  try {
    const carIdNum = typeof carId === "string" ? parseInt(carId, 10) : carId;
    const { data } = await axiosInstance.post<ApiResponse<unknown>>(
      `/Client/Website/AddWishListItem`,
      null,
      { params: { carId: carIdNum } }
    );

    if (!data?.isSuccess) {
      throw new Error(data?.customMessage || "Failed to add to favorites");
    }

    return { success: true } as const;
  } catch (err) {
    throw toError(err, "Unable to add to favorites");
  }
};

// Remove a car from favorites by carId (use Website endpoint for convenience)
export const removeFavorite = async (carId: string | number) => {
  try {
    const carIdNum = typeof carId === "string" ? parseInt(carId, 10) : carId;
    const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
      `/Client/Website/DeleteWishListItem`,
      { params: { carId: carIdNum } }
    );

    if (!data?.isSuccess) {
      throw new Error(data?.customMessage || "Failed to remove from favorites");
    }

    return { success: true } as const;
  } catch (err) {
    throw toError(err, "Unable to remove from favorites");
  }
};

// Optionally expose direct accessors using WishList endpoints
export const getFavoriteItemById = async (
  wishlistItemId: number
): Promise<WishlistItemApi | null> => {
  try {
    const { data } = await axiosInstance.get<ApiResponse<WishlistItemApi | null>>(
      `/Client/WishList/GetCustomerWishListItemById/${wishlistItemId}`
    );
    if (!data?.isSuccess) {
      throw new Error(data?.customMessage || "Failed to fetch wishlist item");
    }
    return data.data ?? null;
  } catch (err) {
    throw toError(err, "Unable to fetch wishlist item");
  }
};

export const removeFavoriteByItemId = async (wishlistItemId: number) => {
  try {
    const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
      `/Client/WishList/RemoveCustomerWishListItem`,
      { params: { wishlistItemId } }
    );
    if (!data?.isSuccess) {
      throw new Error(data?.customMessage || "Failed to remove wishlist item");
    }
    return { success: true } as const;
  } catch (err) {
    throw toError(err, "Unable to remove wishlist item");
  }
};
