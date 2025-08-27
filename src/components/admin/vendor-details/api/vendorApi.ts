
import { supabase } from '@/integrations/supabase/client';
import { VendorDetails, Car, Branch, Booking } from '../types';

export const fetchVendorDetails = async (vendorId: string): Promise<VendorDetails | null> => {
  console.log('Fetching vendor details for ID:', vendorId);
  
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();
  
  if (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
  
  console.log('Vendor data fetched:', data);
  return data;
};

export const fetchVendorCars = async (vendorId: string): Promise<Car[]> => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching cars:', error);
    throw new Error('Failed to fetch cars');
  }
  
  return data || [];
};

export const fetchVendorBranches = async (vendorId: string): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching branches:', error);
    throw new Error('Failed to fetch branches');
  }
  
  return data || [];
};

export const fetchVendorBookings = async (vendorId: string): Promise<Booking[]> => {
  console.log('Fetching bookings for vendor ID:', vendorId);
  
  // First, get all car IDs for this vendor
  const { data: carsData, error: carsError } = await supabase
    .from('cars')
    .select('id')
    .eq('vendor_id', vendorId);

  if (carsError) {
    console.error('Error fetching vendor cars for booking lookup:', carsError);
    throw new Error('Failed to fetch vendor cars');
  }

  const carIds = carsData?.map(car => car.id) || [];
  console.log('Found car IDs for vendor:', carIds);

  if (carIds.length === 0) {
    console.log('No cars found for vendor, returning empty bookings array');
    return [];
  }

  // Now fetch bookings for these cars
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (
        name,
        brand,
        model
      )
    `)
    .in('car_id', carIds)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
  
  console.log('Fetched vendor bookings:', data?.length || 0, 'bookings');
  return data || [];
};
