import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Navbar from "../layout/navbar/Navbar";

const OfferDetailsNotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t("offerNotFound")}
            </h1>
            <p className="text-gray-600">{t("noOffersFound")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsNotFound;
