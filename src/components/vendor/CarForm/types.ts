
export interface CarFormData {
  id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  color: string;
  license_plate: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  deposit_amount: number;
  mileage_limit: number;
  features: string[];
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  condition: string;
  branch_id: string;
}

export const getDefaultFormData = (): CarFormData => ({
  name: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'sedan',
  fuel_type: 'petrol',
  transmission: 'automatic',
  seats: 5,
  color: '',
  license_plate: '',
  daily_rate: 0,
  weekly_rate: 0,
  monthly_rate: 0,
  deposit_amount: 0,
  mileage_limit: 300,
  features: [],
  images: [],
  is_available: true,
  is_featured: false,
  condition: 'excellent',
  branch_id: ''
});
