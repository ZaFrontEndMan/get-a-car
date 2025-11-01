import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCar,
  updateCar,
  deleteCar,
  assignCarToNewBranch,
  assignCarToNewMainBranch,
  updateCarAvailability,
  getAllCars,
  getCarById,
  getBranchCars,
  duplicateCar,
  downloadCarTemplate,
  bulkUploadCars,
  getAllCarsOffers,
} from "../../api/vendor/vendorCarApi";

// Query keys
const VENDOR_CAR_QUERY_KEYS = {
  all: ["vendor", "cars"] as const,
  lists: () => [...VENDOR_CAR_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...VENDOR_CAR_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_CAR_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_CAR_QUERY_KEYS.details(), id] as const,
  branchCars: () => [...VENDOR_CAR_QUERY_KEYS.all, "branch"] as const,
};

// Get all cars
export const useGetAllCars = () => {
  return useQuery({
    queryKey: VENDOR_CAR_QUERY_KEYS.lists(),
    queryFn: getAllCars,
  });
};
// Get all cars
export const useGetAllCarsOffers = () => {
  return useQuery({
    queryKey: VENDOR_CAR_QUERY_KEYS.lists(),
    queryFn: getAllCarsOffers,
  });
};

// Get car by ID
export const useGetCarById = (carId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_CAR_QUERY_KEYS.detail(carId),
    queryFn: () => getCarById(carId),
    enabled: enabled && !!carId,
  });
};

// Get branch cars
export const useGetBranchCars = () => {
  return useQuery({
    queryKey: VENDOR_CAR_QUERY_KEYS.branchCars(),
    queryFn: getBranchCars,
  });
};

// Create car mutation
export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Update car mutation
export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, carData }: { carId: string; carData: FormData }) =>
      updateCar(carId, carData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Delete car mutation
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Assign car to new branch mutation
export const useAssignCarToNewBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, branchData }: { carId: string; branchData: any }) =>
      assignCarToNewBranch(carId, branchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Assign car to new main branch mutation
export const useAssignCarToNewMainBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, branchData }: { carId: string; branchData: any }) =>
      assignCarToNewMainBranch(carId, branchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Update car availability mutation
export const useUpdateCarAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      carId,
      availabilityData,
    }: {
      carId: string;
      availabilityData: any;
    }) => updateCarAvailability(carId, availabilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Duplicate car mutation
export const useDuplicateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: string) => duplicateCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};
// Bulk upload cars mutation
export const useBulkUploadCars = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileData: FormData) => bulkUploadCars(fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};

// Download car template mutation
export const useDownloadCarTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: downloadCarTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_QUERY_KEYS.all });
    },
  });
};
