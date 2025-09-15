import React from "react";
import { useLanguage } from '../contexts/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import VendorCard from "./VendorCard";
import { useWebsiteVendors } from "@/hooks/website/useWebsiteVendors";
import { SectionSkeleton } from "./ui/SkeletonLoaders";
import SectionHeader from "./ui/SectionHeader";

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
      rating: 0, // API doesn't provide rating
      image: vendor?.companyLogo,
      verified: false, // API doesn't provide this field
      carsCount: vendor.availableCars,
      branchCount: vendor.totalBranches,
      location: vendor.mainBranchAddress || "Saudi Arabia",
    }));

  if (isLoading) {
    return <SectionSkeleton type="vendors" count={6} />;
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("topVendors")}
          viewAllLink="/vendors"
          showViewAll={true}
        />

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
