import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";
import AutoDMManager from "@/components/features/autodm/AutoDMManager";

export default function AutoDMPage() {
  return (
    <div className="w-full relative bg-white min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans">
      <MobileNavbar />
      <DesktopSidebar/>
      <BottomDock />
      <AutoDMManager />
    </div>
  );
}