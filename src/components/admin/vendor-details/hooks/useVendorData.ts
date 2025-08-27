
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { VendorDetails, Car, Branch, Booking } from '../types';
import { 
  fetchVendorDetails, 
  fetchVendorCars, 
  fetchVendorBranches, 
  fetchVendorBookings 
} from '../api/vendorApi';

export const useVendorData = (vendorId: string | undefined) => {
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVendorData = async () => {
    if (!vendorId) return;
    
    try {
      const [vendorData, carsData, branchesData, bookingsData] = await Promise.all([
        fetchVendorDetails(vendorId).catch(error => {
          toast.error('Failed to fetch vendor details');
          return null;
        }),
        fetchVendorCars(vendorId).catch(error => {
          toast.error('Failed to fetch cars');
          return [];
        }),
        fetchVendorBranches(vendorId).catch(error => {
          toast.error('Failed to fetch branches');
          return [];
        }),
        fetchVendorBookings(vendorId).catch(error => {
          toast.error('Failed to fetch bookings');
          return [];
        })
      ]);

      setVendor(vendorData);
      setCars(carsData);
      setBranches(branchesData);
      setBookings(bookingsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      console.log('useEffect triggered with vendorId:', vendorId);
      loadVendorData();
    }
  }, [vendorId]);

  return {
    vendor,
    cars,
    branches,
    bookings,
    loading,
    setVendor
  };
};
