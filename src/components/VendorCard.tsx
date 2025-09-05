import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Car, Building } from "lucide-react";

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    rating: number;
    image: string;
    verified: boolean;
    carsCount: number;
    branchCount: number;
    location: string;
  };
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  // Ensure rating is a valid number with fallback to 0
  const safeRating =
    typeof vendor.rating === "number" && !isNaN(vendor.rating)
      ? vendor.rating
      : 0;

  return (
    <Link to={`/vendors/${vendor.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
        <div className="aspect-video overflow-hidden">
          <img
            src={`https://test.get2cars.com/${vendor.image}`}
            alt={vendor.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
            {vendor.verified && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Verified
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{safeRating.toFixed(1)}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{vendor.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{vendor.carsCount} Cars</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              <span>{vendor.branchCount} Branches</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
