import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Tag, Calendar } from "lucide-react";
import LazyImage from "./ui/LazyImage";

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
    offerTitle?: string;
    offerDescription?: string;
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

  const offerImage = offer.offerImage;

  return (
    <>
      {offerImage ? (
        <div className="relative w-full h-64 rounded-xl mb-4 overflow-hidden">
          {/* Background Image */}
          <LazyImage
            src={offerImage}
            alt="Offer Banner"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            {/* Discount Badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span className="text-xl font-bold">
                  {`${offer.discount}% ${t("discount")} `}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
              {offer.offerTitle || getLocalizedTitle()}
            </h1>

            {/* Description */}
            {(offer.offerDescription || getLocalizedDescription()) && (
              <p className="text-lg mb-3 drop-shadow-md line-clamp-2">
                {offer.offerDescription || getLocalizedDescription()}
              </p>
            )}

            {/* Valid Until */}
            <div className="flex items-center gap-2 rtl:gap-reverse text-sm bg-black/30 backdrop-blur-sm w-fit px-3 py-1.5 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>
                {t("validUntil")}{" "}
                {new Date(offer.validUntil).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
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
