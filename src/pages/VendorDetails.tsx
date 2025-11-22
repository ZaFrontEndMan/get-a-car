import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import VendorProfileHeader from "../components/VendorProfileHeader";
import VendorPoliciesDisplay from "../components/VendorPoliciesDisplay";
import CarCard from "../components/CarCard";
import { useVendorCars } from "@/hooks/website/useWebsiteVendors";
import { getImageUrl, DEFAULT_IMAGES } from "@/utils/imageUtils";

// Skeleton Loading Components
const VendorHeaderSkeleton = () => (
  <motion.div
    className="bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl p-8 mb-8"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="h-40 bg-slate-300 rounded-lg mb-4" />
    <div className="h-8 bg-slate-300 rounded w-1/2 mb-2" />
    <div className="h-4 bg-slate-300 rounded w-1/4" />
  </motion.div>
);

const PolicySkeleton = () => (
  <motion.div
    className="bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg p-4 mb-4"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="h-6 bg-slate-300 rounded w-3/4 mb-2" />
    <div className="h-4 bg-slate-300 rounded w-full mb-2" />
    <div className="h-4 bg-slate-300 rounded w-5/6" />
  </motion.div>
);

const CarCardSkeleton = () => (
  <motion.div
    className="bg-white rounded-lg overflow-hidden shadow"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="aspect-video bg-slate-300 rounded-lg mb-4" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-slate-300 rounded w-3/4" />
      <div className="h-4 bg-slate-300 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-4 bg-slate-300 rounded flex-1" />
        <div className="h-4 bg-slate-300 rounded flex-1" />
      </div>
    </div>
  </motion.div>
);

const VendorDetailsContent = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const [vendor, setVendor] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: vendorCarsData,
    isLoading: vendorCarsLoading,
    isError,
  } = useVendorCars(id ?? "");

  useEffect(() => {
    if (!vendorCarsData) return;
    const data = vendorCarsData.data;
    const normalizePath = (p?: string) =>
      p ? p.replace(/\\/g, "/") : undefined;

    const mappedVendor = {
      id: id,
      name: data.vendorDetails.companyName,
      logo: getImageUrl(
        normalizePath(data.vendorDetails.companyLogo),
        DEFAULT_IMAGES.vendor
      ),
      manager: t("generalManager"),
      phone: data.vendorDetails.phoneNumber || t("notProvided"),
      email: data.vendorDetails.email,
      address:
        data.vendorDetails.mainBranchAddress || t("locationNotSpecified"),
      rating: 4.7,
      reviews: 0,
      verified: true,
      carsCount: data.vendorDetails.avilableCars || data.carSearchResult.length,
      joinedDate: new Date().getFullYear().toString(),
      description: "",
      workingHours:
        "Sunday - Thursday: 8:00 AM - 10:00 PM\nFriday - Saturday: 10:00 AM - 11:00 PM",
    };

    const mappedCars = data.carSearchResult.map((c: any) => ({
      id: String(c.carId),
      title: c.name,
      brand: c.vendorName || c.model || "",
      image: getImageUrl(
        (c.imageURLs && c.imageURLs.length
          ? normalizePath(c.imageURLs[0])
          : undefined) || undefined,
        DEFAULT_IMAGES.car
      ),
      images: (c.imageURLs || []).map((p: string) =>
        getImageUrl(normalizePath(p), DEFAULT_IMAGES.car)
      ),
      isWishList: c?.isWishList,
      daily_rate: c.pricePerDay,
      weekly_rate: c.pricePerWeek,
      monthly_rate: c.pricePerMonth,
      rating: c.isGoodRating ? 4.8 : 4.5,
      seats: typeof c.doors === "number" ? c.doors : 4,
      fuel_type: (c.fuelType || "").trim(),
      transmission: c.transmission,
      type: c.type,
      vendor: {
        id: c.vendorId,
        name: c.vendorName,
        logo_url: getImageUrl(
          normalizePath(data.vendorDetails.companyLogo),
          DEFAULT_IMAGES.vendor
        ),
      },
    }));

    setVendor(mappedVendor);
    setCars(mappedCars);
  }, [vendorCarsData, id, t]);

  useEffect(() => {
    setLoading(vendorCarsLoading);
  }, [vendorCarsLoading]);

  const filteredCars = cars;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Breadcrumb Skeleton */}
        <motion.div
          className="mb-6 h-6 bg-slate-300 rounded w-1/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Header Skeleton */}
        <VendorHeaderSkeleton />

        {/* Policies Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-300 rounded w-1/4 mb-4" />
          {[...Array(3)].map((_, i) => (
            <PolicySkeleton key={i} />
          ))}
        </div>

        {/* Cars Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-300 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-lg text-red-600">{t("errorFetchingData")}</div>
      </motion.div>
    );
  }

  if (!vendor) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-lg text-gray-600">{t("vendorNotFound")}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8"
      dir={isRTL ? "rtl" : "ltr"}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Breadcrumb */}
      <motion.div className="mb-6" variants={itemVariants}>
        <nav aria-label="Breadcrumb">
          <ol
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <li>
              <Link
                to="/"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <Link
                to="/vendors"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {t("vendors")}
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-primary font-medium">{vendor.name}</li>
          </ol>
        </nav>
      </motion.div>

      {/* Vendor Profile Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <VendorProfileHeader vendor={vendor} />
      </motion.div>

      {/* Vendor Policies Section */}
      <motion.div className="mb-8" variants={itemVariants}>
        <VendorPoliciesDisplay vendorId={vendor.id} maxPolicies={10} />
      </motion.div>

      {/* Available Cars */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("availableCars")} ({vendor?.carsCount})
          </h2>
          <Link
            to={`/cars/vendor/${vendor?.id}`}
            className="text-primary hover:underline font-medium"
          >
            {t("viewAll")}
          </Link>
        </div>

        {filteredCars.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCars.slice(0, 4).map((car) => (
              <motion.div key={car.id} variants={itemVariants}>
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center text-gray-600 py-8"
            variants={itemVariants}
          >
            {t("noCarsAvailable")}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const VendorDetails = () => {
  return (
    <LanguageProvider>
      <VendorDetailsContent />
    </LanguageProvider>
  );
};

export default VendorDetails;
