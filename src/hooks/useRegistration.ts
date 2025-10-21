import { useState } from "react";
import { registerClient } from "@/api/client/clientAuth";
import { registerVendor } from "@/api/vendor/vendorAuth";

interface UseRegistrationReturn {
  isLoading: boolean;
  error: string | null;
  register: (
    userType: "client" | "vendor",
    formData: FormData
  ) => Promise<boolean>;
}

export const useRegistration = (): UseRegistrationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    userType: "client" | "vendor",
    formData: FormData
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
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
