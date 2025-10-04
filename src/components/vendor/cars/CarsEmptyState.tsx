import React from "react";
import { Car as CarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CarsEmptyStateProps {
  currentUser: any;
  onAddCar: () => void;
  error?: any;
  t: (key: string, params?: Record<string, any>) => string; // Translation function
}

const CarsEmptyState = ({
  currentUser,
  onAddCar,
  error,
  t,
}: CarsEmptyStateProps) => {
  if (!currentUser) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("authentication_required")}
          </h3>
          <p className="text-gray-600 mb-4">{t("please_sign_in")}</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("error_loading_cars")}
          </h3>
          <p className="text-gray-600 mb-4">{t("try_refreshing")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("no_cars_yet")}
        </h3>
        <p className="text-gray-600 mb-4">{t("get_started_add_car")}</p>
        <Button onClick={onAddCar}>{t("add_first_car")}</Button>
      </CardContent>
    </Card>
  );
};

export default CarsEmptyState;
