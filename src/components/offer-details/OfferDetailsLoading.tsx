
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../Navbar';

const OfferDetailsLoading = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-lg">{t('loading')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsLoading;
