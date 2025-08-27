
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PrivacyPolicy {
  id: string;
  content_en: string;
  content_ar: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacy-policy'],
    queryFn: async (): Promise<PrivacyPolicy | null> => {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching privacy policy:', error);
        throw error;
      }

      return data;
    },
  });
};

export const useUpdatePrivacyPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content_en: string; content_ar: string }) => {
      // Get current version
      const { data: current } = await supabase
        .from('privacy_policy')
        .select('version')
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newVersion = (current?.version || 0) + 1;

      // Deactivate old versions
      await supabase
        .from('privacy_policy')
        .update({ is_active: false })
        .eq('is_active', true);

      // Insert new version
      const { error } = await supabase.from('privacy_policy').insert({
        content_en: data.content_en,
        content_ar: data.content_ar,
        version: newVersion,
        is_active: true,
      });

      if (error) {
        console.error('Error updating privacy policy:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-policy'] });
      toast.success('Privacy Policy updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating privacy policy:', error);
      toast.error('Failed to update Privacy Policy');
    },
  });
};
