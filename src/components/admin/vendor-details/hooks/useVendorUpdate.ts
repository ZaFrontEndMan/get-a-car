
import { VendorDetails } from '../types';
import { updateVendorField } from '../services/vendorUpdateService';

export const useVendorUpdate = (
  vendor: VendorDetails | null,
  setVendor: React.Dispatch<React.SetStateAction<VendorDetails | null>>
) => {
  const handleSwitchChange = async (field: string, value: boolean) => {
    if (!vendor) {
      console.error('No vendor data provided');
      return;
    }

    const vendorId = vendor.id;
    console.log(`Updating ${field} to ${value} for vendor ${vendorId}`);
    
    // Optimistically update the UI first
    setVendor(prev => prev ? { ...prev, [field]: value } : null);

    const result = await updateVendorField(vendorId, field, value);

    if (!result.success) {
      if (result.shouldRevert) {
        // Revert the optimistic update
        setVendor(prev => prev ? { ...prev, [field]: !value } : null);
      }
      return;
    }

    if (result.data) {
      // Update with the actual data from the database
      setVendor(result.data);
    }
  };

  return { handleSwitchChange };
};
