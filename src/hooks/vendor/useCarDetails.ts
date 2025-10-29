// src/hooks/vendor/useCarDetails.js
import { useQuery } from "@tanstack/react-query";
import {
  getCarTypes,
  getFuelTypes,
  getTransmissionTypes,
  getCarBrands,
  getCarModels,
  getServiceTypes,
} from "@/api/vendor/carDetailsApi";

// Query keys
const VENDOR_CAR_DETAILS_QUERY_KEYS = {
  all: ["vendor", "car-details"] as const,
  carTypes: () => [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "car-types"] as const,
  fuelTypes: () =>
    [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "fuel-types"] as const,
  transmissionTypes: () =>
    [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "transmission-types"] as const,
  carBrands: () =>
    [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "car-brands"] as const,
  carModels: () =>
    [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "car-models"] as const,
  serviceTypes: () =>
    [...VENDOR_CAR_DETAILS_QUERY_KEYS.all, "service-types"] as const,
};

// Get car types
export const useGetCarTypes = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.carTypes(),
    queryFn: getCarTypes,
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
};

// Get fuel types
export const useGetFuelTypes = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.fuelTypes(),
    queryFn: getFuelTypes,
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
};

// Get transmission types
export const useGetTransmissionTypes = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.transmissionTypes(),
    queryFn: getTransmissionTypes,
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
};

// Get car brands
export const useGetCarBrands = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.carBrands(),
    queryFn: getCarBrands,
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
};

// Get car models
export const useGetCarModels = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.carModels(),
    queryFn: getCarModels,
    select: (data) =>
      data.map((item) => ({
        id: item.id,
        name: item.name,
        tradeMarkId: item.tradeMarkId,
      })),
  });
};

// Get service types
export const useGetServiceTypes = () => {
  return useQuery({
    queryKey: VENDOR_CAR_DETAILS_QUERY_KEYS.serviceTypes(),
    queryFn: getServiceTypes,
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })), // Transform to { id, name }
  });
};
