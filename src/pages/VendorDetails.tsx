import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import VendorProfileHeader from "../components/VendorProfileHeader";
import VendorPoliciesDisplay from "../components/VendorPoliciesDisplay";
import CarCard from "../components/CarCard";
import { useVendorCars } from "@/hooks/website/useWebsiteVendors";
import { getImageUrl, DEFAULT_IMAGES } from "@/utils/imageUtils";

const VendorDetailsContent = () => {
  const { id } = useParams();
  const { t } = useLanguage();
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
      manager: "General Manager",
      phone: data.vendorDetails.phoneNumber || "Not provided",
      email: data.vendorDetails.email,
      address: data.vendorDetails.mainBranchAddress || "Location not specified",
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
  }, [vendorCarsData, id]);

  useEffect(() => {
    setLoading(vendorCarsLoading);
  }, [vendorCarsLoading]);

  const filteredCars = cars;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">
          {t("errorFetchingData") || "Error loading vendor details"}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Vendor not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 rtl:space-x-reverse">
            <li>
              <Link
                to="/"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Home
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
                Vendors
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-primary font-medium">{vendor.name}</li>
          </ol>
        </nav>
      </div>

      {/* Vendor Profile Header */}
      <div className="mb-8">
        <VendorProfileHeader vendor={vendor} />
      </div>

      {/* Vendor Policies Section */}
      <div className="mb-8">
        <VendorPoliciesDisplay vendorId={vendor.id} maxPolicies={10} />
      </div>

      {/* Available Cars (Top 4) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("availableCars")} ({filteredCars.length})
          </h2>
          <Link
            to={`/cars?vendor=${vendor?.name}`}
            className="text-primary hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.slice(0, 4).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
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
