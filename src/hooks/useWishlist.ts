
import { useState } from 'react';
import { toast } from 'sonner';
import { useUserData } from './useUserData';
import { addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from '../api/website/wishlist';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
}

export const useWishlist = () => {
  const { user } = useUserData();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);



  const addToWishlist = async (item: WishlistItem) => {
    try {
      if (user) {
        await addToWishlistAPI(parseInt(item.id));
        setWishlist(prev => [...prev, item]);
        toast.success('Added to wishlist');
      } else {
        toast.error('Please login to add items to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      if (user) {
        await removeFromWishlistAPI(parseInt(itemId));
        setWishlist(prev => prev.filter(item => item.id !== itemId));
        toast.success('Removed from wishlist');
      } else {
        toast.error('Please login to remove items from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (itemId: string) => {
    return wishlist.some(item => item.id === itemId);
  };



  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};
