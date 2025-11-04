import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Car, ExternalLink } from "lucide-react";
import VendorPoliciesDisplay from "../VendorPoliciesDisplay";

interface OfferVendorSectionProps {
  vendor: {
    id: string;
    name: string;
    rating?: number;
    totalReviews?: number;
    image?: string;
    verified?: boolean;
    location?: string;
    carsCount?: number;
  };
}

const OfferVendorSection = ({ vendor }: OfferVendorSectionProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleViewVendor = () => {
    navigate(`/vendors/${vendor.id}`);
  };

  // Optional: Keep this for a separate "View All Cars" button if desired
  const handleViewAllCars = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("vendor", vendor.name);
    navigate(`/cars?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Vendor Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            {language === "ar" ? "معلومات المؤجر" : "Vendor Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={
                  vendor.image ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center"
                }
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-lg">{vendor.name}</h4>
                {vendor.verified && (
                  <Badge variant="secondary" className="text-xs">
                    {language === "ar" ? "موثق" : "Verified"}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                {vendor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{vendor.rating}</span>
                    {vendor.totalReviews && (
                      <span>
                        ({vendor.totalReviews}{" "}
                        {language === "ar" ? "تقييم" : "reviews"})
                      </span>
                    )}
                  </div>
                )}

                {vendor.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.location}</span>
                  </div>
                )}

                {vendor.carsCount && (
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    <span>
                      {vendor.carsCount} {language === "ar" ? "سيارة" : "cars"}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleViewVendor}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {language === "ar" ? "عرض المؤجر" : "View Vendor"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Policies - Only show once here */}
      <VendorPoliciesDisplay
        vendorId={vendor.id}
        maxPolicies={8}
        policyTypes={["booking", "cancellation", "payment", "fuel", "general"]}
      />
    </div>
  );
};

export default OfferVendorSection;
