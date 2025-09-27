import axiosInstance from "../../utils/axiosInstance";

export const registerVendor = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/Vendor/Auth/Register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "application/json;odata.metadata=minimal;odata.streaming=true"
    }
  });
  return data;
};