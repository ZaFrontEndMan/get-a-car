
import axiosInstance from "../../utils/axiosInstance";

export const getCarTypes = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllCarTypes');
    return response.data?.data?.data || [];
};

export const getFuelTypes = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllFuelTypes');
    return response.data?.data?.data || [];
};

export const getTransmissionTypes = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllTransmissionTypes');
    return response.data?.data?.data || [];
};

export const getCarBrands = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllTradeMarks');
    return response.data?.data?.data || [];
};

export const getCarModels = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllCarModels');
    return response.data?.data?.data || [];
};
export const getServiceTypes = async () => {
    const response = await axiosInstance.get('/Admin/CarServices/GetAllServicesTypes');
    return response.data?.data?.data || [];
};