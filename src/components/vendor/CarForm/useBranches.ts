
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

export const useBranches = () => {
  const { currentUser, isLoading: userLoading } = useCurrentUser();

  return useQuery({
    queryKey: ['branches', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) {
        console.log('No current user, returning empty array');
        return [];
      }

      try {
        console.log('Fetching branches for user:', currentUser.id);
        
        // First get the vendor record for this user
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', currentUser.id)
          .single();

        if (vendorError) {
          console.error('Vendor lookup error:', vendorError);
          if (vendorError.code === 'PGRST116') {
            console.log('No vendor record found for user');
            return [];
          }
          throw vendorError;
        }

        console.log('Found vendor:', vendorData.id);

        // Now fetch branches for this vendor
        const { data, error } = await supabase
          .from('branches')
          .select('id, name')
          .eq('vendor_id', vendorData.id)
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (error) {
          console.error('Branches fetch error:', error);
          throw error;
        }

        console.log('Branches fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
      }
    },
    enabled: !!currentUser && !userLoading,
    retry: 1,
    staleTime: 30000,
  });
};
