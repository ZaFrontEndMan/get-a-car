import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
const OffersHeader = () => {
  const {
    t
  } = useLanguage();
  return <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3 my-0 py-[6px]">
          {t('specialOffers')}
        </h1>
        <p className="text-gray-600 text-lg">{t('latestOffers') || 'Discover amazing deals and save on your next car rental'}</p>
      </div>
    </div>;
};
export default OffersHeader;