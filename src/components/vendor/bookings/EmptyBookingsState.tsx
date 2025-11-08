import React from "react";
import { Car, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyBookingsStateProps {
  isFiltered: boolean;
  statusFilter: string;
}

const EmptyBookingsState = ({
  isFiltered,
  statusFilter,
}: EmptyBookingsStateProps) => {
  const { t } = useLanguage();

  if (isFiltered) {
    return (
      <div className="text-center py-12">
        <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noBookings")}
        </h3>
        <p className="text-gray-500">{t("noBookingsDescription")}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t("noBookings")}
      </h3>
      <p className="text-gray-500">{t("noBookingsDescription")}</p>
    </div>
  );
};

export default EmptyBookingsState;
