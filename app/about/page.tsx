"use client";

import Navbar from "@/components/shadcn-space/radix/blocks/navbar-01/navbar";
import AboutSection from "@/components/sections/about/AboutSection";
import OtherPagesFooter from "@/components/layout/other-pages-footer";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { useAuthUser } from "@/hooks/use-auth-user";

export default function AboutPage() {
  const { user, isLoading } = useAuthUser();

  // Logged-in users keep the app shell (bottom dock / sidebar) so they can jump
  // straight back to a feature instead of landing on the marketing homepage.
  const inApp = !isLoading && !!user;

  return (
    <main
      className={`relative flex flex-col min-h-screen w-full bg-red-950 overflow-hidden ${
        inApp ? "pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64" : ""
      }`}
    >
      {/* Deep Red Radial Gradient Background (From Hero Section) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0 pointer-events-none"></div>

      {/* Extra center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-40 z-0 pointer-events-none"></div>

      {inApp ? (
        <>
          <MobileNavbar />
          <DesktopSidebar />
          <BottomDock />
        </>
      ) : (
        /* Marketing navbar for logged-out visitors */
        <Navbar />
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 flex-1 flex flex-col ${inApp ? "pt-8 md:pt-16" : "pt-24 md:pt-32"}`}>
        <AboutSection />
      </div>

      {/* Footer finishes the page (marketing visitors only; app users have the dock) */}
      {!inApp && (
        <footer>
          <OtherPagesFooter />
        </footer>
      )}
    </main>
  );
}
