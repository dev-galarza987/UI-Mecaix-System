import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/home">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm33.43,150.58a8,8,0,0,1-10.86,10.86L128,162.85l-22.57,22.59a8,8,0,0,1-10.86-10.86L117.15,152l-22.59-22.57a8,8,0,0,1,10.86-10.86L128,141.15l22.57-22.59a8,8,0,0,1,10.86,10.86L138.85,152Z"></path>
              </svg>
              <span className="hidden font-bold sm:inline-block">Mecanix UI</span>
            </a>
          </div>
          <div className="flex-1">
            <Navbar />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}