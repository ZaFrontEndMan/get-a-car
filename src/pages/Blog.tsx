
import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/layout/navbar/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { Search, Calendar, User } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';

const BlogContent = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch blogs from database
  const { data: blogPosts = [], isLoading, error } = useBlogs();

  const categories = [
    { key: 'all', label: t('allCategories') },
    { key: 'Tips', label: t('tips') },
    { key: 'Guide', label: t('guide') },
    { key: 'Travel', label: t('travel') },
    { key: 'Insurance', label: t('insurance') }
  ];

  // Convert database blogs to the format expected by BlogCard with Arabic support
  const posts = blogPosts.map(blog => ({
    id: blog.id,
    title: language === 'ar' && blog.title_ar ? blog.title_ar : blog.title,
    excerpt: language === 'ar' && blog.excerpt_ar ? blog.excerpt_ar : (blog.excerpt || 'No excerpt available'),
    content: language === 'ar' && blog.content_ar ? blog.content_ar : blog.content,
    author: 'Admin', // You can add author info to the blog table later
    date: new Date(blog.created_at).toISOString().split('T')[0],
    category: 'General', // You can add category to the blog table later
    image: blog.featured_image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    readTime: Math.ceil((language === 'ar' && blog.content_ar ? blog.content_ar : blog.content).length / 1000).toString(), // Rough estimate
    slug: blog.slug
  }));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">{t('loading')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading blogs: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('ourBlog')}</h1>
            <p className="text-gray-600 mb-6">{t('stayUpdated')}</p>
            
            {/* Search and Filter - Improved Mobile Layout */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('searchArticles')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                      selectedCategory === category.key
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid - Improved Mobile Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('noArticlesFound')}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

const Blog = () => {
  return (
    <LanguageProvider>
      <BlogContent />
    </LanguageProvider>
  );
};

export default Blog;
