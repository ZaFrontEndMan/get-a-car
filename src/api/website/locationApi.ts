import axiosInstance from "./../../utils/axiosInstance";

// ---------- Types ----------

export interface Location {
  address: string;
  id: number;
}

export interface LocationsResponse {
  isSuccess: boolean;
  customMessage: string;
  data: Location[];
}

// ---------- API Functions ----------

/**
 * Get pickup locations for the website
 * @returns Promise<LocationsResponse>
 */
export const getPickUpLocations = async (): Promise<LocationsResponse> => {
  const response = await axiosInstance.get("/Client/Website/GetPickUpLocations");
  return response.data;
};

/**
 * Get drop-off locations for the website
 * @returns Promise<LocationsResponse>
 */
export const getDropOffLocations = async (): Promise<LocationsResponse> => {
  const response = await axiosInstance.get("/Client/Website/GetPickUpLocations");
  return response.data;
};