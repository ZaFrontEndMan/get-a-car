import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const NavbarLogo = () => (
  <Link to="/" className="flex items-center gap-2 ">
    <div className="bg-gradient-to-br from-primary via-secondary to-accent p-2 rounded-xl  shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
      <Car className="h-5 w-5 text-white" />
    </div>
    <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-300">
      Get Car
    </span>
  </Link>
);

export default NavbarLogo;
