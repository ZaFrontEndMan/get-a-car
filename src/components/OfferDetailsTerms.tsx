
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import OfferPoliciesTranslated from './offer-details/OfferPoliciesTranslated';

interface OfferDetailsTermsProps {
  policies: string[];
  offer?: {
    validUntil: string;
    vendor_id?: string;
    car: {
      deposit_amount?: number;
      vendor_id?: string;
    };
  };
}

const OfferDetailsTerms = ({ policies, offer }: OfferDetailsTermsProps) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Only show Offer Policies - Vendor policies are handled in OfferVendorSection */}
      {offer ? (
        <OfferPoliciesTranslated offer={offer} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-6">{t('rentalPolicies')}</h3>
          
          <div className="space-y-3">
            {policies.map((policy, index) => (
              <div key={index} className="flex items-start gap-2 rtl:gap-reverse">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{policy}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetailsTerms;
