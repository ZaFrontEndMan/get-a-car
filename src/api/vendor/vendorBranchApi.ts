import axiosInstance from "../../utils/axiosInstance";

// Get vendor branch by ID
export const getVendorBranchById = async (branchId: string) => {
  const { data } = await axiosInstance.get(
    `/Vendor/VendorBranch/GetVendorBrancheById/${branchId}`
  );
  return data;
};

// Get vendor branches
export const getVendorBranches = async () => {
  const { data } = await axiosInstance.get(
    "/Vendor/VendorBranch/GetVendorBranches"
  );
  return data;
};

// Update employee
export const updateEmployee = async (employeeId: string, employeeData: any) => {
  const { data } = await axiosInstance.put(
    `/Vendor/VendorBranch/UpdateEmployee/${employeeId}`,
    employeeData
  );
  return data;
};

// Update vendor branch
export const updateVendorBranch = async (branchData: any) => {
  const { data } = await axiosInstance.put(
    `/Vendor/VendorBranch/UpdateVendorBranch`,
    branchData
  );
  return data;
};
