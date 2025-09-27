import { useQuery } from "@tanstack/react-query";
import {
  getPickUpLocations,
  getDropOffLocations,
  LocationsResponse,
} from "@/api/website/locationApi";

// 🔹 Hook: Get pickup locations
export const usePickUpLocations = () => {
  return useQuery<LocationsResponse>({
    queryKey: ["pickUpLocations"],
    queryFn: getPickUpLocations,
    staleTime: 5 * 60 * 1000, // 5 minutes - locations don't change frequently
  });
};

// 🔹 Hook: Get drop-off locations
export const useDropOffLocations = () => {
  return useQuery<LocationsResponse>({
    queryKey: ["dropOffLocations"],
    queryFn: getDropOffLocations,
    staleTime: 5 * 60 * 1000, // 5 minutes - locations don't change frequently
  });
};
