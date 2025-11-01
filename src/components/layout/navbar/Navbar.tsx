import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";

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

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <motion.nav
      className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 fixed w-full top-0 z-50 transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <NavbarLogo />
          </motion.div>

          <motion.div
            className="hidden md:block"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <NavbarLinks navigation={navigation} isRTL={isRTL} />
          </motion.div>

          <motion.div
            className="hidden md:block"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <div
              className={`flex items-center gap-4 ${
                isRTL ? "gap-reverse" : ""
              }`}
            >
              <motion.div variants={itemVariants}>
                <LanguageSwitcher />
              </motion.div>
              {!user ? (
                <>
                  <motion.a
                    href="/signin"
                    className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("signIn")}
                  </motion.a>
                  <motion.a
                    href="/signup"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-lg text-sm"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("signUp")}
                  </motion.a>
                </>
              ) : (
                <motion.div
                  className="relative"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.img
                      src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                        user?.data?.profilePicture
                      }`}
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 hover:border-primary"
                      whileHover={{ borderColor: "rgba(var(--primary), 1)" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10"
                      animate={{ scale: showUserMenu ? 1.2 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  {showUserMenu && (
                    <UserMenu isRTL={isRTL} onLogout={handleLogout} t={t} />
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className={`md:hidden flex items-center gap-3 ${
              isRTL ? "gap-reverse" : ""
            }`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={itemVariants}>
              <LanguageSwitcher />
            </motion.div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              type="button"
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              variants={itemVariants}
              whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </motion.div>
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
    </motion.nav>
  );
};

export default Navbar;
