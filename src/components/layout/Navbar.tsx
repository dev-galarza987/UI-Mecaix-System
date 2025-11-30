import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const modules = [
  { name: "Dashboard", path: "/home" },
  { name: "Clientes", path: "/clients" },
  { name: "Vehículos", path: "/vehicles" },
  { name: "Servicios", path: "/services" },
  { name: "Mecánicos", path: "/mechanics" },
  { name: "Reservas", path: "/reservates" },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      {/* Desktop Menu */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {modules.map((module) => (
              <NavigationMenuItem key={module.name}>
                <NavigationMenuLink asChild>
                  <Link
                    to={module.path}
                    className={`${navigationMenuTriggerStyle()} ${
                      location.pathname.startsWith(module.path)
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {module.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {modules.map((module) => (
                <Link
                  key={module.name}
                  to={module.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-1 text-lg font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith(module.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {module.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
