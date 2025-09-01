
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite, removeFavorite } from '../api/client/clientFavorites';
import { Favorite } from '../types/favorites';
import { useToast } from './use-toast';

export const useFavoritesData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  const addToFavorites = useMutation({
    mutationFn: (carId: string) => addFavorite(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: 'Added to Favorites',
        description: 'Car has been added to your favorites',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add to favorites',
        variant: 'destructive',
      });
    },
  });

  const removeFromFavorites = useMutation({
    mutationFn: (carId: string) => removeFavorite(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: 'Removed from Favorites',
        description: 'Car has been removed from your favorites',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove from favorites',
        variant: 'destructive',
      });
    },
  });

  return {
    favorites,
    isLoading,
    addToFavorites: addToFavorites.mutate,
    removeFromFavorites: removeFromFavorites.mutate,
    isAdding: addToFavorites.isPending,
    isRemoving: removeFromFavorites.isPending,
  };
};
