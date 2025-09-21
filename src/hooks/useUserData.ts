import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "@/api/client/clientProfileApi";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";

interface LoginResponse {
  isSuccess: boolean;
  customMessage: string;
  data: {
    id: string;
    roles: string;
    userName: string;
    token: string;
    isConfirmed: boolean;
  };
}

export const useUserData = () => {
  const queryClient = useQueryClient();
  const { user: authUser, token, setAuthData } = useAuth();

  const {
    data: user,
    refetch: refetchUserData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    enabled:
      !!authUser && !!token && authUser.roles?.toLowerCase() === "client", // Only fetch for client users with valid token
    retry: false, // optional: avoid retry spamming if token expired
  });

  const handleLoginResponse = (response: LoginResponse) => {
    if (response.isSuccess && response.data?.token) {
      // Persist via AuthContext; it will decode JWT and normalize
      setAuthData({ token: response.data.token });

      // If it's a client, also fetch additional user data
      if (response.data.roles?.toLowerCase() === "client") {
        refetchUserData();
      }

      // Return the latest authUser shape if available (may update next tick)
      return {
        id: response.data.id,
        roles: response.data.roles,
        userName: response.data.userName,
        token: response.data.token,
        isConfirmed: response.data.isConfirmed,
      };
    }
    return null;
  };

  const signOut = useCallback(async () => {
    try {
      // Clear query cache and user data
      queryClient.setQueryData(["userInfo"], null);
      queryClient.clear();
      
      // Clear auth token cookie
      Cookies.remove("auth_token");
      
      console.log("useUserData signOut completed");
    } catch (error) {
      console.error("Error during useUserData signOut:", error);
    }
  }, [queryClient]);

  return {
    user: authUser?.roles?.toLowerCase() === "client" ? user : authUser, // Return API user data for clients, auth user for others
    authUser, // Always available auth user from JWT
    refetchUserData, // ✅ call this manually when you want user data
    isLoading,
    isError,
    error,
    signOut,
    handleLoginResponse, // New method to handle login responses
  };
};
