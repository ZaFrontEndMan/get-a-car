
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  code: string;
  is_active: boolean;
}

export interface City {
  id: string;
  country_id: string;
  name_en: string;
  name_ar: string;
  is_active: boolean;
}

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data as Country[];
    }
  });
};

export const useCitiesByCountry = (countryId: string | null) => {
  return useQuery({
    queryKey: ['cities', countryId],
    queryFn: async () => {
      if (!countryId) return [];
      
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('country_id', countryId)
        .order('name_en');
      
      if (error) throw error;
      return data as City[];
    },
    enabled: !!countryId
  });
};

export const getSaudiArabiaId = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('countries')
    .select('id')
    .eq('code', 'SA')
    .single();
  
  if (error) return null;
  return data.id;
};
