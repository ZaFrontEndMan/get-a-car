
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBranches = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user in useBranches:', user);
      setCurrentUser(user);
    };
    
    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: branches, isLoading, error, refetch } = useQuery({
    queryKey: ['vendor-branches', currentUser?.id],
    queryFn: async () => {
      console.log('Fetching branches for user:', currentUser?.id);
      
      if (!currentUser) {
        console.log('No user authenticated, returning empty array');
        return [];
      }

      try {
        // First, get the vendor record for this user
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
          .select('*')
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Branches fetch error:', error);
          throw error;
        }

        console.log('Branches fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching branches:', error);
        throw error;
      }
    },
    enabled: !!currentUser,
    retry: 1,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (branchId: string) => {
      console.log('Deleting branch:', branchId);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Branch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-branches'] });
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete branch",
        variant: "destructive",
      });
    }
  });

  const handleAddBranch = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add branches",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const refreshBranches = () => {
    queryClient.invalidateQueries({ queryKey: ['vendor-branches'] });
    refetch();
  };

  return {
    currentUser,
    branches,
    isLoading,
    error,
    deleteMutation,
    handleAddBranch,
    refreshBranches
  };
};
