
import { useVendorData } from './hooks/useVendorData';
import { useVendorUpdate } from './hooks/useVendorUpdate';

export const useVendorDetails = (vendorId: string | undefined) => {
  const { vendor, cars, branches, bookings, loading, setVendor } = useVendorData(vendorId);
  const { handleSwitchChange } = useVendorUpdate(vendor, setVendor);

  return {
    vendor,
    cars,
    branches,
    bookings,
    loading,
    handleSwitchChange
  };
};
