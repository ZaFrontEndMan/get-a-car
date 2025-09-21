// src/hooks/useWebsiteVendors.ts
import { useQuery } from "@tanstack/react-query";
import {
  getAllVendorsOwners,
  AllVendorsOwnersResponse,
  getVendorCars,
  VendorCarsResponse,
} from "@/api/website/websiteVendors";

// 🔹 Hook: Get all vendors owners
export const useWebsiteVendors = () => {
  return useQuery<AllVendorsOwnersResponse>({
    queryKey: ["websiteVendors"],
    queryFn: getAllVendorsOwners,
  });
};

// 🔹 Hook: Get vendor cars by vendor id
export const useVendorCars = (vendorId: string) => {
  return useQuery<VendorCarsResponse>({
    queryKey: ["vendorCars", vendorId],
    queryFn: () => getVendorCars(vendorId),
    enabled: !!vendorId,
  });
};
