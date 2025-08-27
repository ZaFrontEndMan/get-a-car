
import { supabase } from '@/integrations/supabase/client';

export const createDefaultBranches = async (vendorId: string) => {
  console.log('Creating default branches...');

  const branches = [
    {
      vendor_id: vendorId,
      name: 'Riyadh Main Branch',
      address: 'King Fahd Road, Al Olaya District',
      city: 'Riyadh',
      phone: '+966501234567',
      email: 'riyadh@premiumcars.com',
      manager_name: 'Ahmed Al-Rashid',
      is_active: true
    },
    {
      vendor_id: vendorId,
      name: 'Airport Branch',
      address: 'King Khalid International Airport',
      city: 'Riyadh',
      phone: '+966501234568',
      email: 'airport@premiumcars.com',
      manager_name: 'Sara Al-Mahmoud',
      is_active: true
    }
  ];

  const { data: createdBranches, error: branchError } = await supabase
    .from('branches')
    .insert(branches)
    .select();

  if (branchError) {
    console.error('Error creating branches:', branchError);
    throw branchError;
  }

  console.log('Created branches:', createdBranches.length);
  return createdBranches;
};
