import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import UserMenu from "./UserMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/layout/navbar/LanguageSwitcher";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(t("logoutSuccess"));
      // signOut already handles navigation to "/" - no need for manual navigation or reload
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("logoutError"));
    }
  };

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("cars"), href: "/cars" },
    { name: t("vendors"), href: "/vendors" },
    { name: t("offers"), href: "/offers" },
    { name: t("contact"), href: "/contact" },
    { name: t("about"), href: "/about" },
  ];

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavbarLogo />

          <div className="hidden md:block">
            <NavbarLinks navigation={navigation} isRTL={isRTL} />
          </div>

          <div className="hidden md:block">
            <div
              className={`flex items-center gap-4 ${
                isRTL ? "gap-reverse" : ""
              }`}
            >
              <LanguageSwitcher />
              {!user ? (
                <>
                  <a
                    href="/signin"
                    className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm"
                  >
                    {t("signIn")}
                  </a>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-lg text-sm"
                  >
                    {t("signUp")}
                  </a>
                </>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        user?.data?.profilePicture
                      }`}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  </button>
                  {showUserMenu && (
                    <UserMenu isRTL={isRTL} onLogout={handleLogout} t={t} />
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className={`md:hidden flex items-center gap-3 ${
              isRTL ? "gap-reverse" : ""
            }`}
          >
            <LanguageSwitcher />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              type="button"
              className="p-2 bg-gray-100 rounded-lg"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <NavbarMobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navigation={navigation}
        isRTL={isRTL}
        user={user}
        onLogout={handleLogout}
        t={t}
        location={location}
      />
    </nav>
  );
};

export default Navbar;
