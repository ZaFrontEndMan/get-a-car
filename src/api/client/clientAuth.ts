import axiosInstance from "../../utils/axiosInstance";

export const registerClient = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/Client/Auth/Register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "application/json;odata.metadata=minimal;odata.streaming=true"
    }
  });
  return data;
};