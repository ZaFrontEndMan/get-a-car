import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteItemById,
  removeFavoriteByItemId,
} from "@/api/client/clientFavorites";
import { Favorite } from "@/types/favorites";
import { useAuth } from "@/contexts/AuthContext";

// Clean interface for components to interact with Favorites
export const useClientFavorites = () => {
  const { user } = useAuth(); // Add this line
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const favoritesQuery = useQuery<Favorite[]>({
    queryKey: ["clientFavorites"],
    queryFn: getFavorites,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (carId: string | number) => addFavorite(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFavorites"] });
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة السيارة إلى المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error?.message || "فشل في إضافة السيارة إلى المفضلة",
        variant: "destructive",
      });
    },
  });

  const removeByCarIdMutation = useMutation({
    mutationFn: (carId: string | number) => removeFavorite(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFavorites"] });
      toast({
        title: "تمت الإزالة",
        description: "تمت إزالة السيارة من المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error?.message || "فشل في إزالة السيارة من المفضلة",
        variant: "destructive",
      });
    },
  });

  const removeByItemIdMutation = useMutation({
    mutationFn: (wishlistItemId: number) =>
      removeFavoriteByItemId(wishlistItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFavorites"] });
      toast({
        title: "تمت الإزالة",
        description: "تم حذف العنصر من قائمة المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error?.message || "فشل في حذف العنصر من قائمة المفضلة",
        variant: "destructive",
      });
    },
  });

  const getItemById = async (wishlistItemId: number) => {
    try {
      return await getFavoriteItemById(wishlistItemId);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.message || "فشل في جلب بيانات العنصر",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    // data
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isFetching: favoritesQuery.isFetching,

    // mutations
    addToFavorites: addMutation.mutate,
    removeFromFavoritesByCarId: removeByCarIdMutation.mutate,
    removeFromFavoritesByItemId: removeByItemIdMutation.mutate,

    // mutation status
    isAdding: addMutation.isPending,
    isRemovingByCarId: removeByCarIdMutation.isPending,
    isRemovingByItemId: removeByItemIdMutation.isPending,

    // helpers
    getItemById,
  };
};
