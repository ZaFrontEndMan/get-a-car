import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Clock } from "lucide-react";

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    discount: string;
    validUntil: string;
    image: string;
    terms: string[];
    carId?: string;
    vendor?: {
      id: string;
      name: string;
      logo_url?: string;
    };
  };
  onFavorite?: (offerId: string) => void;
  isFavorite?: boolean;
  isLoading?: boolean;
}

const OfferCard = ({ offer, isLoading }: OfferCardProps) => {
  const { language, t } = useLanguage();

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

  const truncateDescription = (text: string, wordLimit: number = 15) => {
    const words = text?.split(" ");
    if (words?.length <= wordLimit) {
      return text;
    }
    return words?.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <Link
      to={`/offers/${offer.id}${offer.carId ? `?carId=${offer.carId}` : ""}`}
      className={`"block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 ${
        isLoading ? " animate-pulse opacity-75 pointer-events-none" : ""
      }`}
    >
      <div className="relative">
        <img
          src={offer.image}
          alt={getLocalizedTitle()}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 start-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {offer.discount} {t("off")}
        </div>

        {offer.vendor?.logo_url && (
          <div className="absolute bottom-3 start-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white hover:scale-125 transition duration-300">
            <Link to={`/vendors/${offer.vendor?.id}`}>
              <img
                title={offer.vendor.name}
                src={offer.vendor.logo_url}
                alt={offer.vendor.name}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
          {getLocalizedTitle()}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-1">
          {truncateDescription(getLocalizedDescription(), 15)}
        </p>

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Clock className="h-3 w-3 me-2" />
          <span className="text-center text-blue-700 text-md">
            {t("validUntil")} {new Date(offer.validUntil).toLocaleDateString()}
          </span>
        </div>
        <Link
          to={`/offers/${offer.id}${
            offer.carId ? `?carId=${offer.carId}` : ""
          }`}
          className="block w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold cursor-pointer text-center"
        >
          {t("claimOffer")}
        </Link>
      </div>
    </Link>
  );
};

export default OfferCard;
