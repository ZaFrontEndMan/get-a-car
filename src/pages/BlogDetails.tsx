import React from "react";
import { useParams, Link } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import { useLanguage } from "../contexts/LanguageContext";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { useBlogDetail } from "@/hooks/useAdminSettings";
import LazyImage from "@/components/ui/LazyImage";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL;

const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const formatted = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${uploadsBaseUrl.replace(/\/$/, "")}/${formatted}`;
};

const BlogDetailsContent = () => {
  const { t } = useLanguage();
  const { slug } = useParams();

  const blogId = Number(slug);
  const { data: post, isLoading, error } = useBlogDetail(blogId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              {/* Image Skeleton */}
              <div className="w-full h-64 md:h-96 rounded-2xl bg-gray-200 mb-6"></div>
              {/* Meta Skeleton */}
              <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs"></div>
              <div className="h-10 bg-gray-200 rounded mb-6 max-w-lg"></div>
              {/* Paragraph Skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t("postNotFound") || "Post not found"}
            </h1>
            <Link
              to="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
              {t("backToBlog") || "Back to Blog"}
            </Link>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            <span>{t("backToBlog") || "Back to Blog"}</span>
          </Link>

          {/* Article Card */}
          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Featured Image */}
            {post.image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <LazyImage
                  src={normalizeImageUrl(post.image)}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {t("by")} {post.authorName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {t("publishedOn")}{" "}
                    {new Date(post.publishedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>5 {t("minRead")}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Description/Excerpt */}
              {post.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.description}
                </p>
              )}

              {/* Share Section */}
              <div className="flex items-center justify-between border-y border-gray-200 py-6 mb-8">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm">
                  <Share2 className="h-4 w-4 flex-shrink-0" />
                  <span>{t("shareArticle")}</span>
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg">
                {post.content || post.description}
              </div>
            </div>
          </article>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default BlogDetailsContent;
