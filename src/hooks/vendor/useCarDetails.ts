import { useQuery } from "@tanstack/react-query";
import {
  getCarTypes,
  getFuelTypes,
  getTransmissionTypes,
  getCarBrands,
  getCarModels,
  getServiceTypes,
} from "@/api/vendor/carDetailsApi";

export const useGetCarTypes = () => {
  return useQuery({
    queryKey: ["carTypes"],
    queryFn: getCarTypes,
  });
};

export const useGetFuelTypes = () => {
  return useQuery({
    queryKey: ["fuelTypes"],
    queryFn: getFuelTypes,
  });
};

export const useGetTransmissionTypes = () => {
  return useQuery({
    queryKey: ["transmissionTypes"],
    queryFn: getTransmissionTypes,
  });
};

export const useGetCarBrands = () => {
  return useQuery({
    queryKey: ["carBrands"],
    queryFn: getCarBrands,
  });
};

export const useGetCarModels = () => {
  return useQuery({
    queryKey: ["carModels"],
    queryFn: getCarModels,
  });
};

export const useGetServiceTypes = () => {
  return useQuery({
    queryKey: ["serviceTypes"],
    queryFn: getServiceTypes,
  });
};
