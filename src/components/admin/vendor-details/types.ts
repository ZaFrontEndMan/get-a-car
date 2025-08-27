
export interface VendorDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  description?: string;
  verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  logo_url?: string;
  is_active?: boolean;
  show_on_website?: boolean;
  can_create_offers?: boolean;
  national_id?: string;
  national_id_front_image_url?: string;
  national_id_back_image_url?: string;
  license_id?: string;
  license_id_front_image_url?: string;
  license_id_back_image_url?: string;
  country?: string;
  city?: string;
  date_of_birth?: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  daily_rate: number;
  is_available: boolean;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  manager_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  pickup_date: string;
  return_date: string;
  total_days?: number;
  daily_rate?: number;
  total_amount?: number;
  booking_status?: string;
  payment_status?: string;
  created_at: string;
  cars?: {
    name: string;
    brand: string;
    model: string;
  };
}
