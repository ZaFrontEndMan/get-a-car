// src/api/constantsApi.ts
import axiosInstance from "@/utils/axiosInstance";

export type ApiCountry = { id: number; name: string };
export type ApiCity = { id: number; name: string; countryId: number };

type ApiListResponse<T> = {
  isSuccess: boolean;
  customMessage: any;
  data: {
    data: T[];
    isSuccess: boolean;
    customMessage: any;
  };
};

export const constantsApi = {
  getAllCountries: async (): Promise<ApiCountry[]> => {
    const res = await axiosInstance.get<ApiListResponse<ApiCountry>>(
      "/Admin/Country/GetAllCountrys"
    );
    if (!res.data?.data?.data) return [];
    return res.data.data.data;
  },
  getAllCities: async (): Promise<ApiCity[]> => {
    const res = await axiosInstance.get<ApiListResponse<ApiCity>>(
      "/Admin/City/GetAllCities"
    );
    if (!res.data?.data?.data) return [];
    return res.data.data.data;
  },
};
