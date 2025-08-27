
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  driver_license_number: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
  national_id_image_url: string | null;
  driving_license_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Clean up the updates to handle empty strings for date fields
      const cleanUpdates = { ...updates };
      
      // Convert empty date strings to null
      if (cleanUpdates.date_of_birth === '') {
        cleanUpdates.date_of_birth = null;
      }
      
      // Remove any undefined values
      Object.keys(cleanUpdates).forEach(key => {
        if (cleanUpdates[key as keyof Profile] === undefined) {
          delete cleanUpdates[key as keyof Profile];
        }
      });

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};
