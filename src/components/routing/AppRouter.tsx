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
import ErrorBoundary from "@/components/ErrorBoundary";

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
import AdminDashboard from "@/pages/AdminDashboard";
import AdminVendorDetails from "@/pages/AdminVendorDetails";
import AdminClientDetails from "@/pages/AdminClientDetails";
import NotFound from "@/pages/NotFound";

// Import vendor tab components
import VendorOverview from "@/components/vendor/VendorOverview";
import VendorBranches from "@/components/vendor/VendorBranches";
import VendorCars from "@/components/vendor/VendorCars";
import VendorOffers from "@/components/vendor/VendorOffers";
import VendorBookings from "@/components/vendor/VendorBookings";
import VendorUsers from "@/components/vendor/VendorUsers";
import VendorProfile from "@/components/vendor/VendorProfile";
import VendorPolicies from "@/components/vendor/VendorPolicies";

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
const components: Record<string, React.ComponentType<any>> = {
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
const layouts: Record<string, React.ComponentType<any>> = {
  PageLayout,
  ClientLayout,
  VendorDashboardLayout,
  AdminDashboardLayout,
};

// Single loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, userRole, canAccessRoute } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !canAccessRoute(allowedRoles as any)) {
    const redirectMap: Record<string, string> = {
      admin: "/admin",
      vendor: "/vendor-dashboard",
      client: "/dashboard",
    };
    return <Navigate to={redirectMap[userRole] || "/"} replace />;
  }

  return <>{children}</>;
};

// Auth route wrapper (redirects if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole, getPreservedRoute } = useUser();

  if (!isAuthenticated) return <>{children}</>;

  const preserved = getPreservedRoute();
  if (preserved) return <Navigate to={preserved} replace />;

  const redirectMap: Record<string, string> = {
    admin: "/admin",
    vendor: "/vendor-dashboard",
    client: "/dashboard",
  };
  return <Navigate to={redirectMap[userRole] || "/"} replace />;
};

// Dynamic component renderer
const RenderComponent = ({ componentName }: { componentName: string }) => {
  const Component = components[componentName];

  if (!Component) {
    console.error(`Component ${componentName} not found`);
    return <Navigate to="/404" replace />;
  }

  return <Component />;
};

// Route builder
const buildRoutes = (config: any, sectionName: string) => {
  const {
    layout,
    requiresAuth,
    allowedRoles,
    redirectIfAuthenticated,
    basePath,
    routes,
  } = config;

  const routeElements = routes.map((route: any) => {
    const element = <RenderComponent componentName={route.component} />;

    // Wrap with auth logic
    let wrappedElement = element;
    if (requiresAuth || allowedRoles) {
      wrappedElement = (
        <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
      );
    } else if (redirectIfAuthenticated) {
      wrappedElement = <AuthRoute>{element}</AuthRoute>;
    }

    const routeProps = {
      key: `${sectionName}-${route.path}`,
      ...(route.index ? { index: true } : { path: route.path }),
      element: wrappedElement,
    };

    return <Route {...routeProps} />;
  });

  // Wrap with layout if specified
  if (layout && layouts[layout]) {
    const LayoutComponent = layouts[layout];
    return (
      <Route
        key={sectionName}
        path={basePath ? `${basePath}/*` : undefined}
        element={<LayoutComponent />}
      >
        {routeElements}
      </Route>
    );
  }

  return routeElements;
};

const AppRouter = () => {
  const { isLoading, isAuthenticated, preserveCurrentRoute } = useUser();
  const location = useLocation();

  // Preserve route for unauthenticated users accessing protected pages
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== "/signin") {
      const isProtectedRoute = Object.values(routesConfig).some(
        (config: any) => config.requiresAuth || config.allowedRoles
      );
      if (isProtectedRoute) {
        preserveCurrentRoute();
      }
    }
  }, [isLoading, isAuthenticated, location.pathname, preserveCurrentRoute]);

  if (isLoading) return <Loading />;

  return (
    <ErrorBoundary>
      <Routes>
        {Object.entries(routesConfig).map(([name, config]) =>
          buildRoutes(config, name)
        )}
        <Route
          path="*"
          element={<RenderComponent componentName="NotFound" />}
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;
