import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

interface UserMenuProps {
  isRTL: boolean;
  onLogout: () => void;
  t: (key: string) => string;
}

const UserMenu = ({ onLogout, t }: UserMenuProps) => (
  <div className="origin-top-end absolute end-0 mt-3 w-56 rounded-xl shadow-xl bg-white/95 backdrop-blur-md ring-1 ring-black/5 border border-gray-100 animate-fade-in z-50">
    <div className="py-2">
      <Link
        to="/dashboard"
        className={`flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary transition-all duration-300 gap-2 `}
      >
        <User className={`h-4 w-4 text-primary"}`} />
        <span>{t("profile")}</span>
      </Link>
      <button
        onClick={onLogout}
        className={`w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 gap-2 `}
      >
        <LogOut className={`h-4 w-4"}`} />
        <span>{t("signOut")}</span>
      </button>
    </div>
  </div>
);

export default UserMenu;
