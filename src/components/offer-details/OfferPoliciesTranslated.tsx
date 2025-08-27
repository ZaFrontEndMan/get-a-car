
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, Clock, Fuel, CreditCard, Calendar, Ban } from 'lucide-react';

interface OfferPoliciesTranslatedProps {
  offer: {
    validUntil: string;
    car: {
      deposit_amount?: number;
    };
  };
}

const OfferPoliciesTranslated = ({ offer }: OfferPoliciesTranslatedProps) => {
  const { t, language } = useLanguage();

  const policies = [
    {
      icon: Clock,
      text: language === 'ar' ? 'الحد الأدنى للعمر: 25 سنة' : 'Minimum age: 25 years'
    },
    {
      icon: Shield,
      text: language === 'ar' ? 'رخصة قيادة سارية المفعول مطلوبة' : 'Valid driving license required'
    },
    {
      icon: CreditCard,
      text: `${language === 'ar' ? 'مبلغ التأمين' : 'Security deposit'}: ${language === 'ar' ? 'ريال' : 'SAR'} ${offer.car.deposit_amount || 250}`
    },
    {
      icon: Fuel,
      text: language === 'ar' ? 'الوقود: الإرجاع بنفس المستوى' : 'Fuel: Return with same level'
    },
    {
      icon: Ban,
      text: language === 'ar' ? 'إلغاء مجاني حتى 24 ساعة قبل الاستلام' : 'Free cancellation up to 24 hours before pickup'
    },
    {
      icon: Calendar,
      text: `${language === 'ar' ? 'العرض صالح حتى' : 'Offer valid until'} ${new Date(offer.validUntil).toLocaleDateString()}`
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-6">
        {language === 'ar' ? 'سياسات العرض' : 'Offer Policies'}
      </h3>
      
      <div className="space-y-4">
        {policies.map((policy, index) => {
          const IconComponent = policy.icon;
          return (
            <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">{policy.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferPoliciesTranslated;
