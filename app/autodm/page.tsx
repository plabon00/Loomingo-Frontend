import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";
import AutoDMManager from "@/components/features/autodm/AutoDMManager";
import { Footer } from "@/components/layout/Footer";

export default function AutoDMPage() {
  return (
    <div className="w-full relative min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans flex flex-col bg-white overflow-hidden">
      {/* Graph paper style major/minor grid background with faded corners */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(156, 163, 175, 0.20) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.20) 1px, transparent 1px),
              linear-gradient(to right, rgba(156, 163, 175, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)'
          }}
        ></div>
      </div>
      <MobileNavbar />
      <DesktopSidebar/>
      <BottomDock />
      <div className="flex-1">
        <AutoDMManager />
      </div>
      <Footer />
    </div>
  );
}