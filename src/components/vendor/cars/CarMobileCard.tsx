import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Edit,
  Trash2,
  Eye,
  Users,
  Fuel,
  Settings,
  Calendar,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import LazyImage from "@/components/ui/LazyImage";

interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  fuel_type: string;
  transmission: string;
  daily_rate: number;
  weekly_rate?: number;
  monthly_rate?: number;
  is_available: boolean;
  is_featured: boolean;
  images: string[];
  features: string[];
  pickup_locations: string[];
  condition: string;
  color?: string;
  license_plate?: string;
  mileage_limit?: number;
  deposit_amount?: number;
}

interface CarMobileCardProps {
  car: CarData;
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
  t: (key: string, params?: Record<string, any>) => string; // Translation function
}

const CarMobileCard = ({
  car,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  t,
}: CarMobileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRtl = t("language") === "ar"; // Assuming translations include a 'language' key

  return (
    <Card className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with Image */}
          <div className="flex gap-3">
            <div className="w-20 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {car.images && car.images.length > 0 ? (
                <LazyImage
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg truncate">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">{car.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={car.is_available ? "default" : "secondary"}>
                      {t(car.is_available ? "available" : "not_available")}
                    </Badge>
                    {car.is_featured && (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-600"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {t("featured")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {t("sar_per_day", { amount: car.daily_rate })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs mt-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {t("less")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        {t("more")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span>    {`${t("seats")}  ${car.doors}`}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3 text-gray-400" />
              <span className="capitalize">{t(car.fuel_type)}</span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-700">{t("type")}</p>
                  <p className="text-gray-600 capitalize">{t(car.type)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    {t("transmission")}
                  </p>
                  <p className="text-gray-600 capitalize">
                    {t(car.transmission)}
                  </p>
                </div>
              </div>

              {(car.color || car.license_plate) && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {car.color && (
                    <div>
                      <p className="font-medium text-gray-700">{t("color")}</p>
                      <p className="text-gray-600 capitalize">{car.color}</p>
                    </div>
                  )}
                  {car.license_plate && (
                    <div>
                      <p className="font-medium text-gray-700">
                        {t("license_plate")}
                      </p>
                      <p className="text-gray-600">{car.license_plate}</p>
                    </div>
                  )}
                </div>
              )}

              {(car.weekly_rate || car.monthly_rate) && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">{t("pricing")}</p>
                  <div className="flex items-center gap-4">
                    {car.weekly_rate && (
                      <span className="text-gray-600">
                        {t("sar_per_week", { amount: car.weekly_rate })}
                      </span>
                    )}
                    {car.monthly_rate && (
                      <span className="text-gray-600">
                        {t("sar_per_month", { amount: car.monthly_rate })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {car.features && car.features.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">{t("features")}</p>
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}{" "}
                        {/* Assume features are API-provided and not translated */}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        {t("more_items", { count: car.features.length - 3 })}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {car.pickup_locations && car.pickup_locations.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-700">
                    {t("pickup_locations")}
                  </p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {car.pickup_locations.slice(0, 2).join(", ")}
                      {car.pickup_locations.length > 2 &&
                        ` ${t("more_items", {
                          count: car.pickup_locations.length - 2,
                        })}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(car)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>{t("view")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(car)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                <span>{t("edit")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(car)}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>{t("duplicate")}</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(car.id)}
              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
              <span>{t("delete")}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarMobileCard;
