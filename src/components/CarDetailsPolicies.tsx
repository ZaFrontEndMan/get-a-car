
import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CarDetailsPoliciesProps {
  policies: string[];
}

const CarDetailsPolicies = ({ policies }: CarDetailsPoliciesProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 rtl:gap-reverse">
        <Shield className="h-5 w-5 text-primary" />
        <span>{t('rentalPolicies')}</span>
      </h3>
      <ul className="space-y-2">
        {policies.map((policy, index) => (
          <li key={index} className="flex items-start gap-2 rtl:gap-reverse">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{policy}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarDetailsPolicies;
