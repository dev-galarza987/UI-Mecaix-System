import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const modules = [
  { name: "Dashboard", path: "/home" },
  { name: "Clients", path: "/clients" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Services", path: "/services" },
  { name: "Mechanics", path: "/mechanics" },
  { name: "Reservations", path: "/reservates" },
];

export function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {modules.map((module) => (
          <NavigationMenuItem key={module.name}>
            <NavigationMenuLink asChild>
              <Link to={module.path} className={navigationMenuTriggerStyle()}>
                {module.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
