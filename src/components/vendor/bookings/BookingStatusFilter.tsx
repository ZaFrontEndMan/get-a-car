import React from "react";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Clock,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Car,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "InProgress"
  | "return_requested"
  | "completed"
  | "cancelled";

interface BookingStatusFilterProps {
  statusFilter: BookingStatus | "all";
  onFilterChange: (status: BookingStatus | "all") => void;
  statusCounts: Record<string, number>;
  totalBookings: number;
}

const BookingStatusFilter = ({
  statusFilter,
  onFilterChange,
  statusCounts,
  totalBookings,
}: BookingStatusFilterProps) => {
  const { language } = useLanguage();

  const filterButtons = [
    { key: "all", label: language === "ar" ? "الكل" : "All", icon: Filter },
    { key: "pending", label: language === "ar" ? "قيد الانتظار" : "Pending", icon: Clock },
    { key: "confirmed", label: language === "ar" ? "تم التأكيد" : "Confirmed", icon: CheckCircle },
    { key: "active", label: language === "ar" ? "نشط" : "Active", icon: PlayCircle },
    { key: "InProgress", label: language === "ar" ? "قيد التقدم" : "In Progress", icon: PauseCircle },
    {
      key: "return_requested",
      label: language === "ar" ? "طلب إرجاع" : "Return Requested",
      icon: Car,
    },
    { key: "completed", label: language === "ar" ? "مكتمل" : "Completed", icon: CheckCircle },
    { key: "cancelled", label: language === "ar" ? "ملغى" : "Cancelled", icon: XCircle },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((button) => {
          const count =
            button.key === "all"
              ? totalBookings
              : statusCounts[button.key] || 0;
          const isActive = statusFilter === button.key;
          const IconComponent = button.icon;

          return (
            <Button
              key={button.key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onFilterChange(button.key as BookingStatus | "all")
              }
              className={`flex items-center gap-2 rtl:gap-reverse transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{button.label}</span>
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
