import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuLink } from "../ui/navigation-menu";

const Navbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuLink asChild>
        <Link to="/">Home</Link>
      </NavigationMenuLink>

      <NavigationMenuLink asChild>
        <Link to="/login">Login</Link>
      </NavigationMenuLink>
    </NavigationMenu>
  );
};

export default Navbar;
