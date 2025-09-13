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
    enabled: !!authUser && !!token && authUser.roles === "Client", // Only fetch for client users with valid token
    retry: false, // optional: avoid retry spamming if token expired
  });

  const handleLoginResponse = (response: LoginResponse) => {
    if (response.isSuccess && response.data) {
      const userData = {
        id: response.data.id,
        roles: response.data.roles,
        userName: response.data.userName,
        token: response.data.token,
        isConfirmed: response.data.isConfirmed
      };
      
      setAuthData(userData);
      
      // If it's a client, also fetch additional user data
      if (userData.roles === "Client") {
        refetchUserData();
      }
      
      return userData;
    }
    return null;
  };

  const signOut = useCallback(() => {
    Cookies.remove("auth_token");
    queryClient.setQueryData(["userInfo"], null);
    queryClient.clear(); // Clear all cached data
  }, [queryClient]);

  return {
    user: authUser?.roles === "Client" ? user : authUser, // Return API user data for clients, auth user for others
    authUser, // Always available auth user from JWT
    refetchUserData, // ✅ call this manually when you want user data
    isLoading,
    isError,
    error,
    signOut,
    handleLoginResponse, // New method to handle login responses
  };
};
