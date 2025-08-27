
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminSettings } from './useAdminSettings';

export const useAdminSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<AdminSettings>) => {
      // First, check if a settings record exists
      const { data: existingSettings, error: fetchError } = await supabase
        .from('admin_settings')
        .select('id')
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      const dbSettings = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        contact_email: settings.contactEmail,
        support_phone: settings.supportPhone,
        address: settings.address,
        city: settings.city,
        country: settings.country,
        website: settings.website,
        facebook_url: settings.facebookUrl,
        twitter_url: settings.twitterUrl,
        instagram_url: settings.instagramUrl,
        linkedin_url: settings.linkedinUrl,
        youtube_url: settings.youtubeUrl,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (existingSettings) {
        // Update existing record
        result = await supabase
          .from('admin_settings')
          .update(dbSettings)
          .eq('id', existingSettings.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('admin_settings')
          .insert(dbSettings)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    },
  });
};
