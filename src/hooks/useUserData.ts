import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "@/api/client/clientProfileApi";
import Cookies from "js-cookie";

export const useUserData = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    refetch: refetchUserData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    enabled: false, // ❌ don't fetch automatically
    retry: false, // optional: avoid retry spamming if token expired
  });

  const signOut = () => {
    Cookies.remove("auth_token");
    queryClient.setQueryData(["userInfo"], null);
  };

  return {
    user,
    refetchUserData, // ✅ call this manually when you want user data
    isLoading,
    isError,
    error,
    signOut,
  };
};
