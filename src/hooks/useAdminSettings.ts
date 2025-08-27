
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async (): Promise<AdminSettings> => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error) {
        // Return default values if no settings found
        return {
          siteName: 'GetCar Rental',
          siteDescription: 'Premium car rental service in Saudi Arabia',
          contactEmail: 'info@getcar.sa',
          supportPhone: '+966 11 123 4567',
          address: '123 King Fahd Road, Riyadh, Saudi Arabia',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          website: 'https://getcar.sa',
          facebookUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          linkedinUrl: '',
          youtubeUrl: '',
        };
      }

      return {
        siteName: data.site_name,
        siteDescription: data.site_description || 'Premium car rental service in Saudi Arabia',
        contactEmail: data.contact_email || 'info@getcar.sa',
        supportPhone: data.support_phone || '+966 11 123 4567',
        address: data.address || '123 King Fahd Road, Riyadh, Saudi Arabia',
        city: data.city || 'Riyadh',
        country: data.country || 'Saudi Arabia',
        website: data.website || 'https://getcar.sa',
        facebookUrl: data.facebook_url || '',
        twitterUrl: data.twitter_url || '',
        instagramUrl: data.instagram_url || '',
        linkedinUrl: data.linkedin_url || '',
        youtubeUrl: data.youtube_url || '',
      };
    },
  });
};
