
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useUpdateVendorBranch } from '@/hooks/vendor/useVendorBranch';

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

  const { toast } = useToast();
  const updateBranchMutation = useUpdateVendorBranch();

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
    mutationFn: async () => {
      const payload: any = {
        id: branch?.id ?? undefined,
        branchName: formData.name,
        address: formData.address,
        email: formData.email || null,
        branchPhoneNumber: formData.phone || null,
        managerPhoneNumber: formData.phone || null,
        fullName: formData.manager_name || null,
        isActive: formData.is_active,
      };

      // Delegate to API mutation
      return updateBranchMutation.mutateAsync(payload);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Branch ${branch ? 'updated' : 'saved'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || `Failed to ${branch ? 'update' : 'save'} branch`,
        variant: 'destructive',
      });
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return {
    formData,
    mutation,
    handleChange,
    handleSubmit
  };
};
