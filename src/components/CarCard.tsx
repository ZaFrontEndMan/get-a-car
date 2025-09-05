import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useWishlist } from "../hooks/useWishlist";
import { Heart, Star, Users, Fuel, Settings } from "lucide-react";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    brand: string;
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
  };
}

const CarCard = ({ car }: CarCardProps) => {
  const { t } = useLanguage();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  console.log(car);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      id: car.id,
      name: car.title,
      image: car.image || (car.images && car.images[0]) || "",
      price: car.price || car.daily_rate || 0,
      brand: car.brand,
    };

    if (isInWishlist(car.id)) {
      removeFromWishlist(car.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to car details page for booking
    window.location.href = `/cars/${car.id}`;
  };

  const isCarFavorite = isInWishlist(car.id);

  // Get the correct image source
  const imageSource =
    car.image || (car.images && car.images[0]) || "/placeholder.svg";

  // Get the correct price
  const dailyPrice = car.price || car.daily_rate || 0;
  const weeklyPrice = car.weeklyPrice || car.weekly_rate;
  const monthlyPrice = car.monthlyPrice || car.monthly_rate;

  // Get vendor info (support both vendor and vendors structure)
  const vendor = car.vendor || car.vendors;

  // Get fuel type and transmission with safety checks
  const fuelType = car.fuel || car.fuel_type || "";
  const transmissionType = car.transmission || "";

  // Get rating with fallback
  const rating = car.rating || 4.5;

  return (
    <Link
      to={`/cars/${car.id}`}
      className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
    >
      <div className="relative">
        <img
          src={imageSource}
          alt={car.title}
          className="w-full h-48 object-cover"
        />

        {/* Vendor Logo */}
        {vendor?.logo_url && (
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
            <img
              src={vendor.logo_url}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 z-10 ${
            isCarFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          <Heart
            className="h-4 w-4"
            fill={isCarFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{car.title}</h3>
            <p className="text-gray-600 text-sm">{car.brand}</p>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Star className="h-4 w-4 text-accent fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-600 text-sm mb-3">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Users className="h-4 w-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Fuel className="h-4 w-4" />
            <span>{fuelType ? t(fuelType.toLowerCase()) : t("gasoline")}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Settings className="h-4 w-4" />
            <span>
              {transmissionType
                ? t(transmissionType.toLowerCase())
                : t("automatic")}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-bold">
              {t("daily")}
            </span>
            <span className="text-lg font-bold text-primary">
              {t("currency")} {dailyPrice}
            </span>
          </div>
          {weeklyPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t("weekly")}</span>
              <span className="text-sm font-semibold text-gray-800">
                {t("currency")} {weeklyPrice}
              </span>
            </div>
          )}
          {monthlyPrice && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t("monthly")}</span>
              <span className="text-sm font-semibold text-gray-800">
                {t("currency")} {monthlyPrice}
              </span>
            </div>
          )}
        </div>

        <div
          onClick={handleBookClick}
          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-center cursor-pointer"
        >
          {t("bookNow")}
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
