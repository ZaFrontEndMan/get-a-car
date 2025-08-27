
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Load from database for authenticated users
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            car_id,
            car:cars (
              id,
              name,
              brand,
              images,
              daily_rate
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedWishlist: WishlistItem[] = data.map(item => ({
          id: item.car.id,
          name: item.car.name,
          image: item.car.images?.[0] || '/placeholder.svg',
          price: item.car.daily_rate,
          brand: item.car.brand
        }));

        setWishlist(formattedWishlist);
      } else {
        // Load from localStorage for unauthenticated users
        const localWishlist = localStorage.getItem('wishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (item: WishlistItem) => {
    try {
      if (user) {
        // Add to database for authenticated users
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, car_id: item.id });

        if (error) throw error;
        
        setWishlist(prev => [...prev, item]);
        toast.success('Added to wishlist');
      } else {
        // Add to localStorage for unauthenticated users
        const updatedWishlist = [...wishlist, item];
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        toast.success('Added to wishlist (Login to sync across devices)');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      if (user) {
        // Remove from database for authenticated users
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('car_id', itemId);

        if (error) throw error;
        
        setWishlist(prev => prev.filter(item => item.id !== itemId));
        toast.success('Removed from wishlist');
      } else {
        // Remove from localStorage for unauthenticated users
        const updatedWishlist = wishlist.filter(item => item.id !== itemId);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (itemId: string) => {
    return wishlist.some(item => item.id === itemId);
  };

  // Sync localStorage wishlist to database when user logs in
  const syncWishlistOnLogin = async () => {
    if (!user) return;

    const localWishlist = localStorage.getItem('wishlist');
    if (localWishlist) {
      const items: WishlistItem[] = JSON.parse(localWishlist);
      
      for (const item of items) {
        try {
          await supabase
            .from('favorites')
            .insert({ user_id: user.id, car_id: item.id });
        } catch (error) {
          // Ignore duplicate errors
          console.log('Item already in wishlist:', item.id);
        }
      }
      
      // Clear localStorage after sync
      localStorage.removeItem('wishlist');
      loadWishlist(); // Reload from database
    }
  };

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    syncWishlistOnLogin
  };
};
