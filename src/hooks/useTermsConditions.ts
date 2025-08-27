
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TermsConditions {
  id: string;
  content_en: string;
  content_ar: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTermsConditions = () => {
  return useQuery({
    queryKey: ['terms-conditions'],
    queryFn: async (): Promise<TermsConditions | null> => {
      const { data, error } = await supabase
        .from('terms_conditions')
        .select('*')
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching terms and conditions:', error);
        throw error;
      }

      return data;
    },
  });
};

export const useUpdateTermsConditions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content_en: string; content_ar: string }) => {
      // Get current version
      const { data: current } = await supabase
        .from('terms_conditions')
        .select('version')
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newVersion = (current?.version || 0) + 1;

      // Deactivate old versions
      await supabase
        .from('terms_conditions')
        .update({ is_active: false })
        .eq('is_active', true);

      // Insert new version
      const { error } = await supabase.from('terms_conditions').insert({
        content_en: data.content_en,
        content_ar: data.content_ar,
        version: newVersion,
        is_active: true,
      });

      if (error) {
        console.error('Error updating terms and conditions:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms-conditions'] });
      toast.success('Terms and Conditions updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating terms and conditions:', error);
      toast.error('Failed to update Terms and Conditions');
    },
  });
};
