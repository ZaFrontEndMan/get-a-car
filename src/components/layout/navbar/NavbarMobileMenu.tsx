import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

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
}: NavbarMobileMenuProps) => (
  <div
    id="mobile-menu"
    className={`md:hidden fixed left-0 right-0 top-16 transition-all duration-300 ease-in-out z-40 ${
      isOpen
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }`}
  >
    <div className="bg-white shadow-xl border-t border-gray-200">
      <div className="px-4 pt-4 pb-3 space-y-2 max-h-screen overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift ${
              location.pathname === item.href
                ? "text-white bg-gradient-to-r from-primary to-secondary shadow-md"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            } ${isRTL ? "text-right" : "text-left"}`}
            aria-current={location.pathname === item.href ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-4 pb-6 border-t border-gray-200/50">
        <div className="px-4">
          {!user ? (
            <div className="flex flex-col space-y-3">
              <Link
                to="/signin"
                className="text-center text-gray-700 hover:text-primary bg-transparent hover:bg-gray-50 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift border border-gray-200 hover:border-primary/20"
                onClick={() => setIsOpen(false)}
              >
                {t("signIn")}
              </Link>
              <Link
                to="/signup"
                className="text-center bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-accent px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover-lift shadow-md hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                {t("signUp")}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary rounded-lg transition-all duration-300 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <User
                  className={`h-5 w-5 text-primary ${isRTL ? "ml-3" : "mr-3"}`}
                />
                <span>{t("profile")}</span>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <LogOut className={`h-5 w-5 ${isRTL ? "ml-3" : "mr-3"}`} />
                <span>{t("signOut")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default NavbarMobileMenu;
