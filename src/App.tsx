import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Index from "./pages/Index";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import Offers from "./pages/Offers";
import OfferDetails from "./pages/OfferDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Favorites from "./pages/Favorites";
import VendorDashboard from "./pages/VendorDashboard";
import VendorCarDetails from "./pages/VendorCarDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVendorDetails from "./pages/AdminVendorDetails";
import AdminClientDetails from "./pages/AdminClientDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import More from "./pages/More";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import BookingsList from "./components/dashboard/BookingsList";
import FavoritesList from "./components/dashboard/FavoritesList";
import PaymentsList from "./components/dashboard/PaymentsList";
import ProfileSection from "./components/dashboard/ProfileSection";
import SupportSection from "./components/dashboard/SupportSection";
import ClientLayout from "./components/layout/ClientLayout";
import PageLayout from "./components/layout/PageLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <FavoritesProvider>
                <Routes>
                  {/* Default pages with PageLayout */}
                  <Route
                    element={
                      <PageLayout>
                        <></>
                      </PageLayout>
                    }
                  >
                    <Route path="/" element={<Index />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/cars/:id" element={<CarDetails />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/vendors/:id" element={<VendorDetails />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/offers/:id" element={<OfferDetails />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetails />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/more" element={<More />} />
                  </Route>

                  {/* Auth pages without PageLayout */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Dashboard pages (already have layouts) */}
                  <Route path="/dashboard" element={<ClientLayout />}>
                    <Route index element={<BookingsList />} />
                    <Route path="bookings" element={<BookingsList />} />
                    <Route path="favorites" element={<FavoritesList />} />
                    <Route path="payments" element={<PaymentsList />} />
                    <Route path="profile" element={<ProfileSection />} />
                    <Route path="support" element={<SupportSection />} />
                  </Route>

                  <Route path="/favorites" element={<Favorites />} />
                  <Route
                    path="/vendor-dashboard"
                    element={<VendorDashboard />}
                  />
                  <Route
                    path="/vendor-dashboard/cars/:id"
                    element={<VendorCarDetails />}
                  />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/admin/vendors/:id"
                    element={<AdminVendorDetails />}
                  />
                  <Route
                    path="/admin/clients/:id"
                    element={<AdminClientDetails />}
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </FavoritesProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
