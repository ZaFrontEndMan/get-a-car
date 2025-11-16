import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Car, Clock, Shield } from "lucide-react";
import LazyImage from "../ui/LazyImage";

interface Car {
  name: string;
  brand: string;
  image: string;
}

interface BookingCarInfoProps {
  car: Car;
  t: (key: string) => string;
  pricingType: string;
  rentalDays: number;
  onAdjustDays: (increment: boolean) => void;
  formattedPricing: {
    basePrice: string;
    calculation: string;
  };
}

const BookingCarInfo = ({
  car,
  pricingType,
  rentalDays,
  onAdjustDays,
  t,
  formattedPricing,
}: BookingCarInfoProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row items-center gap-6 rtl:gap-reverse">
        <div className="relative">
          <LazyImage
            src={car.image}
            alt={car.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md"
          />
          <div className="absolute -top-2 -right-2 rtl:-left-2 rtl:right-auto bg-primary text-white rounded-full p-2">
            <Car className="h-4 w-4" />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {car.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-2">{car.brand}</p>
          <div className="flex items-center justify-center lg:justify-start rtl:lg:justify-end gap-2 rtl:gap-2 text-primary font-semibold">
            <Shield className="h-4 w-4" />
            <span className="text-sm sm:text-base">
              {rentalDays + " " + (rentalDays === 1 ? t("day") : t("days"))}{" "}
              {formattedPricing.basePrice}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rtl:bg-gradient-to-l rounded-xl p-4 border border-blue-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 rtl:gap-2 mb-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">
                {t("rentalPeriod")}
              </p>
            </div>
            <div className="flex items-center gap-3 rtl:gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAdjustDays(false)}
                className="h-10 w-10 p-0 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                disabled={rentalDays <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border flex items-center gap-2 rtl:gap-2">
                <span className="font-bold text-lg text-gray-900">
                  {rentalDays}
                </span>
                <span className="text-sm text-gray-600">
                  {rentalDays === 1 ? t("day") : t("days")}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAdjustDays(true)}
                className="h-10 w-10 p-0 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCarInfo;
