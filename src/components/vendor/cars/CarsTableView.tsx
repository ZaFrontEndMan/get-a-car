import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Star, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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

interface CarsTableViewProps {
  cars: CarData[];
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onDuplicate: (car: CarData) => void;
  onView: (car: CarData) => void;
  isDeleting: boolean;
}

const CarsTableView = ({
  cars,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  isDeleting,
}: CarsTableViewProps) => {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <div
      className="border rounded-lg overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("car")}</TableHead>
            <TableHead>{t("brand_model")}</TableHead>
            <TableHead>{t("year")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("seats")}</TableHead>
            <TableHead>{t("fuel")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("daily_rate")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <LazyImage
                        src={car.images[0]}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{car.name}</p>
                    {car.is_featured && (
                      <Badge
                        variant="outline"
                        className="text-xs text-yellow-600 border-yellow-600"
                      >
                        <Star className="h-2 w-2 mr-1" />
                        {t("featured")}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  {car.brand} {car.model}
                </span>
              </TableCell>
              <TableCell>{car.year}</TableCell>
              <TableCell className="capitalize">{t(car.type)}</TableCell>
              <TableCell>{car.doors}</TableCell>
              <TableCell className="capitalize">{t(car.fuel_type)}</TableCell>
              <TableCell>
                <Badge variant={car.is_available ? "default" : "secondary"}>
                  {t(car.is_available ? "available" : "not_available")}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-green-600">
                  {t("sar_per_day", { amount: car.daily_rate })}
                </span>
              </TableCell>
              <TableCell>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(car.id)}
                    disabled={isDeleting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarsTableView;
