import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, AlertCircle, Clock, CheckCircle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBookingsStatistics } from "@/hooks/vendor/useVendorBooking";
import { useLanguage } from "@/contexts/LanguageContext";

const VendorOverview = () => {
  const { t } = useLanguage();

  const { data: bookingsStats, isLoading: isBookingsStatsLoading } =
    useGetBookingsStatistics();

  // State to hold animated values for each statistic
  const [animatedValues, setAnimatedValues] = useState<{
    [key: string]: number;
  }>({});

  // Animation duration and steps
  const duration = 1000; // 1 second
  const frameRate = 16; // ~60fps (1000ms / 60 ≈ 16ms per frame)

  useEffect(() => {
    const stats = [
      {
        key: "totalBookingsCount",
        value: bookingsStats?.data?.totalBookingsCount || 0,
      },
      {
        key: "pendingBookingsCount",
        value: bookingsStats?.data?.pendingBookingsCount || 0,
      },
      {
        key: "cancelledBookingsCount",
        value: bookingsStats?.data?.cancelledBookingsCount || 0,
      },
      {
        key: "inProgressBookingCount",
        value: bookingsStats?.data?.inProgressBookingCount || 0,
      },
      {
        key: "carReturnedBookingCount",
        value: bookingsStats?.data?.carReturnedBookingCount || 0,
      },
      {
        key: "completedBookingsCount",
        value: bookingsStats?.data?.completedBookingsCount || 0,
      },
      { key: "totalCars", value: bookingsStats?.data?.totalCars || 0 },
      { key: "availableCars", value: bookingsStats?.data?.availableCars || 0 },
    ];

    // Initialize animated values
    const initialValues = stats.reduce((acc, stat) => {
      acc[stat.key] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setAnimatedValues(initialValues);

    // Set up animation for each statistic
    stats.forEach((stat) => {
      const target = stat.value;
      if (target === 0) return; // Skip animation for 0

      const steps = Math.ceil(duration / frameRate);
      const increment = target / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setAnimatedValues((prev) => ({
          ...prev,
          [stat.key]: Math.min(Math.round(prev[stat.key] + increment), target),
        }));

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues((prev) => ({
            ...prev,
            [stat.key]: target, // Ensure final value is exact
          }));
        }
      }, frameRate);

      return () => clearInterval(interval); // Cleanup on unmount
    });
  }, [bookingsStats]);

  if (isBookingsStatsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{t("loadingData")}</span>
      </div>
    );
  }

  const bookingStatCards = [
    {
      title: t("totalBookingsCount"),
      value: animatedValues["totalBookingsCount"] || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: t("pendingBookingsCount"),
      value: animatedValues["pendingBookingsCount"] || 0,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: t("cancelledBookingsCount"),
      value: animatedValues["cancelledBookingsCount"] || 0,
      icon: AlertCircle,
      color: "text-red",
      bgColor: "bg-red-50",
    },
    {
      title: t("inProgressBookingCount"),
      value: animatedValues["inProgressBookingCount"] || 0,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("carReturnedBookingCount"),
      value: animatedValues["carReturnedBookingCount"] || 0,
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("completedBookingsCount"),
      value: animatedValues["completedBookingsCount"] || 0,
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: t("totalCars"),
      value: animatedValues["totalCars"] || 0,
      icon: Car,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: t("availableCars"),
      value: animatedValues["availableCars"] || 0,
      icon: Car,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 container">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("bookingStatistics")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingStatCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {bookingsStats?.data.totalBookingsCount === 0 &&
        bookingsStats?.data.pendingBookingsCount === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t("gettingStarted")}
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                {t("welcomeMessage")}
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default VendorOverview;
