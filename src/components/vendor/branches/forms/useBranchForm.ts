
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BranchFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager_name: string;
  is_active: boolean;
}

export const useBranchForm = (branch: any, onSuccess: () => void) => {
  const [formData, setFormData] = useState<BranchFormData>({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    manager_name: '',
    is_active: true
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        address: branch.address || '',
        city: branch.city || '',
        phone: branch.phone || '',
        email: branch.email || '',
        manager_name: branch.manager_name || '',
        is_active: branch.is_active ?? true
      });
    }
  }, [branch]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Submitting branch data:', data);
      console.log('Current user:', currentUser);

      if (!currentUser) {
        throw new Error('User not authenticated. Please sign in first.');
      }

      try {
        // First, ensure the vendor record exists for this user
        console.log('Checking for existing vendor record...');
        let { data: existingVendor, error: vendorCheckError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', currentUser.id)
          .single();

        if (vendorCheckError && vendorCheckError.code !== 'PGRST116') {
          console.error('Error checking vendor:', vendorCheckError);
          throw new Error('Failed to verify vendor account');
        }

        let vendorId;

        if (!existingVendor) {
          console.log('No vendor record found, creating one...');
          // Create vendor record if it doesn't exist
          const { data: newVendor, error: createVendorError } = await supabase
            .from('vendors')
            .insert({
              user_id: currentUser.id,
              name: `${currentUser.user_metadata?.first_name || ''} ${currentUser.user_metadata?.last_name || ''}`.trim() || 'Unknown Vendor',
              email: currentUser.email,
              phone: currentUser.user_metadata?.phone || null,
              description: 'Vendor profile created automatically',
              verified: false
            })
            .select()
            .single();

          if (createVendorError) {
            console.error('Error creating vendor:', createVendorError);
            throw new Error('Failed to create vendor profile. Please contact support.');
          }

          vendorId = newVendor.id;
          console.log('Vendor record created successfully:', vendorId);
        } else {
          vendorId = existingVendor.id;
          console.log('Using existing vendor:', vendorId);
        }

        if (branch) {
          // Update existing branch
          console.log('Updating branch with ID:', branch.id);
          const { error } = await supabase
            .from('branches')
            .update(data)
            .eq('id', branch.id);

          if (error) {
            console.error('Update error:', error);
            throw error;
          }
        } else {
          // Create new branch
          console.log('Creating new branch with vendor_id:', vendorId);
          
          const { error } = await supabase
            .from('branches')
            .insert({
              ...data,
              vendor_id: vendorId
            });

          if (error) {
            console.error('Insert error:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Branch operation successful');
      toast({
        title: "Success",
        description: `Branch ${branch ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Branch operation failed:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${branch ? 'update' : 'create'} branch`,
        variant: "destructive",
      });
    }
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create branches",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(formData);
  };

  return {
    formData,
    currentUser,
    mutation,
    handleChange,
    handleSubmit
  };
};
