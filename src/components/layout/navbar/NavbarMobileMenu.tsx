import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  navigation: { name: string; href: string }[];
  isRTL: boolean;
  user: any;
  onLogout: () => void;
  t: (key: string) => string;
  location: any;
}

const NavbarMobileMenu = ({
  isOpen,
  setIsOpen,
  navigation,
  isRTL,
  user,
  onLogout,
  t,
  location,
}: NavbarMobileMenuProps) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      id="mobile-menu"
      className={`md:hidden fixed left-0 right-0 top-16 z-40 ${
        isOpen ? "" : "pointer-events-none"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="bg-white shadow-xl border-t border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        {/* Logo Section */}
        <motion.div
          className="px-4 pt-4 pb-2 border-b border-gray-100"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div>
              <p className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GetCar
              </p>
              <p className="text-xs text-gray-500">Premium Rides</p>
            </div>
          </div>
        </motion.div>

        <div className="px-4 pt-4 pb-3 space-y-2 max-h-screen overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
          >
            {navigation.map((item, index) => (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    location.pathname === item.href
                      ? "text-white bg-gradient-to-r from-primary to-secondary shadow-md"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  } ${isRTL ? "text-right" : "text-left"}`}
                  aria-current={
                    location.pathname === item.href ? "page" : undefined
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="pt-4 pb-6 border-t border-gray-200/50"
          variants={itemVariants}
        >
          <div className="px-4">
            {!user ? (
              <motion.div
                className="flex flex-col space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/signin"
                    className="block text-center text-gray-700 hover:text-primary bg-transparent hover:bg-gray-50 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 border border-gray-200 hover:border-primary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("signIn")}
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/signup"
                    className="block text-center bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-accent px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("signUp")}
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
              >
                <motion.div variants={itemVariants} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary rounded-lg transition-all duration-300 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User
                      className={`h-5 w-5 text-primary ${
                        isRTL ? "ml-3" : "mr-3"
                      }`}
                    />
                    <span>{t("profile")}</span>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className={`h-5 w-5 ${isRTL ? "ml-3" : "mr-3"}`} />
                  <span>{t("signOut")}</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NavbarMobileMenu;
