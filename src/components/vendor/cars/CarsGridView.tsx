import React from "react";
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
  Calendar,
  Star,
  Copy,
} from "lucide-react";
import CarMobileCard from "./CarMobileCard";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface CarsGridViewProps {
  cars: CarData[];
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
}

const CarsGridView = ({
  cars,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
}: CarsGridViewProps) => {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card
            key={car.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gray-200 relative">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {car.is_featured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  {t("featured")}
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">{car.name}</p>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={car.is_available ? "default" : "secondary"}>
                    {t(car.is_available ? "available" : "not_available")}
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {t("sar_per_day", { amount: car.daily_rate })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{t("seats", { count: car.seats })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span className="capitalize">{t(car.fuel_type)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(car)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(car)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDuplicate(car)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(car.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Stack View */}
      <div className="md:hidden space-y-4">
        {cars.map((car) => (
          <CarMobileCard
            key={car.id}
            car={car}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onView={onView}
            t={t} // Pass translation function
          />
        ))}
      </div>
    </div>
  );
};

export default CarsGridView;
