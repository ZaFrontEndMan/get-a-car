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

// 🔹 Vendor Cars type
export interface VendorCarsResponse {
  isSuccess: boolean;
  data: {
    vendorDetails: {
      companyLogo: string;
      email: string;
      phoneNumber: string;
      companyName: string;
      mainBranchAddress: string;
      branches: number;
      avilableCars: number;
    };
    carSearchResult: any[];
    carsCommonProp: {
      data: any[];
      maxPrice: number;
    };
    totalRecord: number;
    totalPages: number;
  };
}

// 🔹 Function: Get vendor cars by vendor id
export const getVendorCars = async (
  vendorId: string
): Promise<VendorCarsResponse> => {
  const response = await axiosInstance.post<VendorCarsResponse>(
    `/Client/Website/GetVendorCars?Vendorid=${vendorId}`
  );
  return response.data;
};
