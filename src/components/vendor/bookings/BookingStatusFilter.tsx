import React from "react";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Clock,
  CheckCircle,
  PauseCircle,
  Car,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type APISupportedBookingStatus = 1 | 2 | 3 | 4 | 5 | 6 | undefined;

// Numeric value to display label/icon mapping and which API count field to use
const apiStatusButtons = [
  {
    key: undefined,
    apiStatus: undefined,
    label: { ar: "الكل", en: "All" },
    icon: Filter,
    countKey: "totalRecords",
  },
  {
    key: "Waiting",
    apiStatus: 1,
    label: { ar: "منتظر", en: "Waiting" },
    icon: Clock,
    countKey: "waitingCount",
  },
  {
    key: "InProgress",
    apiStatus: 4,
    label: { ar: "قيد الاجراء", en: "In Progress" },
    icon: PauseCircle,
    countKey: "inProgressCount",
  },
  {
    key: "CarReturn",
    apiStatus: 5,
    label: { ar: "طلب استرجاع", en: "Car Return" },
    icon: Car,
    countKey: "carReturnCount",
  },
  {
    key: "Completed",
    apiStatus: 2,
    label: { ar: "تم إرجاع السيارة", en: "Completed" },
    icon: CheckCircle,
    countKey: "completedCount",
  },
  {
    key: "Cancelled",
    apiStatus: 3,
    label: { ar: "ملغي", en: "Cancelled" },
    icon: XCircle,
    countKey: "cancelledCount",
  },
  {
    key: "Offer",
    apiStatus: 6,
    label: { ar: "العروض", en: "Offers" },
    icon: CheckCircle,
    countKey: "offerCount",
  },
];

interface BookingStatusCounts {
  waitingCount?: number;
  completedCount?: number;
  cancelledCount?: number;
  inProgressCount?: number;
  carReturnCount?: number;
  offerCount?: number;
  totalRecords?: number;
}
interface BookingStatusFilterProps {
  statusFilter: APISupportedBookingStatus;
  onFilterChange: (apiStatus: APISupportedBookingStatus) => void;
  apiCounts: BookingStatusCounts;
}

const BookingStatusFilter = ({
  statusFilter,
  onFilterChange,
  apiCounts,
}: BookingStatusFilterProps) => {
  const { language } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex flex-wrap gap-2">
        {apiStatusButtons.map((button) => {
          const count =
            apiCounts?.[button.countKey as keyof BookingStatusCounts] ?? 0;
          const isActive = statusFilter === button.key;
          const IconComponent = button.icon;
          return (
            <Button
              key={String(button.key)}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(button.key)}
              className={`flex items-center gap-2 rtl:gap-reverse transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{button.label[language === "ar" ? "ar" : "en"]}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStatusFilter;
