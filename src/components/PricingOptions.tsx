
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingOptionsProps {
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  selected: 'daily' | 'weekly' | 'monthly';
  onSelect: (option: 'daily' | 'weekly' | 'monthly') => void;
}

const PricingOptions = ({ pricing, selected, onSelect }: PricingOptionsProps) => {
  const { t } = useLanguage();
  
  const options = [
    { key: 'daily' as const, label: t('daily'), price: pricing.daily, savings: null },
    { key: 'weekly' as const, label: t('weekly'), price: pricing.weekly, savings: '15%' },
    { key: 'monthly' as const, label: t('monthly'), price: pricing.monthly, savings: '25%' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('selectRentalPeriod')}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              selected === option.key
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-semibold text-gray-900">{option.label}</div>
                {option.savings && (
                  <div className="text-sm text-green-600">Save {option.savings}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{t('currency')} {option.price}</div>
                <div className="text-xs text-gray-600">per {option.key.replace('ly', '')}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PricingOptions;
