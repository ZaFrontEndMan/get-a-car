import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
const CarsHeader = () => {
  const {
    t
  } = useLanguage();
  return <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3 py-[6px]">
          {t('cars')}
        </h1>
        
      </div>
    </div>;
};
export default CarsHeader;