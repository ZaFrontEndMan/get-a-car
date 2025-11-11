import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/layout/navbar/Navbar";
import MobileNav from "../components/MobileNav";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { Search } from "lucide-react";
import { useBlogs } from "@/hooks/useAdminSettings";

const BlogContent = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogPosts = [], isLoading, error } = useBlogs(); // Format posts for BlogCard

  const posts = blogPosts.map((blog) => ({
    id: blog.id,
    title: blog.title,
    excerpt: blog.description || "",
    content: blog.description, // If needed for details view
    author: blog.authorName,
    date: new Date(blog.publishedDate).toISOString().split("T")[0],
    image: blog.image,
    readTime: Math.ceil((blog.description || "").length / 1000).toString(),
    slug: blog.id?.toString(), // Using id for slug/route unless actual slug provided
  }));

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Loading, error, empty states

  if (isLoading) {
    /* ...unchanged ... */
  }
  if (error) {
    /* ...unchanged ... */
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-8">
               {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   {" "}
          <div className="mb-8">
                       {" "}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {t("ourBlog")}           {" "}
            </h1>
                        <p className="text-gray-600 mb-6">{t("stayUpdated")}</p>
                       {" "}
            <div className="flex flex-col gap-4 mb-6">
                           {" "}
              <div className="w-full relative">
                               {" "}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                               {" "}
                <input
                  type="text"
                  placeholder={t("searchArticles")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 col-auto">
                       {" "}
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
                     {" "}
          </div>
                   {" "}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
                           {" "}
              <p className="text-gray-500 text-lg">{t("noArticlesFound")}</p>   
                     {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </div>
    </div>
  );
};

export default BlogContent;
