// src/components/TopVendorsSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import VendorCard from "./VendorCard";
import { useWebsiteVendors } from "@/hooks/website/useWebsiteVendors";

const TopVendorsSection = () => {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useWebsiteVendors();

  // ✅ Extract vendors safely from API response
  const vendors = data?.data.vendorsOwners ?? [];

  // ✅ Transform vendors into props for VendorCard
  const processedVendors = vendors
    .filter((v) => v.availableCars > 0) // mimic active/verified filter
    .slice(0, 10) // top 10
    .map((vendor) => ({
      id: vendor.id,
      name: vendor.companyName,
      rating: 0, // API doesn’t provide rating
      image:
        vendor.companyLogo ||
        "/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png",
      verified: false, // API doesn’t provide this field
      carsCount: vendor.availableCars,
      branchCount: vendor.totalBranches,
      location: vendor.mainBranchAddress || "Saudi Arabia",
    }));

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t("loadingVendors")}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">{t("failedToLoadVendors")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[9px]">
              {t("topVendors")}
            </h2>
            <div className="w-24 h-1 gradient-primary rounded-full"></div>
          </div>
          <Link
            to="/vendors"
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span>{t("viewAll")}</span>
            {language === "ar" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Link>
        </div>

        {processedVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {t("noVendorsAvailable") || "No vendors available"}
            </p>
          </div>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="ps-2 md:ps-4 py-12">  
              {processedVendors.map((vendor, index) => (
                <CarouselItem
                  key={vendor.id}
                  className="ps-2 md:ps-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <VendorCard vendor={vendor} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default TopVendorsSection;
