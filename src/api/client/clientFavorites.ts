import axiosInstance from "../../utils/axiosInstance";
import { Favorite } from "../../types/favorites";

// Static mock data for testing
const mockFavorites: Favorite[] = [
  {
    id: "fav-1",
    user_id: "user-123",
    car_id: "car-1",
    created_at: "2024-01-15T10:30:00Z",
    car: {
      id: "car-1",
      name: "Toyota Camry Hybrid",
      brand: "Toyota",
      model: "Camry",
      year: 2024,
      type: "Sedan",
      daily_rate: 85,
      images: [
        "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800"
      ],
      vendor: {
        name: "Al Jazeera Motors",
        logo_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100"
      }
    }
  },
  {
    id: "fav-2",
    user_id: "user-123",
    car_id: "car-2",
    created_at: "2024-01-14T15:45:00Z",
    car: {
      id: "car-2",
      name: "BMW X5 M Sport",
      brand: "BMW",
      model: "X5",
      year: 2023,
      type: "SUV",
      daily_rate: 150,
      images: [
        "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?w=800",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
      ],
      vendor: {
        name: "Elite Cars",
        logo_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
      }
    }
  },
  {
    id: "fav-3",
    user_id: "user-123",
    car_id: "car-3",
    created_at: "2024-01-13T09:20:00Z",
    car: {
      id: "car-3",
      name: "Mercedes-Benz C-Class",
      brand: "Mercedes-Benz",
      model: "C-Class",
      year: 2024,
      type: "Sedan",
      daily_rate: 120,
      images: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
      ],
      vendor: {
        name: "Luxury Motors",
        logo_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100"
      }
    }
  },
  {
    id: "fav-4",
    user_id: "user-123",
    car_id: "car-4",
    created_at: "2024-01-12T14:10:00Z",
    car: {
      id: "car-4",
      name: "Audi Q7 Premium",
      brand: "Audi",
      model: "Q7",
      year: 2023,
      type: "SUV",
      daily_rate: 140,
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
      ],
      vendor: {
        name: "Premium Auto",
        logo_url: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=100"
      }
    }
  },
  {
    id: "fav-5",
    user_id: "user-123",
    car_id: "car-5",
    created_at: "2024-01-11T11:30:00Z",
    car: {
      id: "car-5",
      name: "Honda Accord Sport",
      brand: "Honda",
      model: "Accord",
      year: 2024,
      type: "Sedan",
      daily_rate: 75,
      images: [
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
      ],
      vendor: {
        name: "Honda Center",
        logo_url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=100"
      }
    }
  },
  {
    id: "fav-6",
    user_id: "user-123",
    car_id: "car-6",
    created_at: "2024-01-10T16:20:00Z",
    car: {
      id: "car-6",
      name: "Nissan Altima SV",
      brand: "Nissan",
      model: "Altima",
      year: 2023,
      type: "Sedan",
      daily_rate: 65,
      images: [
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800",
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
      ],
      vendor: {
        name: "Al Futtaim",
        logo_url: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=100"
      }
    }
  }
];

// Get all favorites for the current user
export const getFavorites = async (): Promise<Favorite[]> => {
  // For now, return static data to show the UI
  // Later, replace with: const { data } = await axiosInstance.get("/Client/Favorites");
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFavorites), 800); // Simulate API delay
  });
};

// Add a car to favorites
export const addFavorite = async (carId: string) => {
  // For now, simulate adding to favorites
  // Later, replace with: const { data } = await axiosInstance.post("/Client/Favorites", { carId });
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, carId }), 500);
  });
};

// Remove a car from favorites
export const removeFavorite = async (carId: string) => {
  // For now, simulate removing from favorites
  // Later, replace with: const { data } = await axiosInstance.delete(`/Client/Favorites/${carId}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, carId }), 500);
  });
};
