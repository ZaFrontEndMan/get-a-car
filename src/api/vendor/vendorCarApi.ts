import axiosInstance from "../../utils/axiosInstance";

// Create a new car
export const createCar = async (carData: FormData) => {
  const { data } = await axiosInstance.post("/Vendor/Car/CreateCar", carData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Update car by ID
export const updateCar = async (carId: string, carData: FormData) => {
  const { data } = await axiosInstance.put(
    `/Vendor/Car/UpdateCar/${carId}`,
    carData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// Delete car by ID
export const deleteCar = async (carId: string) => {
  const { data } = await axiosInstance.delete(`/Vendor/Car/DeleteCar/${carId}`);
  return data;
};

// Assign car to new branch
export const assignCarToNewBranch = async (carId: string, branchData: any) => {
  const { data } = await axiosInstance.post(
    `/Vendor/Car/AssignCarToNewBranch/${carId}`,
    branchData
  );
  return data;
};

// Assign car to new main branch
export const assignCarToNewMainBranch = async (
  carId: string,
  branchData: any
) => {
  const { data } = await axiosInstance.post(
    `/Vendor/Car/AssignCarToNewMainBranch/${carId}`,
    branchData
  );
  return data;
};

// Update car availability
export const updateCarAvailability = async (
  carId: string,
  availabilityData: any
) => {
  const { data } = await axiosInstance.post(
    `/Vendor/Car/UpdateCarAvailability/${carId}`,
    availabilityData
  );
  return data;
};

// Get all cars
export const getAllCars = async (
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  const { data } = await axiosInstance.get("/Vendor/Car/GetAll", {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return data;
};
// Get all cars
export const getAllCarsOffers = async () => {
  const { data } = await axiosInstance.get(
    "/Vendor/CarOffer/GetAllCarForOffers"
  );
  return data;
};

// Get car by ID
export const getCarById = async (carId: string) => {
  const { data } = await axiosInstance.post(`/Vendor/Car/GetById/${carId}`);
  return data;
};

// Get branch cars
export const getBranchCars = async () => {
  const { data } = await axiosInstance.post("/Vendor/Car/GetBranchCars");
  return data;
};

// Duplicate car by ID
export const duplicateCar = async (carId: string) => {
  const { data } = await axiosInstance.post(
    `/Vendor/Car/DuplicateCar/${carId}`
  );
  return data;
};

// Bulk upload cars
export const bulkUploadCars = async (fileData: FormData) => {
  const { data } = await axiosInstance.post(
    "/Vendor/Car/BulkUploadCars",
    fileData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// Download car template
export const downloadCarTemplate = async () => {
  const { data } = await axiosInstance.get("/Vendor/Car/DownloadCarTemplate");
  return data;
};
