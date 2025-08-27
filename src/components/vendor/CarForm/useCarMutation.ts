
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CarFormData } from './types';

export const useCarMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CarFormData & { 
      pickup_locations?: string[], 
      dropoff_locations?: string[], 
      paid_features?: string | null 
    }) => {
      console.log('Starting car mutation with data:', formData);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User error:', userError);
        throw new Error('User not authenticated');
      }

      // Get vendor for current user
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) {
        console.error('Vendor lookup error:', vendorError);
        throw new Error('Vendor not found');
      }

      console.log('Found vendor:', vendorData.id);

      // Clean up the form data to ensure no empty strings are passed as UUIDs
      const cleanFormData = {
        ...formData,
        vendor_id: vendorData.id,
        branch_id: formData.branch_id && formData.branch_id.trim() !== '' ? formData.branch_id : null,
        license_plate: formData.license_plate && formData.license_plate.trim() !== '' ? formData.license_plate : null,
        pickup_locations: formData.pickup_locations || [],
        dropoff_locations: formData.dropoff_locations || [],
        paid_features: formData.paid_features || null
      };

      console.log('Clean form data:', cleanFormData);

      if (formData.id) {
        // Update existing car
        console.log('Updating existing car:', formData.id);
        const { data, error } = await supabase
          .from('cars')
          .update(cleanFormData)
          .eq('id', formData.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        console.log('Car updated successfully:', data);
        return data;
      } else {
        // Create new car
        console.log('Creating new car with vendor_id:', vendorData.id);
        const { data, error } = await supabase
          .from('cars')
          .insert([cleanFormData])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        console.log('Car created successfully:', data);
        return data;
      }
    },
    onSuccess: (data) => {
      console.log('Car operation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car saved successfully!');
      onSuccess();
    },
    onError: (error) => {
      console.error('Car operation failed:', error);
      toast.error('Failed to save car. Please try again.');
    },
  });
};
