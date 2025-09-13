import axiosInstance from "../../utils/axiosInstance";

// Create a new car offer
export const createCarOffer = async (offerData: any) => {
  const { data } = await axiosInstance.post("/Vendor/CarOffer/CreateCarOffer", offerData);
  return data;
};

// Edit car offer
export const editCarOffer = async (offerData: any) => {
  const { data } = await axiosInstance.put("/Vendor/CarOffer/EditCarOffer", offerData);
  return data;
};

// Get all car offers
export const getAllCarOffers = async () => {
  const { data } = await axiosInstance.get("/Vendor/CarOffer/GetAllCarOffers");
  return data;
};

// Get car offer by ID
export const getCarOfferById = async (offerId: string) => {
  const { data } = await axiosInstance.get(`/Vendor/CarOffer/GetCarOfferById/${offerId}`);
  return data;
};

// Delete car offer
export const deleteCarOffer = async (offerId: string) => {
  const { data } = await axiosInstance.delete(`/Vendor/CarOffer/DeleteCarOffer/${offerId}`);
  return data;
};

// Get offer for car
export const getOfferForCar = async (carId: string) => {
  const { data } = await axiosInstance.get(`/Vendor/CarOffer/GetOfferForCar/${carId}`);
  return data;
};