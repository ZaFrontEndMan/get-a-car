import { Clock, CheckCircle, PauseCircle, Car, XCircle } from "lucide-react";

// Define the supported status number type for better type safety:
export type APISupportedBookingStatus =
  | 1 // Waiting
  | 2 // Completed
  | 3 // Cancelled
  | 4 // InProgress
  | 5 // CarReturn
  | 6; // Offer;

// API status map for labels in Arabic (or you can use t() here if you have i18n)
export const bookingStatusLabels: Record<APISupportedBookingStatus, string> = {
  1: "منتظر", // Waiting
  2: "تم إرجاع السيارة", // Completed
  3: "ملغي", // Cancelled
  4: "قيد الاجراء", // In Progress
  5: "طلب استرجاع", // Car Return
  6: "العروض", // Offer
};

// Icon/color config mapped by status number
export const getStatusConfig = (
  status: APISupportedBookingStatus | number | string
) => {
  // Ensure status is always an integer
  let key = Number(status) as APISupportedBookingStatus;
  const statusConfigs: Record<
    APISupportedBookingStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive";
      icon: React.ElementType;
      color: string;
      dotColor: string;
    }
  > = {
    1: {
      // Waiting
      label: bookingStatusLabels[1],
      variant: "secondary",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dotColor: "bg-yellow-500",
    },
    2: {
      // Completed
      label: bookingStatusLabels[2],
      variant: "default",
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dotColor: "bg-blue-500",
    },
    3: {
      // Cancelled
      label: bookingStatusLabels[3],
      variant: "destructive",
      icon: XCircle,
      color: "bg-rose-100 text-red-800 border-rose-200",
      dotColor: "bg-red-500",
    },
    4: {
      // InProgress
      label: bookingStatusLabels[4],
      variant: "default",
      icon: PauseCircle,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      dotColor: "bg-orange-500",
    },
    5: {
      // CarReturn
      label: bookingStatusLabels[5],
      variant: "destructive",
      icon: Car,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      dotColor: "bg-purple-500",
    },
    6: {
      // Offer
      label: bookingStatusLabels[6],
      variant: "default",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      dotColor: "bg-green-500",
    },
  };
  return statusConfigs[key] || statusConfigs[1]; // default to Waiting if not found
};
