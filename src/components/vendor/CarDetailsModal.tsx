import React from "react";
import { X, Car, Fuel, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CarDetailsModalProps {
  car: any;
  onClose: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const CarDetailsModal = ({ car, onClose, t }: CarDetailsModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      dir={t("language") === "ar" ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{car.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900">
                {t("brand_and_model")}
              </h4>
              <p className="text-gray-600">
                {car.brand} {car.model}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{t("year")}</h4>
              <p className="text-gray-600">{car.year}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{t("type")}</h4>
              <p className="text-gray-600">{t(car.type)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{t("fuel_type")}</h4>
              <p className="text-gray-600">{t(car.fuel_type)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {t("transmission")}
              </h4>
              <p className="text-gray-600">{t(car.transmission)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{t("seats")}</h4>
              <p className="text-gray-600">{car.seats}</p>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{t("pricing")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">{t("daily_rate")}</div>
                <div className="text-lg font-semibold text-primary">
                  {car.daily_rate} SAR
                </div>
              </div>
              {car.weekly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">
                    {t("weekly_rate")}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {car.weekly_rate} SAR
                  </div>
                </div>
              )}
              {car.monthly_rate && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">
                    {t("monthly_rate")}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {car.monthly_rate} SAR
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("vehicle_details")}
              </h4>
              <div className="space-y-2">
                {car.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("color")}:</span>
                    <span>{car.color}</span>
                  </div>
                )}
                {car.license_plate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("license_plate")}:</span>
                    <span>{car.license_plate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("condition")}:</span>
                  <Badge variant="outline">{t(car.condition)}</Badge>
                </div>
                {car.mileage_limit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("daily_mileage_limit")}:
                    </span>
                    <span>{car.mileage_limit} KM</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("status")}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("availability")}:</span>
                  <Badge variant={car.is_available ? "default" : "secondary"}>
                    {t(car.is_available ? "available" : "unavailable")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("featured")}:</span>
                  <Badge variant={car.is_featured ? "default" : "outline"}>
                    {t(car.is_featured ? "yes" : "no")}
                  </Badge>
                </div>
                {car.deposit_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("deposit")}:</span>
                    <span>{car.deposit_amount} SAR</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Branch Info */}
          {car.branch_name && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("branch")}
              </h4>
              <p className="text-gray-600">{t(car.branch_name)}</p>
            </div>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("features")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {t(feature)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarDetailsModal;
