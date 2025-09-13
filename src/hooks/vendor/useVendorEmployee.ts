import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsersByVendorOwner,
  getUserById,
  getEmployeeStatistics,
  updateEmployeeAvailability,
  updateEmployee,
} from "../../api/vendor/vendorEmployeeApi";

// Query keys
const VENDOR_EMPLOYEE_QUERY_KEYS = {
  all: ["vendor", "employees"] as const,
  lists: () => [...VENDOR_EMPLOYEE_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...VENDOR_EMPLOYEE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_EMPLOYEE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_EMPLOYEE_QUERY_KEYS.details(), id] as const,
  statistics: () => [...VENDOR_EMPLOYEE_QUERY_KEYS.all, "statistics"] as const,
};

// Get users by vendor owner
export const useGetUsersByVendorOwner = () => {
  return useQuery({
    queryKey: VENDOR_EMPLOYEE_QUERY_KEYS.lists(),
    queryFn: getUsersByVendorOwner,
  });
};

// Get user by ID
export const useGetUserById = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_EMPLOYEE_QUERY_KEYS.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: enabled && !!userId,
  });
};

// Get employee statistics
export const useGetEmployeeStatistics = () => {
  return useQuery({
    queryKey: VENDOR_EMPLOYEE_QUERY_KEYS.statistics(),
    queryFn: getEmployeeStatistics,
  });
};

// Update employee availability mutation
export const useUpdateEmployeeAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, availabilityData }: { employeeId: string; availabilityData: any }) =>
      updateEmployeeAvailability(employeeId, availabilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_EMPLOYEE_QUERY_KEYS.all });
    },
  });
};

// Update employee mutation
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, employeeData }: { employeeId: string; employeeData: any }) =>
      updateEmployee(employeeId, employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_EMPLOYEE_QUERY_KEYS.all });
    },
  });
};