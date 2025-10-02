import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Shield, Clock, Fuel, CreditCard, Calendar, Ban } from "lucide-react";

interface OfferPoliciesTranslatedProps {
  offer: {
    validUntil: string;
    car: {
      deposit_amount?: number;
    };
    policies?: [];
  };
}

const OfferPoliciesTranslated = ({ offer }: OfferPoliciesTranslatedProps) => {
  const { t, language } = useLanguage();

  const policies = offer.policies;
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-6">
        {language === "ar" ? "سياسات العرض" : "Offer Policies"}
      </h3>

      <div className="space-y-4">
        {policies.map((policy, index) => {
          return (
            <div
              key={index}
              className="flex items-start gap-3 rtl:gap-reverse"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Ban className="w-4 h-4 text-primary" />
              </div>
              <span className="text-gray-700 text-sm leading-relaxed">
                {policy}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferPoliciesTranslated;
