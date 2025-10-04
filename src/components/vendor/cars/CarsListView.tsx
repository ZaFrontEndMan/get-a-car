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
  Settings,
  Calendar,
  Star,
  Copy,
} from "lucide-react";
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

interface CarsListViewProps {
  cars: CarData[];
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
  isDeleting: boolean;
}

const CarsListView = ({
  cars,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  isDeleting,
}: CarsListViewProps) => {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      {cars.map((car) => (
        <Card key={car.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">{car.name}</p>
                  </div>
                  {car.is_featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {t("featured")}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{t("seats", { count: car.seats })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    <span className="capitalize">{t(car.fuel_type)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span className="capitalize">{t(car.transmission)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Badge variant={car.is_available ? "default" : "secondary"}>
                    {t(car.is_available ? "available" : "not_available")}
                  </Badge>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    {t("sar_per_day", { amount: car.daily_rate })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(car)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(car)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate(car)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(car.id)}
                    disabled={isDeleting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarsListView;
