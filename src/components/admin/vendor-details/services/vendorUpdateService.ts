
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VendorDetails } from '../types';

export interface VendorUpdateResult {
  success: boolean;
  data?: VendorDetails;
  shouldRevert?: boolean;
}

export const updateVendorField = async (
  vendorId: string,
  field: string,
  value: boolean
): Promise<VendorUpdateResult> => {
  try {
    // First check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      toast.error('You must be logged in to perform this action');
      return { success: false, shouldRevert: true };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    console.log('Current user profile:', profile);

    if (!profile || profile.role !== 'admin') {
      console.error('User is not an admin');
      toast.error('You do not have permission to perform this action');
      return { success: false, shouldRevert: true };
    }

    // Perform the update and explicitly fetch the updated record
    const { error: updateError } = await supabase
      .from('vendors')
      .update({ [field]: value })
      .eq('id', vendorId);

    if (updateError) {
      console.error(`Error updating ${field}:`, updateError);
      toast.error(`Failed to update ${field.replace('_', ' ')}: ${updateError.message}`);
      return { success: false, shouldRevert: true };
    }

    // Fetch the updated record separately to ensure we get the data
    const { data: updatedVendor, error: fetchError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (fetchError || !updatedVendor) {
      console.error('Error fetching updated vendor:', fetchError);
      toast.error('Update may have failed - please refresh the page');
      return { success: false, shouldRevert: true };
    }

    console.log(`Successfully updated ${field} to ${value}`, updatedVendor);
    toast.success(`${field.replace('_', ' ')} updated successfully`);
    return { success: true, data: updatedVendor };
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error(`Failed to update ${field.replace('_', ' ')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, shouldRevert: true };
  }
};
