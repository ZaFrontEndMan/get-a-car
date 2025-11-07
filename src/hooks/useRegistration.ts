import { useState } from "react";
import { registerClient } from "@/api/client/clientAuth";
import { registerVendor } from "@/api/vendor/vendorAuth";
import { UserDetails } from "@/types/userTypes";
import { encryptPassword } from "@/utils/encryptPassword";

interface UseRegistrationReturn {
  isLoading: boolean;
  error: string | null;
  register: (
    userType: "client" | "vendor",
    userDetails: UserDetails,
    documents?: {
      DrivingLicenseFront?: File;
      DrivingLicenseBack?: File;
      NationalIdFront?: File;
      NationalIdBack?: File;
      LicenseIdFront?: File;
      LicenseIdBack?: File;
    }
  ) => Promise<boolean>;
}

export const useRegistration = (): UseRegistrationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    userType: "client" | "vendor",
    userDetails: UserDetails,
    documents?: {
      DrivingLicenseFront?: File;
      DrivingLicenseBack?: File;
      NationalIdFront?: File;
      NationalIdBack?: File;
      LicenseIdFront?: File;
      LicenseIdBack?: File;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Encrypt password
      const encryptedPassword = encryptPassword(userDetails.Password);

      // Create FormData
      const formData = new FormData();

      // Add UserData fields using dot notation
      formData.append("UserData.Password", encryptedPassword);
      formData.append("UserData.IsPhone", String(userDetails.IsPhone));
      formData.append("UserData.UserName", String(userDetails.UserName));

      // Add UserDetails fields using dot notation
      formData.append("UserDetails.Email", userDetails.Email || "");
      formData.append("UserDetails.FullName", userDetails.FullName || "");
      formData.append("UserDetails.NickName", userDetails.FullName || "");
      formData.append("UserDetails.ManagerName", userDetails.FullName || "");
      formData.append("UserDetails.PhoneNumber", userDetails.PhoneNumber || "");
      formData.append("UserDetails.Address", String(userDetails.Country || ""));
      formData.append("UserDetails.NationalId", userDetails.NationalId || "");
      formData.append("UserDetails.City", String(userDetails.City || ""));
      formData.append("UserDetails.Country", String(userDetails.Country || ""));

      // Add any other fields from UserDetails
      Object.keys(userDetails).forEach((key) => {
        // Skip already added fields
        if (
          ![
            "Password",
            "IsPhone",
            "Email",
            "FullName",
            "PhoneNumber",
            "Address",
            "NationalId",
            "City",
            "Country",
            "UserName",
            "ConfirmPassword",
          ].includes(key)
        ) {
          const value = userDetails[key as keyof UserDetails];
          if (value !== null && value !== undefined) {
            if (typeof value === "boolean") {
              formData.append(`UserDetails.${key}`, value ? "1" : "0");
            } else {
              formData.append(`UserDetails.${key}`, String(value));
            }
          }
        }
      });

      // Add only the relevant document files (don't send null/undefined files)
      if (documents) {
        if (userType === "client") {
          // Client: send driving license files and national ID
          if (documents.DrivingLicenseFront) {
            formData.append(
              "DrivingLicenseFront",
              documents.DrivingLicenseFront
            );
          }
          if (documents.DrivingLicenseBack) {
            formData.append("DrivingLicenseBack", documents.DrivingLicenseBack);
          }
          if (documents.NationalIdFront) {
            formData.append("NationalIdFront", documents.NationalIdFront);
          }
          if (documents.NationalIdBack) {
            formData.append("NationalIdBack", documents.NationalIdBack);
          }
        } else {
          // Vendor: send business license files and national ID
          if (documents.LicenseIdFront) {
            formData.append("LicenseIdFront", documents.LicenseIdFront);
          }
          if (documents.LicenseIdBack) {
            formData.append("LicenseIdBack", documents.LicenseIdBack);
          }
          if (documents.NationalIdFront) {
            formData.append("NationalIdFront", documents.NationalIdFront);
          }
          if (documents.NationalIdBack) {
            formData.append("NationalIdBack", documents.NationalIdBack);
          }
        }
      }

      // Route to appropriate API
      if (userType === "client") {
        await registerClient(formData);
      } else {
        await registerVendor(formData);
      }

      return true;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.customMessage ||
          err.message ||
          "Registration failed"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    register,
  };
};
