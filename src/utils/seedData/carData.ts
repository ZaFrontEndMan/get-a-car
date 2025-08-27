
import { supabase } from '@/integrations/supabase/client';

export const createDefaultCars = async (vendorId: string, branches: any[]) => {
  console.log('Creating default cars...');

  const cars = [
    {
      vendor_id: vendorId,
      branch_id: branches[0].id,
      name: 'Toyota Camry 2024',
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      type: 'sedan',
      fuel_type: 'hybrid',
      transmission: 'automatic',
      seats: 5,
      color: 'White',
      license_plate: 'RUH-123',
      daily_rate: 150.00,
      weekly_rate: 900.00,
      monthly_rate: 3500.00,
      deposit_amount: 500.00,
      mileage_limit: 300,
      is_available: true,
      is_featured: true,
      condition: 'excellent',
      paid_features: JSON.stringify([
        { title: 'GPS Navigation', price: 25.00 },
        { title: 'Child Safety Seat', price: 30.00 }
      ])
    },
    {
      vendor_id: vendorId,
      branch_id: branches[0].id,
      name: 'BMW X5 2023',
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      type: 'suv',
      fuel_type: 'petrol',
      transmission: 'automatic',
      seats: 7,
      color: 'Black',
      license_plate: 'RUH-456',
      daily_rate: 350.00,
      weekly_rate: 2100.00,
      monthly_rate: 8000.00,
      deposit_amount: 1000.00,
      mileage_limit: 250,
      is_available: true,
      is_featured: true,
      condition: 'excellent',
      paid_features: JSON.stringify([
        { title: 'Premium Sound System', price: 50.00 },
        { title: 'Chauffeur Service', price: 200.00 }
      ])
    },
    {
      vendor_id: vendorId,
      branch_id: branches[1].id,
      name: 'Hyundai Elantra 2024',
      brand: 'Hyundai',
      model: 'Elantra',
      year: 2024,
      type: 'sedan',
      fuel_type: 'petrol',
      transmission: 'automatic',
      seats: 5,
      color: 'Silver',
      license_plate: 'RUH-789',
      daily_rate: 120.00,
      weekly_rate: 720.00,
      monthly_rate: 2800.00,
      deposit_amount: 400.00,
      mileage_limit: 350,
      is_available: true,
      is_featured: false,
      condition: 'excellent'
    }
  ];

  const { data: createdCars, error: carError } = await supabase
    .from('cars')
    .insert(cars)
    .select();

  if (carError) {
    console.error('Error creating cars:', carError);
    throw carError;
  }

  console.log('Created cars:', createdCars.length);
  return createdCars;
};
