
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteWithCar {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    daily_rate: number;
    images: string[] | null;
    vendor: {
      name: string;
      logo_url: string | null;
    };
  };
}

export const useFavoritesData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          car:cars (
            id,
            name,
            brand,
            model,
            year,
            type,
            daily_rate,
            images,
            vendor:vendors (
              name,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FavoriteWithCar[];
    },
  });

  const addToFavorites = useMutation({
    mutationFn: async (carId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: carId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Added to Favorites",
        description: "Car has been added to your favorites",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (carId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Removed from Favorites",
        description: "Car has been removed from your favorites",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
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
