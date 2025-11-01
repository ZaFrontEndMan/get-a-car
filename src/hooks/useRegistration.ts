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
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Encrypt password
      const encryptedPassword = encryptPassword(userDetails.Password);

      // Create a copy of userDetails without the File objects
      const userDetailsWithoutFiles = { ...userDetails };
      delete (userDetailsWithoutFiles as any).DrivingLicenseFront;
      delete (userDetailsWithoutFiles as any).DrivingLicenseBack;
      delete (userDetailsWithoutFiles as any).NationalIdFront;
      delete (userDetailsWithoutFiles as any).NationalIdBack;

      // Update password with encrypted version
      userDetailsWithoutFiles.Password = encryptedPassword;

      // Build FormData
      const formData = new FormData();

      // Add UserDetails as JSON object (single entry)
      formData.append("UserDetails", JSON.stringify(userDetailsWithoutFiles));

      // Add document files as separate key-value pairs
      if (documents) {
        if (documents.DrivingLicenseFront) {
          formData.append("DrivingLicenseFront", documents.DrivingLicenseFront);
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
      }

      // Route to appropriate API based on user type
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
