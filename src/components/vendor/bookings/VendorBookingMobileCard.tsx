import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  cars: {
    name: string;
    brand: string;
    model: string;
    images: string[];
  };
}

interface VendorBookingMobileCardProps {
  booking: Booking;
}

const VendorBookingMobileCard = ({ booking }: VendorBookingMobileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          label: "Pending",
          icon: Clock,
        };
      case "confirmed":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          label: "Confirmed",
          icon: CheckCircle,
        };
      case "active":
      case "in_progress":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          label: "Active",
          icon: CheckCircle,
        };
      case "completed":
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          label: "Completed",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          label: "Cancelled",
          icon: XCircle,
        };
      case "return_requested":
        return {
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
          label: "Return Requested",
          icon: AlertCircle,
        };
      default:
        return {
          color: "bg-gray-400",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          label: status,
          icon: Clock,
        };
    }
  };

  const acceptReturnMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("accept_car_return", {
        booking_id_param: booking?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-bookings"] });
      toast.success("Car return accepted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to accept return: " + error.message);
    },
  });

  const statusConfig = getStatusConfig(booking?.booking_status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Car className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold text-lg">
                  {booking?.cars?.brand} {booking?.cars?.model}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{booking?.cars?.name}</p>
              <div className="flex items-center space-x-2">
                <Badge
                  className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{booking?.booking_number}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                SAR {booking?.total_amount}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs mt-1"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{booking?.customer_name}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-gray-600">
                  {new Date(booking?.pickup_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium">Return</p>
                <p className="text-gray-600">
                  {new Date(booking?.return_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{booking?.customer_phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-xs">{booking?.customer_email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-gray-600">{booking?.pickup_location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Return Location</p>
                    <p className="text-gray-600">{booking?.return_location}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>Payment: </span>
                  <Badge
                    variant={
                      booking?.payment_status === "paid"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {booking?.payment_status}
                  </Badge>
                </div>

                {booking?.booking_status === "return_requested" && (
                  <Button
                    size="sm"
                    onClick={() => acceptReturnMutation.mutate()}
                    disabled={acceptReturnMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept Return
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorBookingMobileCard;
