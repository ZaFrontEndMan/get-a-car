// src/hooks/useWebsiteVendors.ts
import { useQuery } from "@tanstack/react-query";
import {
  getAllVendorsOwners,
  AllVendorsOwnersResponse,
} from "@/api/website/websiteVendors";

// 🔹 Hook: Get all vendors owners
export const useWebsiteVendors = () => {
  return useQuery<AllVendorsOwnersResponse>({
    queryKey: ["websiteVendors"],
    queryFn: getAllVendorsOwners,
  });
};
