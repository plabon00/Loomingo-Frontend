"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Menu, UserCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AnimatedButton from "../../button/button-01";
import { SignupForm } from "@/components/forms/signup-form";
import { useAuthUser } from "@/hooks/use-auth-user";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Import Radix UI primitives directly to gain full control over the overlay and close button
import * as DialogPrimitive from "@radix-ui/react-dialog";

const navigationData = [
  { title: "Home", href: "/" },
  { title: "About us", href: "/about" },
  { title: "Help Center", href: "/help" },
];

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthUser();

  const handleScroll = useCallback(() => setSticky(window.scrollY >= 50), []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 p-4 transition-all duration-300">
      <nav
        className={cn(
          "max-w-6xl mx-auto w-full flex items-center h-16 justify-between px-6 rounded-2xl border transition-all duration-300",
          sticky
            ? "bg-white/80 backdrop-blur-md border-zinc-200 shadow-sm"
            : "bg-transparent border-transparent",
        )}
      >
        {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="Loomingo"
              className="h-8 w-8 rounded-lg object-contain"
            />
          </Link>

        {/* Desktop Nav */}
        <div className="max-lg:hidden flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                      // DYNAMIC TEXT COLOR based on scroll state
                      sticky
                        ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100" // Scrolled down
                        : "text-white/80 hover:text-white hover:bg-white/10", // At the top
                    )}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {user ? (
            /* Logged in: profile icon with dashboard menu */
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center justify-center size-10 rounded-full border transition-colors outline-none cursor-pointer",
                  sticky
                    ? "border-zinc-200 bg-white hover:bg-zinc-50"
                    : "border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20",
                )}
                aria-label="Open profile menu"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="size-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle
                    className={cn("size-5", sticky ? "text-zinc-500" : "text-white")}
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl mt-2 p-2">
                <div className="px-2.5 py-2 mb-1 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {user.displayName || "Your account"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                </div>
                <DropdownMenuItem
                  onClick={() => router.push("/home-page")}
                  className="cursor-pointer rounded-xl gap-2 py-2.5 font-medium"
                >
                  <LayoutDashboard className="size-4 text-zinc-400" />
                  Visit Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer rounded-xl gap-2 py-2.5 font-semibold text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AnimatedButton onClick={() => setIsSignInOpen(true)}>
              Start for Free
            </AnimatedButton>
          )}

          {/* DYNAMIC HAMBURGER ICON COLOR */}
          <div
            className={cn(
              "lg:hidden transition-colors",
              sticky ? "text-zinc-900" : "text-white",
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 outline-none">
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl mt-2">
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.title} asChild className="cursor-pointer">
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Authentication Modal - Using raw primitives to remove background and custom position the X */}
      <DialogPrimitive.Root open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] p-0 border-none rounded-[2rem] shadow-2xl bg-white outline-none w-full max-w-sm">
            <DialogPrimitive.Title className="sr-only">
              Authentication
            </DialogPrimitive.Title>

            <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">
              <X size={18} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <SignupForm />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
};

export default Navbar;
