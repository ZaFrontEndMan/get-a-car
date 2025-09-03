
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleEnglishClick = () => {
    setLanguage('en');
  };

  const handleArabicClick = () => {
    setLanguage('ar');
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={handleEnglishClick}
        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
          language === 'en' 
            ? 'border-primary opacity-100 shadow-md' 
            : 'border-gray-300 opacity-60 hover:opacity-80'
        }`}
        title="English"
      >
        <img 
          src="/uploads/3ffc1e00-97cd-4f26-b646-95fab8f35c73.png" 
          alt="English" 
          className="w-full h-full object-cover"
        />
      </button>
      
      <button
        onClick={handleArabicClick}
        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
          language === 'ar' 
            ? 'border-primary opacity-100 shadow-md' 
            : 'border-gray-300 opacity-60 hover:opacity-80'
        }`}
        title="العربية"
      >
        <img 
          src="/uploads/72a1a98f-61d2-423d-b31f-c73128941f38.png" 
          alt="Arabic" 
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
