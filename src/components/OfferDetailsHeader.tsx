import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Tag, Calendar } from "lucide-react";

interface OfferDetailsHeaderProps {
  offer: {
    id: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    discount: string;
    validUntil: string;
    offerImage?: string;
  };
}
const OfferDetailsHeader = ({ offer }: OfferDetailsHeaderProps) => {
  const { t, language } = useLanguage();

  const getLocalizedTitle = () => {
    if (language === "ar" && offer.title_ar) {
      return offer.title_ar;
    }
    return offer.title;
  };

  const getLocalizedDescription = () => {
    if (language === "ar" && offer.description_ar) {
      return offer.description_ar;
    }
    return offer.description;
  };

  // Get offer image from nested offerCollectionForCars
  const offerImage = offer.offerImage;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 rtl:gap-reverse">
            <li>
              <Link to="/" className="text-gray-500 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <Link to="/vendors" className="text-gray-500 hover:text-primary">
                Vendors
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-primary font-medium">Getcar</li>
          </ol>
        </nav>
      </div>

      {/* Banner: show image if present, else fallback to red banner */}
      {offerImage ? (
        <img
          src={offerImage}
          alt="Offer Banner"
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      ) : (
        <div className="bg-gradient-to-r from-red to-red/80 rounded-2xl p-6 text-white mb-8 flex flex-col">
          <div className="flex items-center gap-3 rtl:gap-reverse mb-4">
            <Tag className="h-6 w-6" />
            <span className="text-2xl font-bold">
              {offer.discount} {t("discount")}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{getLocalizedTitle()}</h1>
          <p className="text-lg mb-4">{getLocalizedDescription()}</p>
          <div className="flex items-center gap-2 rtl:gap-reverse text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {t("validUntil")}{" "}
              {new Date(offer.validUntil).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferDetailsHeader;
