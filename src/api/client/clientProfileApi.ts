import axiosInstance from "./../../utils/axiosInstance";

export const getUserInfo = async () => {
  const { data } = await axiosInstance.get("/Client/Auth/GetUserInfo");
  return data;
};

export const editClient = async (payload: Record<string, any>) => {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      form.append(key, value as any);
    }
  });

  const { data } = await axiosInstance.put("/Client/Auth/EditClient", form, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
    },
  });

  return data;
};
