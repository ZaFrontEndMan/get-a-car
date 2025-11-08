import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVendorBranchById,
  getVendorBranches,
  updateEmployee,
  updateVendorBranch,
  createVendorBranch,
  getVendorBranchesForCars, // New import
} from "../../api/vendor/vendorBranchApi";

// Query keys
const VENDOR_BRANCH_QUERY_KEYS = {
  all: ["vendor", "branches"] as const,
  lists: () => [...VENDOR_BRANCH_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...VENDOR_BRANCH_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_BRANCH_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_BRANCH_QUERY_KEYS.details(), id] as const,
};

// Get vendor branches
export const useGetVendorBranches = () => {
  return useQuery({
    queryKey: VENDOR_BRANCH_QUERY_KEYS.lists(),
    queryFn: getVendorBranches,
  });
};
export const useGetVendorBranchesForCars = () => {
  return useQuery({
    queryKey: VENDOR_BRANCH_QUERY_KEYS.lists(),
    queryFn: getVendorBranchesForCars,
  });
};

// Get vendor branch by ID
export const useGetVendorBranchById = (
  branchId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: VENDOR_BRANCH_QUERY_KEYS.detail(branchId),
    queryFn: () => getVendorBranchById(branchId),
    enabled: enabled && !!branchId,
  });
};

// Create vendor branch mutation
export const useCreateVendorBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchData: any) => createVendorBranch(branchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_BRANCH_QUERY_KEYS.all });
    },
  });
};

// Update employee mutation
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      employeeData,
    }: {
      employeeId: string;
      employeeData: any;
    }) => updateEmployee(employeeId, employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_BRANCH_QUERY_KEYS.all });
    },
  });
};

// Update vendor branch mutation
export const useUpdateVendorBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ...branchData }: { [key: string]: any }) =>
      updateVendorBranch(branchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_BRANCH_QUERY_KEYS.all });
    },
  });
};
