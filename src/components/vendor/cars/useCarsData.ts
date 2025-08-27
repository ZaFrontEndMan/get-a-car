
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCarsData = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user with improved auth state handling
  useEffect(() => {
    let mounted = true;

    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) {
          console.log('Current user in VendorCars:', user);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          setCurrentUser(null);
        }
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log('Auth state changed:', event, session?.user);
        setCurrentUser(session?.user || null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const { data: cars, isLoading, error, refetch } = useQuery({
    queryKey: ['vendor-cars', currentUser?.id],
    queryFn: async () => {
      console.log('Fetching cars for user:', currentUser?.id);
      
      if (!currentUser) {
        console.log('No user authenticated, returning empty array');
        return [];
      }

      try {
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

        // Now fetch cars for this vendor
        const { data, error } = await supabase
          .from('cars')
          .select(`
            *,
            branches (
              name
            )
          `)
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Cars fetch error:', error);
          throw error;
        }

        console.log('Cars fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching cars:', error);
        throw error;
      }
    },
    enabled: !!currentUser,
    retry: 1,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (carId: string) => {
      console.log('Deleting car:', carId);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Car deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-cars'] });
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete car",
        variant: "destructive",
      });
    }
  });

  const handleDelete = async (carId: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      deleteMutation.mutate(carId);
    }
  };

  const refreshCars = () => {
    queryClient.invalidateQueries({ queryKey: ['vendor-cars'] });
    refetch();
  };

  return {
    cars,
    isLoading,
    error,
    currentUser,
    handleDelete,
    deleteMutation,
    queryClient,
    refreshCars
  };
};
