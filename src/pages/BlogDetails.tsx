import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/navbar/Navbar";
import MobileNav from "../components/MobileNav";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { useBlogDetail } from "@/hooks/useAdminSettings";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL;

const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const formatted = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${uploadsBaseUrl.replace(/\/$/, "")}/${formatted}`;
};

const BlogDetailsContent = () => {
  const { t, language } = useLanguage();
  const { slug } = useParams();
  const isRTL = language === "ar";

  const blogId = Number(slug);
  const { data: post, isLoading, error } = useBlogDetail(blogId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <Navbar />       {" "}
        <div className="pt-20 pb-8">
                   {" "}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                       {" "}
            <div className="animate-pulse">
                            {/* Image Skeleton */}             {" "}
              <div className="w-full h-64 md:h-96 rounded bg-gray-200 mb-6"></div>
                            {/* Meta Skeleton */}             {" "}
              <div className="h-6 bg-gray-200 rounded mb-3 max-w-xs"></div>     
                     {" "}
              <div className="h-10 bg-gray-200 rounded mb-6 max-w-lg"></div>   
                        <div className="h-5 bg-gray-200 rounded mb-3"></div>   
                        {/* Paragraph Skeleton */}             {" "}
              <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div> 
                              <div className="h-4 bg-gray-200 rounded"></div>   
                            <div className="h-4 bg-gray-200 rounded"></div>     
                       {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="hidden md:block">
                    <Footer />       {" "}
        </div>
                <MobileNav />     {" "}
      </div>
    );
  }

  if (error || !post) {
    /* ...unchanged ... */
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Navbar />     {" "}
      <div className="pt-20 pb-8">
               {" "}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                   {" "}
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
          >
                       {" "}
            <ArrowLeft className={`h-4 w-4 ms-2`} />     
                  {t("backToBlog") || "Back to Blog"}         {" "}
          </Link>
                   {" "}
          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                       {" "}
            {post.image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                               {" "}
                <img
                  src={normalizeImageUrl(post.image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                             {" "}
              </div>
            )}
                       {" "}
            <div className="p-8">
                           {" "}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                               {" "}
                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />           
                       {" "}
                  <span>
                    {t("by")} {post.authorName}
                  </span>
                                 {" "}
                </div>
                               {" "}
                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />       
                           {" "}
                  <span>
                    {t("publishedOn")}{" "}
                    {new Date(post.publishedDate).toLocaleDateString()}
                  </span>
                                 {" "}
                </div>
                               {" "}
                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />         
                          <span>5 {t("minRead")}</span>               {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {post.title}             {" "}
              </h1>
                           {" "}
              {post.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {post.description}               {" "}
                </p>
              )}
                           {" "}
              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                               {" "}
                <button className="flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors border border-gray-200 rounded-lg hover:border-primary">
                                    <Share2 className="h-4 w-4 mr-2" />         
                          {t("shareArticle")}               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <div
                className="prose prose-lg max-w-none"
                dir={isRTL ? "rtl" : "ltr"}
              >
                                {post.description}             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </article>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="hidden md:block">
                <Footer />     {" "}
      </div>
            <MobileNav />   {" "}
    </div>
  );
};

export default BlogDetailsContent;
