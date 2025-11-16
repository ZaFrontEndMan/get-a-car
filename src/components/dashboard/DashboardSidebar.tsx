import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Calendar,
  Heart,
  CreditCard,
  User,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import LazyImage from "../ui/LazyImage";

interface SidebarItem {
  key: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  route: string;
}

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarExpanded,
  setIsSidebarExpanded,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarItems: SidebarItem[] = [
    {
      key: "bookings",
      icon: Calendar,
      label: t("myBookings"),
      route: "/dashboard/bookings",
    },
    {
      key: "favorites",
      icon: Heart,
      label: t("favorites"),
      route: "/dashboard/favorites",
    },
    {
      key: "payments",
      icon: CreditCard,
      label: t("payments"),
      route: "/dashboard/payments",
    },
    {
      key: "profile",
      icon: User,
      label: t("profile"),
      route: "/dashboard/profile",
    },
    {
      key: "support",
      icon: HelpCircle,
      label: t("support"),
      route: "/dashboard/support",
    },
  ];

  return (
    <motion.aside
      className={`bg-white shadow-md flex flex-col h-full overflow-x-hidden transition`}
      initial={{ width: 256 }}
      animate={{ width: isSidebarExpanded ? 256 : 60 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center border-b border-gray-100 p-4">
        {isSidebarExpanded && (
          <h1 className="text-xl font-semibold truncate">{t("dashboard")}</h1>
        )}
        <motion.div
          animate={{ rotate: isSidebarExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </motion.div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              location.pathname === item.route ||
              (item.key === "bookings" && location.pathname === "/dashboard");
            return (
              <li
                key={item.key}
                className="relative flex items-center group"
                onMouseEnter={() =>
                  !isSidebarExpanded && setHoveredItem(item.key)
                }
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => {
                    navigate(item.route);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg text-start gap-2 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } `}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                >
                  <IconComponent
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {isSidebarExpanded && (
                    <span className="me-2 font-medium truncate flex items-center gap-1">
                      {item.label}
                    </span>
                  )}
                </button>
                {/* Tooltip for collapsed sidebar */}
                <AnimatePresence>
                  {!isSidebarExpanded && hoveredItem === item.key && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute start-14 mb-12 z-50"
                    >
                      <div className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                        {item.label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      {isSidebarExpanded ? (
        <LazyImage
          className="h-16 w-full object-cover p-2"
          src="/full-logo.png"
          alt="logo"
        />
      ) : (
        <LazyImage
          className="h-16 w-full object-contain p-2"
          src="/cropped-logo.jpeg"
          alt="logo"
        />
      )}
    </motion.aside>
  );
};

export default DashboardSidebar;
