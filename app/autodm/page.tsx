import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";
import AutoDMManager from "@/components/features/autodm/AutoDMManager";
import { Footer } from "@/components/layout/Footer";

export default function AutoDMPage() {
  return (
    <div className="w-full relative bg-white min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans flex flex-col">
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