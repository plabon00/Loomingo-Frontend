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
import { LayoutDashboard, LogOut, Menu, UserCircle, X, Home, Info, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AnimatedButton from "../../button/button-01";
import { SignupForm } from "@/components/forms/signup-form";
import { useAuthUser } from "@/hooks/use-auth-user";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const navigationData = [
  { title: "Home", href: "/", icon: Home },
  { title: "About us", href: "/about", icon: Info },
  { title: "Help Center", href: "/help", icon: HelpCircle },
];

export default function Navbar({ forceSticky = false }: { forceSticky?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sticky = forceSticky || isScrolled;
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthUser();

  const handleScroll = useCallback(() => setIsScrolled(window.scrollY >= 50), []);
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
    <header className="fixed top-0 w-full z-[90] p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-center">
      {/* 
        The dynamic pill container.
        When sticky: shrinks to max-w-[200px], gets a shadow and a pill background.
        When not sticky: expands to max-w-6xl w-full.
      */}
      <nav
        className={cn(
          "flex items-center h-16 px-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden",
          sticky
            ? "w-full max-w-[260px] rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] justify-between"
            : "w-full max-w-6xl rounded-2xl bg-transparent border-transparent justify-between"
        )}
      >
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 z-10 transition-transform active:scale-95 group">
          <img
            src="/icon.png"
            alt="Loomingo"
            className="h-8 w-8 rounded-lg object-contain group-hover:rotate-12 transition-transform duration-300"
          />
          <span 
            className={cn(
              "font-black tracking-tight text-lg transition-colors duration-500",
              sticky ? "text-zinc-900" : "text-white"
            )}
          >
            LOOMINGO
          </span>
        </Link>

        {/* Desktop Nav - Fades out when sticky */}
        <div 
          className={cn(
            "max-lg:hidden flex absolute left-1/2 -translate-x-1/2 transition-all duration-500", 
            sticky ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100 delay-150"
          )}
        >
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className="px-5 py-2.5 text-sm font-medium rounded-full transition-colors text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions (Login/Profile) - Fades out when sticky */}
        <div 
          className={cn(
            "hidden lg:flex items-center gap-3 shrink-0 absolute right-4 transition-all duration-500", 
            sticky ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100 delay-150"
          )}
        >
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center justify-center size-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 outline-none cursor-pointer active:scale-95"
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
                  <UserCircle className="size-5 text-white" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-3xl mt-4 p-2 shadow-2xl border-zinc-200 bg-white/95 backdrop-blur-xl animate-in zoom-in-95 duration-200">
                <div className="px-4 py-3 mb-2 rounded-2xl bg-zinc-50 flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-zinc-900 truncate tracking-tight">{user.displayName || "Your account"}</p>
                  <p className="text-xs font-medium text-zinc-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={() => router.push("/home-page")} className="cursor-pointer rounded-2xl gap-3 px-4 py-3 font-medium text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900 transition-colors">
                  <LayoutDashboard className="size-4 opacity-70" /> Dashboard
                </DropdownMenuItem>
                <div className="h-px bg-zinc-100 my-1 mx-2" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-2xl gap-3 px-4 py-3 font-medium text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors">
                  <LogOut className="size-4 opacity-70" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSignInOpen(true)} 
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Log in
              </button>
              <AnimatedButton onClick={() => setIsSignInOpen(true)}>
                Start for Free
              </AnimatedButton>
            </div>
  
          )}
        </div>

        {/* 
          Hamburger Icon: 
          On Mobile (lg:hidden): Always visible, pushed to the right. 
          On Desktop (lg:flex): Only visible when sticky (dynamic island mode).
        */}
        <div
          className={cn(
            "transition-all duration-500 z-10 shrink-0",
            !sticky ? "lg:opacity-0 lg:scale-50 lg:pointer-events-none lg:absolute lg:right-4 text-white" : "opacity-100 scale-100 text-zinc-900 relative right-0"
          )}
        >
          <button 
            className="p-1.5 outline-none hover:bg-zinc-100 rounded-full transition-all active:scale-90 flex items-center justify-center group" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="size-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Authentication Modal */}
      <DialogPrimitive.Root open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-700" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[100] translate-x-[-50%] translate-y-[-50%] p-0 border-none rounded-[32px] outline-none w-full max-w-sm animate-in fade-in slide-in-from-bottom-24 zoom-in-[0.95] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <DialogPrimitive.Title className="sr-only">
              Authentication
            </DialogPrimitive.Title>

            <DialogPrimitive.Close className="absolute right-4 top-4 z-[100] rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">
              <X size={18} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <SignupForm />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Full Screen Mobile Menu Overlay */}
      <DialogPrimitive.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-xl animate-in fade-in duration-300" />
          <DialogPrimitive.Content className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 outline-none">
            <DialogPrimitive.Title className="sr-only">
              Navigation Menu
            </DialogPrimitive.Title>

            <DialogPrimitive.Close className="absolute top-6 right-6 p-3 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-all focus:outline-none hover:rotate-90 active:scale-90 duration-300">
              <X size={32} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            
            <div className="flex flex-col items-center justify-center gap-10">
              {navigationData.map((item) => (
                <Link 
                  key={item.title} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center gap-4 text-4xl font-bold tracking-tight text-white/70 hover:text-white transition-all duration-300 hover:scale-105 hover:translate-x-2"
                >
                  <item.icon className="size-8 opacity-0 -ml-12 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {item.title}
                </Link>
              ))}
              
              <div className="mt-8 border-t border-white/20 pt-10 w-64 flex flex-col items-center gap-4">
                 {user ? (
                   <>
                     <button onClick={() => { setIsMobileMenuOpen(false); router.push("/home-page"); }} className="group flex items-center gap-2 text-xl font-semibold text-white/90 hover:text-white transition-all hover:scale-105">
                       <LayoutDashboard className="size-5 group-hover:rotate-12 transition-transform duration-300" /> Dashboard
                     </button>
                     <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="group flex items-center gap-2 text-lg font-medium text-red-400 hover:text-red-300 transition-all mt-2 hover:scale-105">
                       <LogOut className="size-4 group-hover:-translate-x-1 transition-transform duration-300" /> Sign out
                     </button>
                   </>
                 ) : (
                   
                   <div className="flex flex-col items-center gap-4 w-full">
                     <button onClick={() => { setIsMobileMenuOpen(false); setIsSignInOpen(true); }} className="px-8 py-4 bg-white text-zinc-900 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl active:scale-95 w-full">
                       Start for Free
                     </button>
                     <button onClick={() => { setIsMobileMenuOpen(false); setIsSignInOpen(true); }} className="text-lg font-semibold text-white/70 hover:text-white transition-colors">
                       Log in
                     </button>
                   </div>
  
                 )}
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
}
