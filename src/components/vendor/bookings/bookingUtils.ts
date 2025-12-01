import { Clock, CheckCircle, PauseCircle, Car, XCircle } from "lucide-react";

export type APISupportedBookingStatus =
  | 1 // Waiting
  | 2 // Completed
  | 3 // Cancelled
  | 4 // InProgress
  | 5 // CarReturn
  | 6; // Offer

export const bookingStatusLabels: Record<APISupportedBookingStatus, string> = {
  1: "منتظر", // Waiting
  2: "تم إرجاع السيارة", // Completed
  3: "تم الالغاء", // Cancelled
  4: "قيد الاجراء", // In Progress
  5: "مكتمل", // Car Return
  6: "عرض", // Offer
};

// Maps Arabic/English status to number, fallback to undefined
export const statusStringToNumber: Record<string, APISupportedBookingStatus> = {
  // Arabic
  منتظر: 1,
  "تم إرجاع السيارة": 2,
  "تم الالغاء": 3,
  "قيد الاجراء": 4,
  "مكتمل": 5,
  عرض: 6,
  // English (in case, for robustness)
  waiting: 1,
  carreturn: 2,
  cancelled: 3,
  inprogress: 4,
  completed: 5,
  offer: 6,
};

export const getStatusConfig = (
  status: APISupportedBookingStatus | number | string
) => {
  // Resolve string status to number if needed
  let key: APISupportedBookingStatus;

  if (typeof status === "number") {
    key = status as APISupportedBookingStatus;
  } else if (typeof status === "string") {
    // Try direct numeric conversion
    const asNum = Number(status);
    if (!isNaN(asNum) && asNum >= 1 && asNum <= 6) {
      key = asNum as APISupportedBookingStatus;
    } else {
      // Try text mapping
      key =
        statusStringToNumber[status.trim()] ||
        statusStringToNumber[status.trim().toLowerCase().replace(/\s+/g, "")] ||
        1; // fallback to 1 if not found
    }
  } else {
    key = 1;
  }

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
      label: bookingStatusLabels[1],
      variant: "secondary",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dotColor: "bg-yellow-500",
    },
    2: {
      label: bookingStatusLabels[2],
      variant: "default",
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dotColor: "bg-blue-500",
    },
    3: {
      label: bookingStatusLabels[3],
      variant: "destructive",
      icon: XCircle,
      color: "bg-rose-100 text-red-800 border-rose-200",
      dotColor: "bg-red-500",
    },
    4: {
      label: bookingStatusLabels[4],
      variant: "default",
      icon: PauseCircle,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      dotColor: "bg-orange-500",
    },
    5: {
      label: bookingStatusLabels[5],
      variant: "destructive",
      icon: Car,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      dotColor: "bg-purple-500",
    },
    6: {
      label: bookingStatusLabels[6],
      variant: "default",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      dotColor: "bg-green-500",
    },
  };
  return statusConfigs[key] || statusConfigs[1];
};
