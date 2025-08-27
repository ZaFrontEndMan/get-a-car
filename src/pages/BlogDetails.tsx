
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronLeft, ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

const BlogDetailsContent = () => {
  const { t, language } = useLanguage();
  const { slug } = useParams();
  const isRTL = language === 'ar';

  console.log('Blog slug from params:', slug);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error(t('noBlogIdProvided') || 'No blog ID provided');
      }

      console.log('Fetching blog post with slug:', slug);
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Blog fetch error:', error);
        throw error;
      }

      console.log('Blog post fetched:', data);
      return data;
    },
    enabled: !!slug
  });

  console.log('Blog post query result:', { post, error, isLoading, slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (error || !post) {
    console.error('Blog error details:', { error, post, slug });
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('errorLoadingBlogPost') || 'Error loading blog post'}
              </h1>
              <p className="text-gray-600 mb-8">
                {error?.message || t('blogPostNotFound') || 'Blog post not found'}
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('backToBlog') || 'Back to Blog'}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    );
  }

  const title = language === 'ar' && post.title_ar ? post.title_ar : post.title;
  const content = language === 'ar' && post.content_ar ? post.content_ar : post.content;
  const excerpt = language === 'ar' && post.excerpt_ar ? post.excerpt_ar : post.excerpt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog Link */}
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('backToBlog') || 'Back to Blog'}
          </Link>

          {/* Article Header */}
          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {post.featured_image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{t('by')} Admin</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{t('publishedOn')} {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5 {t('minRead')}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {excerpt}
                </p>
              )}

              {/* Share Button */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                <button className="flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors border border-gray-200 rounded-lg hover:border-primary">
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('shareArticle')}
                </button>
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </article>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};

const BlogDetails = () => {
  return (
    <LanguageProvider>
      <BlogDetailsContent />
    </LanguageProvider>
  );
};

export default BlogDetails;
