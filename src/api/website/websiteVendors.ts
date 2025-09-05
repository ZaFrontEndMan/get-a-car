// src/api/website/websiteVendors.ts
import axiosInstance from "./../../utils/axiosInstance";

// 🔹 Vendor Owner type
export interface VendorOwner {
  id: string;
  companyLogo: string;
  companyName: string;
  email: string;
  mainBranchAddress: string;
  totalBranches: number;
  availableCars: number;
}

// 🔹 API response shape
export interface AllVendorsOwnersResponse {
  isSuccess: boolean;
  data: {
    vendorsOwners: VendorOwner[];
    totalRecord: number;
  };
}

// 🔹 Function: Get all vendors owners
export const getAllVendorsOwners =
  async (): Promise<AllVendorsOwnersResponse> => {
    const response = await axiosInstance.get<AllVendorsOwnersResponse>(
      "/Client/Website/GetAllVendorsOwners"
    );
    return response.data;
  };
