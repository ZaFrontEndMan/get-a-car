import axiosInstance from "../../utils/axiosInstance";

// Add a car to wishlist
export const addToWishlist = async (carId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/Client/Website/AddWishListItem?carId=${carId}`);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove a car from wishlist
export const removeFromWishlist = async (carId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Client/Website/DeleteWishListItem?carId=${carId}`);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};