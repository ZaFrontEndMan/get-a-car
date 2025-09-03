import { Link, useLocation } from "react-router-dom";

interface NavbarLinksProps {
  navigation: { name: string; href: string }[];
  isRTL: boolean;
}

const NavbarLinks = ({ navigation, isRTL }: NavbarLinksProps) => {
  const location = useLocation();

  return (
    <div
      className={`flex items-baseline ${
        isRTL ? "space-x-reverse" : ""
      } space-x-6`}
    >
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-lift ${
            location.pathname === item.href
              ? "text-white bg-gradient-to-r from-primary to-secondary shadow-lg"
              : "text-gray-700 hover:text-primary hover:bg-gray-50 hover:shadow-md"
          } ${isRTL ? "text-right" : "text-left"}`}
          aria-current={location.pathname === item.href ? "page" : undefined}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavbarLinks;
