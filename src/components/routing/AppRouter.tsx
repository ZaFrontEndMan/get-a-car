import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import routesConfig from "@/config/routes.json";

// Import all page components
import Index from "@/pages/Index";
import Cars from "@/pages/Cars";
import CarDetails from "@/pages/CarDetails";
import Vendors from "@/pages/Vendors";
import VendorDetails from "@/pages/VendorDetails";
import Offers from "@/pages/Offers";
import OfferDetails from "@/pages/OfferDetails";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogDetails from "@/pages/BlogDetails";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import More from "@/pages/More";
import Favorites from "@/pages/Favorites";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VendorDashboard from "@/pages/VendorDashboard";
import VendorCarDetails from "@/pages/VendorCarDetails";
// Add vendor tab components
import VendorOverview from "@/components/vendor/VendorOverview";
import VendorBranches from "@/components/vendor/VendorBranches";
import VendorCars from "@/components/vendor/VendorCars";
import VendorOffers from "@/components/vendor/VendorOffers";
import VendorBookings from "@/components/vendor/VendorBookings";
import VendorUsers from "@/components/vendor/VendorUsers";
import VendorProfile from "@/components/vendor/VendorProfile";
import VendorPolicies from "@/components/vendor/VendorPolicies";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminVendorDetails from "@/pages/AdminVendorDetails";
import AdminClientDetails from "@/pages/AdminClientDetails";
import NotFound from "@/pages/NotFound";

// Import dashboard components
import BookingsList from "@/components/dashboard/BookingsList";
import FavoritesList from "@/components/dashboard/FavoritesList";
import PaymentsList from "@/components/dashboard/PaymentsList";
import ProfileSection from "@/components/dashboard/ProfileSection";
import SupportSection from "@/components/dashboard/SupportSection";

// Import layout components
import PageLayout from "@/components/layout/PageLayout";
import ClientLayout from "@/components/layout/ClientLayout";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  Index,
  Cars,
  CarDetails,
  Vendors,
  VendorDetails,
  Offers,
  OfferDetails,
  Contact,
  About,
  Blog,
  BlogDetails,
  FAQ,
  Terms,
  Privacy,
  More,
  Favorites,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  VendorDashboard,
  VendorCarDetails,
  // Vendor tab components
  VendorOverview,
  VendorBranches,
  VendorCars,
  VendorOffers,
  VendorBookings,
  VendorUsers,
  VendorProfile,
  VendorPolicies,
  AdminDashboard,
  AdminVendorDetails,
  AdminClientDetails,
  NotFound,
  BookingsList,
  FavoritesList,
  PaymentsList,
  ProfileSection,
  SupportSection,
};

// Layout mapping
const layoutMap: Record<string, React.ComponentType<any>> = {
  PageLayout,
  ClientLayout,
  VendorDashboardLayout,
  AdminDashboardLayout,
};

interface RouteConfig {
  path: string;
  component: string;
  exact?: boolean;
  index?: boolean;
}

interface RouteSection {
  layout?: string | null;
  requiresAuth?: boolean;
  allowedRoles?: string[];
  basePath?: string;
  defaultRedirect?: string;
  redirectIfAuthenticated?: boolean;
  routes: RouteConfig[];
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  </div>
);

const AppRouter = React.memo(() => {
  const {
    isAuthenticated,
    isLoading,
    userRole,
    getDefaultRoute,
    canAccessRoute,
    preserveCurrentRoute,
    getPreservedRoute,
  } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced auth guard logic
  useEffect(() => {
    // Don't interfere during initial authentication loading
    if (isLoading) return;

    const currentPath = location.pathname;
    const routeSection = Object.entries(routesConfig).find(([_, section]) => {
      const sectionConfig = section as RouteSection;
      if (sectionConfig.basePath) {
        return currentPath.startsWith(sectionConfig.basePath);
      }
      return sectionConfig.routes.some((route) => {
        if (route.path === "*") return false;
        return (
          currentPath === route.path ||
          (route.path.includes(":") &&
            currentPath.match(
              new RegExp(route.path.replace(/:[^/]+/g, "[^/]+"))
            ))
        );
      });
    });

    if (routeSection) {
      const [_, section] = routeSection;
      const config = section as RouteSection;

      // Redirect authenticated users away from auth pages (signin, signup, etc.)
      if (config.redirectIfAuthenticated && isAuthenticated) {
        // Check if there's a preserved route to restore
        const preserved = getPreservedRoute();
        if (preserved) {
          navigate(preserved, { replace: true });
          return;
        }
        
        // Role-based redirect after login
        if (userRole === "admin") navigate("/admin", { replace: true });
        else if (userRole === "vendor")
          navigate("/vendor-dashboard", { replace: true });
        else if (userRole === "client")
          navigate("/dashboard", { replace: true });
        else navigate(getDefaultRoute(), { replace: true });
        return;
      }

      // Preserve current route before redirecting unauthenticated users
      if (config.requiresAuth && !isAuthenticated) {
        preserveCurrentRoute();
        navigate("/signin", { replace: true });
        return;
      }

      // Check role-based access for protected routes only
      if (config.allowedRoles && !canAccessRoute(config.allowedRoles as any)) {
        if (isAuthenticated) {
          // Role-based redirect
          if (userRole === "admin") navigate("/admin", { replace: true });
          else if (userRole === "vendor")
            navigate("/vendor-dashboard", { replace: true });
          else if (userRole === "client")
            navigate("/dashboard", { replace: true });
          else navigate(getDefaultRoute(), { replace: true });
        } else {
          preserveCurrentRoute();
          navigate("/signin", { replace: true });
        }
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    userRole,
    location.pathname,
    navigate,
    getDefaultRoute,
    canAccessRoute,
    preserveCurrentRoute,
    getPreservedRoute,
  ]);

  // Show loading spinner during authentication checks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderRouteSection = (
    sectionName: string,
    sectionConfig: RouteSection
  ) => {
    const { layout, basePath, routes } = sectionConfig;

    const routeElements = routes.map((route) => {
      const Component = componentMap[route.component];
      if (!Component) {
        console.warn(`Component ${route.component} not found in componentMap`);
        return null;
      }

      // For nested routes under basePath, use relative paths
      const routePath = basePath ? route.path : route.path;

      if (route.index) {
        return (
          <Route key={`${sectionName}-index`} index element={<Component />} />
        );
      }

      return (
        <Route
          key={`${sectionName}-${route.path}`}
          path={routePath}
          element={<Component />}
        />
      );
    });

    // If section has a layout, wrap routes in it
    if (layout && layoutMap[layout]) {
      const LayoutComponent = layoutMap[layout];
      if (basePath) {
        return (
          <Route
            key={sectionName}
            path={`${basePath}/*`}
            element={<LayoutComponent />}
          >
            {routeElements}
          </Route>
        );
      } else {
        return (
          <Route key={sectionName} element={<LayoutComponent />}>
            {routeElements}
          </Route>
        );
      }
    }

    return routeElements;
  };

  return (
    <Routes>
      {/* Render all route sections */}
      {Object.entries(routesConfig).map(([sectionName, sectionConfig]) =>
        renderRouteSection(sectionName, sectionConfig as RouteSection)
      )}
      {/* Default route handling */}
      <Route path="/" element={<Index />} />
    </Routes>
  );
});

export default AppRouter;
