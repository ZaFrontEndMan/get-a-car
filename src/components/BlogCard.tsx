
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
    slug?: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          {post.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Clock className="h-3 w-3" />
            <span>{post.readTime} {t('minRead')}</span>
          </div>
        </div>

        <Link 
          to={`/blog/${post.slug || post.id}`}
          className="block w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm text-center mt-auto"
          onClick={(e) => {
            console.log('Blog card clicked, navigating to:', `/blog/${post.slug || post.id}`);
          }}
        >
          {t('readMore')}
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
