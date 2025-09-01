import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavoritesData } from "../../hooks/useFavoritesData";
import { Grid, List, Users, Fuel, Car, Heart, Trash2 } from "lucide-react";

const FavoritesList: React.FC = () => {
  const { t } = useLanguage();
  const { favorites, removeFromFavorites, isLoading } = useFavoritesData();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Heart className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noFavorites")}
        </h3>
        <p className="text-gray-600">{t("noFavoritesDescription")}</p>
      </div>
    );
  }

  const handleRemove = (carId: string) => {
    removeFromFavorites(carId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {t("myFavorites")} ({favorites.length})
        </h1>
        {/* Hide view toggle on mobile */}
        <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={favorite.car.images?.[0] || "/placeholder.svg"}
                  alt={favorite.car.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemove(favorite.car.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {favorite.car.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  {favorite.car.brand} {favorite.car.model} {favorite.car.year}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>5 Seats</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-4 w-4" />
                    <span>Petrol</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src={favorite.car.vendor.logo_url || "/placeholder.svg"}
                      alt={favorite.car.vendor.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">
                      {favorite.car.vendor.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ${favorite.car.daily_rate}/day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={favorite.car.images?.[0] || "/placeholder.svg"}
                  alt={favorite.car.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {favorite.car.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {favorite.car.brand} {favorite.car.model}{" "}
                    {favorite.car.year}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>5 Seats</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="h-4 w-4" />
                      <span>Petrol</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={favorite.car.vendor.logo_url || "/placeholder.svg"}
                        alt={favorite.car.vendor.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{favorite.car.vendor.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary mb-2">
                    ${favorite.car.daily_rate}/day
                  </p>
                  <button
                    onClick={() => handleRemove(favorite.car.id)}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
