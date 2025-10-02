
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import DashboardLogo from '../dashboard/components/DashboardLogo';
import LanguageSwitcher from '../layout/navbar/LanguageSwitcher';

const AuthPageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <DashboardLogo />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex gap-8 rtl:gap-reverse">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              to="/cars"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('cars')}
            </Link>
            <Link
              to="/vendors"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('vendors')}
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center gap-4 rtl:gap-reverse">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthPageHeader;
