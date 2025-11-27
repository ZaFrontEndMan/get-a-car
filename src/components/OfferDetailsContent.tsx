import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import CarFeatures from "./CarFeatures";
import {
  Star,
  Users,
  Fuel,
  Settings,
  Calendar,
  Tag,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface OfferDetailsContentProps {
  offer: {
    discount: number;
    car: {
      id: string;
      name: string;
      brand: string;
      image: string;
      gallery: string[];
      rating: number;
      reviews: number;
      seats: number;
      fuel: string;
      transmission: string;
      year: number;
      features: string[];
      pricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
      originalPricing: {
        daily: number;
        weekly: number;
        monthly: number;
      };
    };
    vendor: {
      id: string;
      name: string;
      rating: number;
      image?: string;
      logo_url?: string;
      verified: boolean;
      carsCount: number;
      location?: string;
      phone?: string;
      email?: string;
      website?: string;
      description?: string;
      total_reviews?: number;
    };
    rentalCarDetails: {
      withDriver: boolean;
    };
  };
  selectedPricing: "daily" | "weekly" | "monthly";
}

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL;

const OfferDetailsContent = ({
  offer,
  selectedPricing,
}: OfferDetailsContentProps) => {
  const { t } = useLanguage();

  // Check if there's an active discount
  const hasDiscount = offer?.discount !== 0;

  return (
    <div className="space-y-6">
      {/* Car Info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-start  md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {offer.car.name}
            </h1>
            <p className="text-gray-600 text-lg">
              {offer.car.brand} • {offer.car.year}
            </p>
          </div>
          <div className="text-start rtl:text-end">
            <div className="flex flex-col md:items-end rtl:md:items-start space-y-2">
              <div className="flex items-center gap-2 ">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {t("sarPerDay")} {offer.car.pricing[selectedPricing]}
                </div>
                {hasDiscount && (
                  <div className="bg-black/40 text-white px-2 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                    {`${offer.discount}% ${t("discount")} `}
                  </div>
                )}
                {hasDiscount && (
                  <div className="text-lg line-through text-gray-400">
                    {t("currency")} {offer.car.originalPricing[selectedPricing]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Car Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="flex items-center gap-3  p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.seats}
              </div>
              <div className="text-xs text-gray-500">{t("seats")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3  p-3 bg-gray-50 rounded-lg">
            <Fuel className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.fuel}
              </div>
              <div className="text-xs text-gray-500">{t("fuel")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3  p-3 bg-gray-50 rounded-lg">
            <Settings className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.transmission}
              </div>
              <div className="text-xs text-gray-500">{t("transmission")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3  p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {offer.car.year}
              </div>
              <div className="text-xs text-gray-500">{t("year")}</div>
            </div>
          </div>
          {offer.rentalCarDetails?.withDriver && (
            <div className="flex items-center gap-3  p-3 bg-gray-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {t("driver")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vendor Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("vendorInfo") || "Vendor"}
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center rtl:md:flex-row-reverse gap-6">
              {/* Vendor Image */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300">
                  {offer?.vendor?.image ? (
                    <img
                      src={offer?.vendor?.image}
                      alt={offer.vendor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {offer.vendor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {offer.vendor.verified && (
                  <div className="absolute bottom-0 end-0 bg-green-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* Vendor Info */}
              <div className="flex-1 md:text-start rtl:md:text-end">
                <div className="mb-3">
                  <Link to={`/vendors/${offer?.vendor?.id}`}>
                    <h4 className="text-xl font-bold text-gray-900 mb-1 hover:underline  cursor-pointer">
                      {offer.vendor.name}
                    </h4>
                  </Link>
                  {offer.vendor.verified && (
                    <div className="flex items-center gap-2  mb-2">
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("verified") || "Verified"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Vendor Description */}
                {offer.vendor.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {offer.vendor.description}
                  </p>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {offer.vendor.location && (
                    <div className="flex items-center gap-2  text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{offer.vendor.location}</span>
                    </div>
                  )}
                  {offer.vendor.phone && (
                    <div className="flex items-center gap-2  text-gray-600 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <a
                        href={`tel:${offer.vendor.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {offer.vendor.phone}
                      </a>
                    </div>
                  )}
                  {offer.vendor.email && (
                    <div className="flex items-center gap-2  text-gray-600 text-sm">
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      <a
                        href={`mailto:${offer.vendor.email}`}
                        className="hover:text-primary transition-colors truncate"
                      >
                        {offer.vendor.email}
                      </a>
                    </div>
                  )}
                  {offer.vendor.website && (
                    <div className="flex items-center gap-2  text-gray-600 text-sm">
                      <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                      <a
                        href={offer.vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors truncate"
                      >
                        {offer.vendor.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Discount Badge */}
              {offer.discount > 0 && (
                <div className="flex-shrink-0 bg-primary text-white rounded-lg px-4 py-3 text-center">
                  <div className="text-3xl font-bold">{offer.discount}%</div>
                  <div className="text-xs font-medium mt-1">
                    {t("discount") || "Discount"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsContent;
