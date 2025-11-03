import axiosInstance from "@/utils/axiosInstance";

export type ApiCountry = { id: number; name: string };
export type ApiCity = { id: number; name: string; countryId: number };
export type ApiFAQ = {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
};
type ApiFAQResponse = {
  isSuccess: boolean;
  customMessage: {
    httpStatus: number;
    code: number;
    messageKey: string;
  };
  data: {
    data: ApiFAQ[];
    isSuccess: boolean;
    customMessage: any;
  };
};
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
  address: string;
  website: string;
  businessHours: string;
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
export type ApprovedFeedback = {
  feedbackId: number;
  createdAt: string;
  ratingVendor: number;
  ratingCar: number;
  ratingApp: number;
  ratingBooking: number | null;
  comments: string;
  fristName: string;
  lastName: string;
  email: string;
  address: string;
  customerImage: string;
};

// New types for Privacy Policy and Terms & Conditions
export type ApiPrivacyPolicy = {
  id: number;
  mainTitle: string;
  mainDescription: string;
  isActive: boolean;
};

export type ApiTermsAndCondition = {
  id: number;
  mainTitle: string;
  mainDescription: string;
  isActive: boolean;
};

export type WebsiteStatistics = {
  totalBookingsCount: number;
  totalBranchsCount: number;
  totalCarsCount: number;
  totalVendorsCount: number;
  totalClientsCount: number;
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

type ApiSimpleListResponse<T> = {
  isSuccess: boolean;
  customMessage: string;
  data: T[];
};

type ApiObjectResponse<T> = {
  isSuccess: boolean;
  customMessage: any;
  data: T;
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
  getApprovedFeedback: async (): Promise<ApprovedFeedback[]> => {
    const res = await axiosInstance.get<ApiObjectResponse<ApprovedFeedback[]>>(
      "/Client/Website/GetApprovedFeedBack"
    );
    if (!res.data?.data) return [];
    return res.data.data;
  },
  getWebsiteStatistics: async (): Promise<WebsiteStatistics | null> => {
    const res = await axiosInstance.get<ApiObjectResponse<WebsiteStatistics>>(
      "/Client/Website/GetWebsiteStatistics"
    );
    return res.data?.data || null;
  },
  // New endpoints for Privacy Policy and Terms & Conditions
  getAllPrivacyPolicies: async (): Promise<ApiPrivacyPolicy[]> => {
    const res = await axiosInstance.get<
      ApiSimpleListResponse<ApiPrivacyPolicy>
    >("/Admin/PrivacyPolicy/GetAllPrivacyPolicy");
    if (!res.data?.data || !res.data.isSuccess) return [];
    return res.data.data.filter((item) => item.isActive);
  },
  getAllTermsAndConditions: async (): Promise<ApiTermsAndCondition[]> => {
    const res = await axiosInstance.get<
      ApiObjectResponse<ApiTermsAndCondition[]>
    >("/Admin/TermsAndCondition/GetAllTermsAndCondition");
    if (!res.data?.data?.data || !res.data.isSuccess) return [];
    return res.data.data.data.filter((item) => item.isActive);
  },
  getAllFAQs: async (): Promise<ApiFAQ[]> => {
    try {
      const res = await axiosInstance.get<ApiFAQResponse>(
        "/Admin/FAQs/GetAllFAQs"
      );
      if (!res.data?.data?.data || !res.data.isSuccess) return [];
      return res.data.data.data.filter((faq) => faq.isActive);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return [];
    }
  },
};
