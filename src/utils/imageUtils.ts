/**
 * Utility functions for handling image URLs
 */

// Get the base URL for uploads from environment variables
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'https://test.get2cars.com/uploads';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test.get2cars.com';

/**
 * Constructs a full image URL by concatenating the base URL with the image path
 * @param imagePath - The relative path or filename of the image
 * @param fallbackUrl - Optional fallback URL if imagePath is empty
 * @returns Full image URL or fallback URL
 */
export const getImageUrl = (imagePath?: string | null, fallbackUrl?: string): string => {
  if (!imagePath) {
    return fallbackUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center';
  }
  
  // If the imagePath already contains a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${UPLOADS_BASE_URL}/${cleanPath}`;
};

/**
 * Constructs a full API URL by concatenating the base API URL with the endpoint
 * @param endpoint - The API endpoint path
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Default fallback images for different types of content
 */
export const DEFAULT_IMAGES = {
  car: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
  offer: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&crop=center',
  vendor: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
} as const;