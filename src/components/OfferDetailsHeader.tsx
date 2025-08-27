
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Tag, Calendar } from 'lucide-react';

interface OfferDetailsHeaderProps {
  offer: {
    id: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    discount: string;
    validUntil: string;
  };
}

const OfferDetailsHeader = ({ offer }: OfferDetailsHeaderProps) => {
  const { t, language } = useLanguage();

  const getLocalizedTitle = () => {
    if (language === 'ar' && offer.title_ar) {
      return offer.title_ar;
    }
    return offer.title;
  };

  const getLocalizedDescription = () => {
    if (language === 'ar' && offer.description_ar) {
      return offer.description_ar;
    }
    return offer.description;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 rtl:space-x-reverse">
            <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
            <li><span className="text-gray-500">/</span></li>
            <li><Link to="/vendors" className="text-gray-500 hover:text-primary">Vendors</Link></li>
            <li><span className="text-gray-500">/</span></li>
            <li className="text-primary font-medium">Getcar</li>
          </ol>
        </nav>
      </div>

      {/* Offer Banner */}
      <div className="bg-gradient-to-r from-red to-red/80 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <Tag className="h-6 w-6" />
          <span className="text-2xl font-bold">{offer.discount} {t('discount')}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{getLocalizedTitle()}</h1>
        <p className="text-lg mb-4">{getLocalizedDescription()}</p>
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
          <Calendar className="h-4 w-4" />
          <span>{t('validUntil')} {new Date(offer.validUntil).toLocaleDateString()}</span>
        </div>
      </div>
    </>
  );
};

export default OfferDetailsHeader;
