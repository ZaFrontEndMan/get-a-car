import axiosInstance from "../../utils/axiosInstance";

// Get vendor FAQs
export const getVendorFAQs = async () => {
  const { data } = await axiosInstance.get("/api/Vendor/Faqs/GetVendorFAQs");
  return data;
};

// Get FAQ by ID
export const getFaqById = async (faqId: string) => {
  const { data } = await axiosInstance.get(`/api/Vendor/Faqs/GetFaqsById/${faqId}`);
  return data;
};