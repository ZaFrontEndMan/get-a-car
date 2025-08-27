
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, UserPlus, BookOpen, Info, Phone } from 'lucide-react';

const More = () => {
  const { t } = useLanguage();

  const menuItems = [
    {
      icon: LogIn,
      title: t('signIn'),
      href: '/signin',
      description: t('signInToYourAccount')
    },
    {
      icon: UserPlus,
      title: t('signUp'),
      href: '/signup',
      description: t('createNewAccount')
    },
    {
      icon: BookOpen,
      title: t('blog'),
      href: '/blog',
      description: t('readLatestNews')
    },
    {
      icon: Info,
      title: t('about'),
      href: '/about',
      description: t('learnAboutUs')
    },
    {
      icon: Phone,
      title: t('contact'),
      href: '/contact',
      description: t('getInTouch')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('more')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="block bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default More;
