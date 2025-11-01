// src/api/constantsApi.ts
import axiosInstance from "@/utils/axiosInstance";

export type ApiCountry = { id: number; name: string };
export type ApiCity = { id: number; name: string; countryId: number };
export type ApiAboutUs = {
  id: number;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
};
export type ApiContactUs = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  description: string;
};
export type ApiHowToWork = {
  id: number;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
};
export type ApiPartner = {
  id: number;
  partnerName: string;
  partnerLogo: string;
  isActive: boolean;
};

type ApiListResponse<T> = {
  isSuccess: boolean;
  customMessage: any;
  data: {
    data: T[];
    isSuccess: boolean;
    customMessage: any;
  };
};

type ApiPartnerResponse = {
  isSuccess: boolean;
  customMessage: any;
  data: ApiPartner[];
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
  getAllAboutUs: async (): Promise<ApiAboutUs[]> => {
    const res = await axiosInstance.get<ApiListResponse<ApiAboutUs>>(
      "/Admin/AboutUs/GetAllAboutUS"
    );
    if (!res.data?.data?.data) return [];
    return res.data.data.data;
  },
  getAllContactUs: async (): Promise<ApiContactUs[]> => {
    const res = await axiosInstance.get<ApiListResponse<ApiContactUs>>(
      "/Admin/ContactUs/GetAllContactUs"
    );
    if (!res.data?.data?.data) return [];
    return res.data.data.data;
  },
  getAllHowToWorks: async (): Promise<ApiHowToWork[]> => {
    const res = await axiosInstance.get<ApiListResponse<ApiHowToWork>>(
      "/Admin/HowToWorks/GetAllHowToWorks"
    );
    if (!res.data?.data?.data) return [];
    return res.data.data.data;
  },
  getAllPartners: async (): Promise<ApiPartner[]> => {
    const res = await axiosInstance.get<ApiPartnerResponse>(
      "/Admin/Partners/GetAllPartners"
    );
    if (!res.data?.data) return [];
    return res.data.data;
  },
};
