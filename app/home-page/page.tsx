import Link from "next/link";
import HowItWorks from "@/components/ui/how-it-work";
import UpcomingFeatures from "@/components/sections/marketing/upcoming-features";
import DashboardContent from "@/components/sections/dashboard/DashboardContent";
import GettingStartedGuide from "@/components/sections/dashboard/TutorialCard";

import { 
  MobileNavbar, 
  BottomDock, 
  DesktopSidebar 
} from "@/components/layout/AppNavigation"; 

import FooterSection from "@/components/layout/footer-one";

export default function HomePage() {

  return (
    <div className="w-full relative flex flex-col items-center bg-white min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans overflow-x-hidden">
      
      {/* Signature Red Glow Background */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-red-400 rounded-full opacity-[0.15] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* LAYOUT COMPONENTS */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* Main Page Content */}
      <div className="w-full flex flex-col items-center justify-start max-w-6xl mx-auto px-4 relative z-10">
        
        {/* INTERACTIVE DASHBOARD SECTION */}
        <DashboardContent />

        {/* GUIDES & ROADMAP (Tighter spacing) */}
        <div className="w-full flex flex-col gap-8 mt-2 pb-8">
          <GettingStartedGuide />
          <HowItWorks />
          <UpcomingFeatures />
        </div>

      </div>

      <FooterSection />
    </div>
  );
}