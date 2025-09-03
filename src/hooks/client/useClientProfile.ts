import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editClient, getUserInfo } from "@/api/client/clientProfileApi";

// Hook: Get user info
export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
};

// Hook: Edit client profile
export const useEditClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });
};
