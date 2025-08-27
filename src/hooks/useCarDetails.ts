
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCarDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['car-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          branches (
            name,
            address,
            city
          ),
          vendors (
            name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCarAdditionalServices = (carId: string | undefined) => {
  return useQuery({
    queryKey: ['car-additional-services', carId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('paid_features')
        .eq('id', carId)
        .single();

      if (error) throw error;
      
      if (!data?.paid_features) return [];

      // Parse the paid_features JSON data
      let paidFeatures = [];
      try {
        paidFeatures = typeof data.paid_features === 'string' 
          ? JSON.parse(data.paid_features) 
          : data.paid_features;
      } catch {
        return [];
      }

      // Transform to match the expected format
      return Array.isArray(paidFeatures) ? paidFeatures.map((feature, index) => ({
        id: `paid-feature-${index}`,
        name: feature.title || '',
        description: '',
        price: feature.price || 0,
        category: 'paid_feature',
        is_active: true
      })) : [];
    },
    enabled: !!carId,
  });
};
