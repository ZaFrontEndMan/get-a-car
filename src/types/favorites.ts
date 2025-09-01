export interface Vendor {
  name: string;
  logo_url: string | null;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  daily_rate: number;
  images: string[] | null;
  vendor: Vendor;
}

export interface Favorite {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
  car: Car;
}
