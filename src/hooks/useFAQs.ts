
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FAQ {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  order_index: number;
  is_active: boolean;
}

export const useFAQs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async (): Promise<FAQ[]> => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useUpdateFAQs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqs: FAQ[]) => {
      // First, delete all existing FAQs
      await supabase.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Then insert all FAQs
      const { error } = await supabase.from('faqs').insert(
        faqs.map(faq => ({
          question_en: faq.question_en,
          question_ar: faq.question_ar,
          answer_en: faq.answer_en,
          answer_ar: faq.answer_ar,
          order_index: faq.order_index,
          is_active: faq.is_active,
        }))
      );

      if (error) {
        console.error('Error updating FAQs:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQs updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating FAQs:', error);
      toast.error('Failed to update FAQs');
    },
  });
};
