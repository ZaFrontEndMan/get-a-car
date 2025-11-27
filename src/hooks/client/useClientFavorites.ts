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
import { useLanguage } from "@/contexts/LanguageContext";

// Clean interface for components to interact with Favorites
export const useClientFavorites = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
      toast({
        title: t("favourites_add_success_title"),
        description: t("favourites_add_success_message"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("favourites_add_error_title"),
        description: error?.message || t("favourites_add_error_default"),
        variant: "destructive",
      });
    },
  });

  const removeByCarIdMutation = useMutation({
    mutationFn: (carId: string | number) => removeFavorite(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFavorites"] });
      toast({
        title: t("favourites_remove_success_title"),
        description: t("favourites_remove_success_message"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("favourites_remove_error_title"),
        description: error?.message || t("favourites_remove_error_default"),
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
        title: t("favourites_remove_success_title"),
        description: t("favourites_remove_item_success_message"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("favourites_remove_error_title"),
        description: error?.message || t("favourites_remove_error_default"),
        variant: "destructive",
      });
    },
  });

  const getItemById = async (wishlistItemId: number) => {
    try {
      return await getFavoriteItemById(wishlistItemId);
    } catch (error: any) {
      toast({
        title: t("favourites_get_item_error_title"),
        description: error?.message || t("favourites_get_item_error_default"),
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
