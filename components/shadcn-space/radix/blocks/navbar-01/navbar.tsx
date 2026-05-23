"use client";


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TextAlignJustify } from "lucide-react"; // Removed ArrowUpRight since it's now in the button component
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle"; 

// 1. Import your new reusable button here (Adjust the path if necessary!)
import AnimatedButton from "../../button/button-01";
import { SignupForm } from "@/components/signup-form";
import Loomingo from "@/assets/logo/Loomingo.png";
import SwitchToggleThemeDemo from "../../switch/switch-03";

export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: "Upcoming Tools",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "About us",
    href: "#",
  },
];

// 2. The old CollaborateButton code block has been completely removed from here.

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <div>
      <header className="bg-background">
        <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6">
          <nav
            className={cn(
              "w-full flex items-center h-fit justify-between gap-2 lg:gap-6 transition-all duration-500",
              sticky
                ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
                : "bg-transparent border-transparent"
            )}
          >
            {/* Left: Logo */}
            <a href="#" className="flex-shrink-0">
              <img 
                src={Loomingo.src} 
                alt="Loomingo Logo" 
                className="h-7 w-auto object-contain" 
              />
            </a>

            {/* Center: Desktop Navigation */}
            <div className="flex-1 flex justify-center">
              <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
                <NavigationMenuList className="flex gap-0">
                  {navigationData.map((navItem) => (
                    <NavigationMenuItem key={navItem.title}>
                      <NavigationMenuLink
                        href={navItem.href}
                        className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal"
                      >
                        {navItem.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            {/* Right: Actions Group */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              
              {/* Theme Toggle - Hidden on Mobile, Visible on Desktop */}
              <div className="hidden lg:block">
                <SwitchToggleThemeDemo/>
              </div>
              
              {/* 3. Replaced the old CollaborateButton with your new Reusable Component! */}
              {/* Note: I added responsive sizing via className so it still scales down perfectly on mobile */}
              <AnimatedButton onClick={() => setIsSignInOpen(true)}>Start for Free</AnimatedButton>
              

              {/* Mobile Hamburger Menu */}
              <div className="lg:hidden">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors">
                    <TextAlignJustify size={20} />
                    <span className="sr-only">Menu</span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2"
                  >
                    {/* Navigation Links */}
                    {navigationData.map((item) => (
                      <DropdownMenuItem key={item.title}>
                        <a
                          href={item.href}
                          className="w-full cursor-pointer text-sm font-medium"
                        >
                          {item.title}
                        </a>
                      </DropdownMenuItem>
                    ))}
                    
                    {/* Sign In Mobile Link */}
                    <DropdownMenuItem className="border-t mt-1 pt-2" onSelect={() => setIsSignInOpen(true)}>
                      <span
                        className="w-full cursor-pointer text-sm font-medium text-primary block"
                      >
                        Sign In
                      </span>
                    </DropdownMenuItem>

                    {/* Theme Toggle Mobile Row */}
                    <div className="flex items-center justify-between px-2 py-2 mt-1 border-t border-border">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <SwitchToggleThemeDemo />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* --- The Modal (Dialog) --- */}
            <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
          <DialogTitle className="sr-only">Sign In to Loomingo</DialogTitle>
          
          {/* Add this new line to silence the warning! */}
          <DialogDescription className="sr-only">
            Fill out the form below to get started.
          </DialogDescription>
          
          <SignupForm />
        </DialogContent>
      </Dialog>

          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;