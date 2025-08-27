
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Blog {
  id: string;
  title: string;
  title_ar: string | null;
  content: string;
  content_ar: string | null;
  excerpt: string | null;
  excerpt_ar: string | null;
  featured_image: string | null;
  slug: string;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  keywords: string[] | null;
}

export interface BlogInsert {
  title: string;
  title_ar?: string;
  content: string;
  content_ar?: string;
  slug: string;
  author_id: string;
  excerpt?: string;
  excerpt_ar?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
  published_at?: string;
  keywords?: string[];
}

export interface BlogUpdate {
  title?: string;
  title_ar?: string;
  content?: string;
  content_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  featured_image?: string;
  slug?: string;
  status?: 'draft' | 'published';
  published_at?: string;
  updated_at?: string;
  keywords?: string[];
}

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
};

export const useBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      action, 
      blogData, 
      blogId 
    }: { 
      action: 'create' | 'update' | 'delete';
      blogData?: BlogInsert | BlogUpdate;
      blogId?: string;
    }) => {
      switch (action) {
        case 'create':
          if (!blogData || !('title' in blogData && 'content' in blogData && 'slug' in blogData && 'author_id' in blogData)) {
            throw new Error('Missing required fields for blog creation');
          }
          const { error: createError } = await supabase
            .from('blogs')
            .insert(blogData as BlogInsert);
          if (createError) throw createError;
          break;
        
        case 'update':
          if (!blogId || !blogData) {
            throw new Error('Blog ID and data are required for update');
          }
          const { error: updateError } = await supabase
            .from('blogs')
            .update(blogData as BlogUpdate)
            .eq('id', blogId);
          if (updateError) throw updateError;
          break;
        
        case 'delete':
          if (!blogId) {
            throw new Error('Blog ID is required for deletion');
          }
          const { error: deleteError } = await supabase
            .from('blogs')
            .delete()
            .eq('id', blogId);
          if (deleteError) throw deleteError;
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
