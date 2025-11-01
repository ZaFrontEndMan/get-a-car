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

      // Create UserDetails object with encrypted password
      const userDetailsWithEncryptedPassword = {
        ...userDetails,
        Password: encryptedPassword,
      };

      // Add UserDetails as JSON string
      formData.append(
        "UserDetails",
        JSON.stringify(userDetailsWithEncryptedPassword)
      );

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
