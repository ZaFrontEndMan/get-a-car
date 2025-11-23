import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { Users, Car, Calendar, Building2, Building } from "lucide-react";

const AchievementsSection = () => {
  const { t } = useLanguage();

  // Use the useAdminSettings hook to get website statistics
  const { data: settings, isLoading } = useAdminSettings();
  const statistics = settings?.websiteStatistics;

  const getIconComponent = (iconName: string) => {
    const icons = {
      users: Users,
      car: Car,
      calendar: Calendar,
      vendors: Building2,
      branches: Building,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Users;
    return <IconComponent className="h-8 w-8 text-primary" />;
  };

  // Map the fetched statistics to a displayable array
  const achievements = statistics
    ? [
        {
          id: "clients",
          icon: "users",
          value: statistics[0]?.numberOfClients,
          titleKey: "happyClients",
          descriptionKey: "clientsWhoTrustOurService",
        },
        {
          id: "bookings",
          icon: "calendar",
          value: statistics[0]?.numberOfBookings,
          titleKey: "bookingsCompleted",
          descriptionKey: "successfulBookingsMade",
        },
        {
          id: "cars",
          icon: "car",
          value: statistics[0]?.numberOfCars,
          titleKey: "carsAvailable",
          descriptionKey: "carsReadyForRental",
        },
        {
          id: "vendors",
          icon: "vendors",
          value: statistics[0]?.numberOfVendors,
          titleKey: "ourPartners",
          descriptionKey: "vendorsPartneringWithUs",
        },
        {
          id: "branches",
          icon: "branches",
          value: statistics[0]?.numberOfBranches,
          titleKey: "ourPartners",
          descriptionKey: "branchesPartneringWithUs",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[11px]">
              {t("ourAchievements") || "Our Achievements"}
            </h2>
            <div className="w-24 h-1 gradient-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  console.log(statistics);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 py-[11px]">
            {t("ourAchievements") || "Our Achievements"}
          </h2>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex justify-center mb-4">
                {getIconComponent(achievement.icon)}
              </div>

              <h3 className="text-3xl font-bold text-primary mb-2">
                {achievement.value}+
              </h3>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {t(achievement.titleKey)}
              </h4>

              <p className="text-gray-600 text-sm">
                {t(achievement.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
