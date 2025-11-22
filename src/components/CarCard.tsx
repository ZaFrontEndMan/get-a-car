import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Heart, Users, Fuel, Settings } from "lucide-react";
import LazyImage from "./ui/LazyImage";
import { useClientFavorites } from "@/hooks/client/useClientFavorites";
import { useAuth } from "@/contexts/AuthContext";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    brand: string;
    model?: string;
    image?: string;
    images?: string[];
    price?: number;
    daily_rate?: number;
    weeklyPrice?: number;
    weekly_rate?: number;
    monthlyPrice?: number;
    monthly_rate?: number;
    rating?: number;
    features?: string[];
    seats: number;
    fuel?: string;
    fuel_type?: string;
    transmission: string;
    vendor?: {
      id: string;
      name: string;
      logo_url?: string;
    };
    vendors?: {
      id: string;
      name: string;
      logo_url?: string;
    };
    isWishList?: boolean;
  };
  viewMode?: "grid" | "list";
}

const Toast = ({ message, onClose }) => {
  // Auto-dismiss after 2 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded shadow-lg text-center transition">
      {message}
    </div>
  );
};

const CarCard = ({ car, viewMode = "grid" }: CarCardProps) => {
  const { t } = useLanguage();
  const {
    addToFavorites,
    removeFromFavoritesByCarId,
    isAdding,
    isRemovingByCarId,
  } = useClientFavorites();
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();

  const isCarFavorite = car.isWishList;
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowToast(true);
      return;
    } else if (car && isCarFavorite) {
      removeFromFavoritesByCarId(car.id);
    } else {
      addToFavorites(car.id);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/cars/${car.id}`;
  };

  const imageSource =
    car.image || (car.images ? car.images[0] : "") || "/placeholder.svg";
  const dailyPrice = car.price || car.daily_rate || 0;
  const weeklyPrice = car.weeklyPrice || car.weekly_rate || null;
  const monthlyPrice = car.monthlyPrice || car.monthly_rate || null;
  const vendor = car.vendor || car.vendors || null;

  const fuelType = (car.fuel || car.fuel_type || "gasoline")
    .trim()
    .split(" ")[0];
  const transmissionType = (car.transmission || "automatic").trim();

  if (viewMode === "list") {
    return (
      <>
        <Link
          to={`/cars/${car.id}${location.search}`}
          className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex gap-6 p-6">
            <div className="relative w-48 h-32 flex-shrink-0">
              <LazyImage
                src={imageSource}
                alt={car.title}
                className="w-full h-full rounded-xl object-cover"
              />
              {vendor?.logo_url && vendor?.id && (
                <div className="absolute bottom-3 start-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white hover:scale-125 transition duration-300">
                  <Link to={`/vendors/${vendor?.id}`}>
                    <LazyImage
                      title={vendor.name}
                      src={vendor.logo_url}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
              )}
              <button
                onClick={handleFavoriteClick}
                disabled={isAdding || isRemovingByCarId}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-200 z-10 ${
                  isCarFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                }`}
                aria-label={t("toggleFavorite")}
              >
                <Heart
                  className="h-3 w-3"
                  fill={isCarFavorite ? "currentColor" : "none"}
                />
              </button>
              {car.withDriver && (
                <div className="absolute top-2 end-2 bg-green-600 text-white px-2 py-0.5 rounded-xl text-xs font-semibold shadow z-10">
                  {t("withDriver")}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 truncate">
                      {car.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{car.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 rtl:gap-reverse text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1 rtl:gap-reverse">
                    <Users className="h-4 w-4" />
                    <span>{car.seats}</span>
                  </div>
                  <div className="flex items-center gap-1 rtl:gap-reverse">
                    <Fuel className="h-4 w-4" />
                    <span>{t(fuelType.toLowerCase())}</span>
                  </div>
                  <div className="flex items-center gap-1 rtl:gap-reverse">
                    <Settings className="h-4 w-4" />
                    <span>{t(transmissionType.toLowerCase())}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">{t("daily")}</span>
                  <div className="text-2xl font-bold text-primary">
                    {t("currency")} {dailyPrice}
                  </div>
                </div>
                <button
                  onClick={handleBookClick}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  {t("bookNow")}
                </button>
              </div>
            </div>
          </div>
        </Link>
        {showToast && (
          <Toast
            message={t("loginToSyncFavorites")}
            onClose={() => setShowToast(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Link
        to={`/cars/${car.id}${location.search}`}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
      >
        <div className="relative flex-shrink-0">
          <LazyImage
            src={imageSource}
            alt={car.title}
            className="w-full h-48 object-cover"
          />
          {vendor?.logo_url && vendor?.id && (
            <div className="absolute bottom-3 start-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white hover:scale-125 transition duration-300">
              <Link to={`/vendors/${vendor?.id}`}>
                <LazyImage
                  title={vendor.name}
                  src={vendor.logo_url}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            disabled={isAdding || isRemovingByCarId}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 z-10 ${
              isCarFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
            aria-label={t("toggleFavorite")}
          >
            <Heart
              className="h-4 w-4"
              fill={isCarFavorite ? "currentColor" : "none"}
            />
          </button>
          {car.withDriver && (
            <div className="absolute top-2 end-2 bg-green-600 text-white px-2 py-0.5 rounded-xl text-xs font-semibold shadow z-10">
              {t("withDriver")}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {car.title}
              </h3>
              <p className="text-gray-600 text-sm">{car.model || car.brand}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rtl:gap-reverse text-gray-600 text-sm mb-3">
            <div className="flex items-center gap-1 rtl:gap-reverse">
              <Users className="h-4 w-4" />
              <span>{car.seats}</span>
            </div>
            <div className="flex items-center gap-1 rtl:gap-reverse">
              <Fuel className="h-4 w-4" />
              <span>{t(fuelType.toLowerCase())}</span>
            </div>
            <div className="flex items-center gap-1 rtl:gap-reverse">
              <Settings className="h-4 w-4" />
              <span>{t(transmissionType.toLowerCase())}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-bold">
                {t("dailyRate")}
              </span>
              <span className="text-lg font-bold text-primary">
                {t("currency")} {dailyPrice}
              </span>
            </div>
            <div className="flex justify-between items-center min-h-[20px]">
              {weeklyPrice ? (
                <>
                  <span className="text-sm text-gray-600">
                    {t("weeklyRate")}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {t("currency")} {weeklyPrice}
                  </span>
                </>
              ) : (
                <div className="h-5"></div>
              )}
            </div>
            <div className="flex justify-between items-center min-h-[20px]">
              {monthlyPrice ? (
                <>
                  <span className="text-sm text-gray-600">
                    {t("monthlyRate")}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {t("currency")} {monthlyPrice}
                  </span>
                </>
              ) : (
                <div className="h-5"></div>
              )}
            </div>
          </div>
          <div
            onClick={handleBookClick}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-center cursor-pointer mt-auto"
          >
            {t("bookNow")}
          </div>
        </div>
      </Link>
      {showToast && (
        <Toast
          message={t("loginToSyncFavorites")}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default CarCard;
