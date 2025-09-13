import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCarOffer,
  editCarOffer,
  getAllCarOffers,
  getCarOfferById,
  deleteCarOffer,
  getOfferForCar,
} from "../../api/vendor/vendorCarOfferApi";

// Query keys
const VENDOR_CAR_OFFER_QUERY_KEYS = {
  all: ["vendor", "carOffers"] as const,
  lists: () => [...VENDOR_CAR_OFFER_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...VENDOR_CAR_OFFER_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_CAR_OFFER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_CAR_OFFER_QUERY_KEYS.details(), id] as const,
  carOffers: () => [...VENDOR_CAR_OFFER_QUERY_KEYS.all, "carOffers"] as const,
  carOffer: (carId: string) => [...VENDOR_CAR_OFFER_QUERY_KEYS.carOffers(), carId] as const,
};

// Get all car offers
export const useGetAllCarOffers = () => {
  return useQuery({
    queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.lists(),
    queryFn: getAllCarOffers,
  });
};

// Get car offer by ID
export const useGetCarOfferById = (offerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.detail(offerId),
    queryFn: () => getCarOfferById(offerId),
    enabled: enabled && !!offerId,
  });
};

// Get offer for car
export const useGetOfferForCar = (carId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.carOffer(carId),
    queryFn: () => getOfferForCar(carId),
    enabled: enabled && !!carId,
  });
};

// Create car offer mutation
export const useCreateCarOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCarOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.all });
    },
  });
};

// Edit car offer mutation
export const useEditCarOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: editCarOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.all });
    },
  });
};

// Delete car offer mutation
export const useDeleteCarOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCarOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_CAR_OFFER_QUERY_KEYS.all });
    },
  });
};