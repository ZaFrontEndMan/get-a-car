import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMostPopularOffers } from "@/hooks/website/useWebsiteOffers";
import { SectionSkeleton } from "./ui/SkeletonLoaders";
import SectionHeader from "./ui/SectionHeader";
import { getImageUrl, DEFAULT_IMAGES } from "@/utils/imageUtils";
const OffersSection = () => {
  const { t, language } = useLanguage();
  // Use the new API hook for popular offers
  const { data: apiResponse, isLoading } = useMostPopularOffers();

  // Transform API response to match the expected format for the UI
  const offers =
    apiResponse?.data?.map((offer) => ({
      id: offer.id.toString(),
      title: offer.offerTitle,
      title_ar: "", // API doesn't provide Arabic titles yet
      description: offer.offerDescription,
      description_ar: "", // API doesn't provide Arabic descriptions yet
      discount: `${Math.round(
        ((offer.oldPricePerDay - offer.totalPrice) / offer.oldPricePerDay) * 100
      )}% OFF`,
      image: getImageUrl(offer.offerImage, DEFAULT_IMAGES.offer),
      validUntil: offer.endDate,
      carId: offer.carId,
      vendor: {
        id: offer.carId.toString(),
        name: "Vendor", // API doesn't provide vendor name
        logo_url: getImageUrl(offer.companyLogo),
      },
    })) || [];
  const getLocalizedTitle = (offer: any) => {
    if (language === "ar" && offer.title_ar) {
      return offer.title_ar;
    }
    return offer.title;
  };
  const getLocalizedDescription = (offer: any) => {
    if (language === "ar" && offer.description_ar) {
      return offer.description_ar;
    }
    return offer.description;
  };
  if (isLoading) {
    return <SectionSkeleton type="offers" count={4} />;
  }
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title={t("specialOffers")} 
          viewAllLink="/offers" 
          showViewAll={true}
        />

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No offers available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => (
              <Link
                key={offer.id}
                to={`/offers/${offer.id}?carId=${offer.carId}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in overflow-hidden block flex flex-col h-full"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={getLocalizedTitle(offer)}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-red text-white px-3 py-1 rounded-full font-bold text-sm">
                    {offer.discount}
                  </div>

                  {/* Vendor Logo */}
                  {offer.vendor?.logo_url && (
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
                      <img
                        src={offer.vendor.logo_url}
                        alt={offer.vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {getLocalizedTitle(offer)}
                  </h3>
                  <p className="text-gray-600 mb-3 flex-grow">
                    {getLocalizedDescription(offer)}
                  </p>
                  <p className="text-sm text-secondary font-medium mb-4 text-center">
                    {t("validUntil")} {" "}
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </p>

                  <div className="w-full gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 rtl:gap-reverse mt-auto bg-blue-900">
                    <span>{t("viewOffer")}</span>
                    {language === "ar" ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default OffersSection;
