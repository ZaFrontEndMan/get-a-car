import axiosInstance from "@/utils/axiosInstance";
export const vendorPoliciesApi = {
  createPolicy: async (body: {
    titleEn: string;
    titleAr?: string;
    descriptionEn: string;
    descriptionAr?: string;
    policyType: number;
    displayOrder: number;
    isActive: boolean;
  }) => {
    const response = await axiosInstance.post(`/Vendor/Policies/CreatePolicy`, body);
    return response.data;
  },

  updatePolicy: async (
    policyId: string,
    body: {
      titleEn: string;
      titleAr?: string;
      descriptionEn: string;
      descriptionAr?: string;
      policyType: number;
      displayOrder: number;
      isActive: boolean;
    }
  ) => {
    const response = await axiosInstance.put(`/Vendor/Policies/UpdatePolicy/${policyId}`, body);
    return response.data;
  },

  deletePolicy: async (policyId: string) => {
    const response = await axiosInstance.delete(`/Vendor/Policies/DeletePolicy/${policyId}`);
    return response.data;
  },

  getAllPolicies: async () => {
    const response = await axiosInstance.get(`/Vendor/Policies/GetAllPolicies`);
    return response.data;
  },
};
