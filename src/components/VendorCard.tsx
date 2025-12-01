import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Car, Building } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl, DEFAULT_IMAGES } from "@/utils/imageUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import LazyImage from "./ui/LazyImage";

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
  const { t } = useLanguage();

  const safeRating =
    typeof vendor.rating === "number" && !isNaN(vendor.rating)
      ? vendor.rating
      : 0;

  const imageSrc = getImageUrl(vendor.image, DEFAULT_IMAGES.vendor);

  return (
    <Link to={`/vendors/${vendor.id}`} className="block">
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="aspect-video overflow-hidden"
          whileHover={{ scale: 1.1 }}
        >
          <LazyImage
            src={imageSrc}
            alt={vendor.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </motion.div>

        <div className="p-4">
          <motion.div
            className="flex items-start justify-between mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
            {vendor.verified && (
              <motion.div
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                title={t("verified")}
              >
                {t("verified")}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="flex items-center gap-1 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            title={t("rating")}
          >
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{safeRating.toFixed(1)}</span>
          </motion.div>

          <motion.div
            className="flex items-center text-gray-600 text-sm mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            title={t("location")}
          >
            <MapPin className="h-4 w-4 me-1 flex-shrink-0" />
            <span className="truncate">{vendor.location}</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              title={t("availableCars")}
            >
              <Car className="h-4 w-4 me-1 flex-shrink-0" />
              <span>
                {vendor.carsCount} {t("cars")}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              title={t("totalBranches")}
            >
              <Building className="h-4 w-4 me-1 flex-shrink-0" />
              <span>
                {vendor.branchCount} {t("branches")}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default VendorCard;
