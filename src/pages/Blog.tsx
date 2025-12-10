import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import MobileNav from "../components/MobileNav";
import BlogCard from "../components/BlogCard";
import { Search } from "lucide-react";
import { useBlogs } from "@/hooks/useAdminSettings";

const BlogContent = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogPosts = [], isLoading, error } = useBlogs();

  // Only include active blogs
  const activeBlogPosts = blogPosts.filter(
    (blog) => (blog as any).isActive === true
  );

  // Format posts for BlogCard
  const posts = activeBlogPosts.map((blog) => ({
    id: String(blog.id),
    title: blog.title,
    excerpt: blog.description || "",
    content: blog.description,
    author: blog.authorName,
    date: new Date(blog.publishedDate).toISOString().split("T")[0],
    category: blog.category || "",
    image: blog.image,
    readTime: Math.ceil((blog.description || "").length / 1000).toString(),
    slug: blog.id?.toString(),
  }));

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
              </div>
            </div>
            <div className="animate-pulse mb-8">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-red-600 text-lg font-medium">
              {t("errorLoadingBlog") || "Error loading blog posts"}
            </p>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("ourBlog") || "Our Blog"}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              {t("stayUpdated") ||
                "Stay updated with our latest articles and insights"}
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-10">
            <div className="relative max-w-2xl">
              <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("searchArticles") || "Search articles..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-10 pe-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
                aria-label={t("searchArticles") || "Search articles"}
              />
            </div>
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  {t("noArticlesFound") || "No articles found"}
                </p>
                <p className="text-gray-400 text-sm max-w-md">
                  {searchTerm
                    ? t("tryAdjustingSearch") ||
                      "Try adjusting your search terms"
                    : t("noArticlesAvailable") || "No articles available yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default BlogContent;
