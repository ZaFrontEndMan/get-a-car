import axiosInstance from "../../utils/axiosInstance";

interface EditVendorParams {
  nickName?: string;
  fullName?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
}

interface EditVendorResponse {
  isSuccess: boolean;
  data?: any;
  message?: string;
  error?: string;
}

interface UploadLogoResponse {
  isSuccess: boolean;
  data?: { logoUrl: string };
  message?: string;
  error?: string;
}

interface GetUserInfoResponse {
  isSuccess: boolean;
  data?: {
    vendorId: string;
    userId: string;
    fullName: string;
    nickName: string | null;
    managerName: string;
    countryName: string;
    cityName: string;
    canMakeOffer: boolean;
    isVerified: boolean;
    conactPerson: string | null;
    location: string;
    blackList: boolean;
    email: string;
    phoneNumber: string;
    nationalId: string;
    companyLogo: string;
    businessLicense: string;
    taxType: string;
    insurance: string;
  };
  message?: string;
  error?: string;
}

/**
 * Edits a vendor profile with the provided parameters and optional company logo.
 * @param params Editable vendor fields as query parameters.
 * @param formData FormData object containing the company logo file (optional).
 * @returns Promise with the API response.
 */
export const editVendor = async (
  params: EditVendorParams
): Promise<EditVendorResponse> => {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Append all keys from params into formData
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // If the value is an object or array, convert it to JSON string
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    const response = await axiosInstance.put(
      "Vendor/Auth/EditVendor",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to edit vendor profile"
    );
  }
};

/**
 * Uploads a company logo for a vendor.
 * @param formData FormData object containing the company logo file.
 * @returns Promise with the API response containing the logo URL.
 */
export const uploadCompanyLogo = async (
  formData: FormData
): Promise<UploadLogoResponse> => {
  try {
    const response = await axiosInstance.post(
      "Vendor/Auth/UploadCompanyLogo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to upload company logo"
    );
  }
};

/**
 * Fetches the vendor's user information.
 * @returns Promise with the API response containing user info.
 */
export const getUserInfo = async (): Promise<GetUserInfoResponse> => {
  try {
    const response = await axiosInstance.get("Vendor/Auth/GetUserInfo");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch user info");
  }
};
export const registerVendor = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/Vendor/Auth/Register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
    },
  });
  return data;
};
