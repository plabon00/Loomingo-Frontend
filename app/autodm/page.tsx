import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";
import AutoDMManager from "@/components/features/autodm/AutoDMManager";
import FooterSection from "@/components/layout/dashboard-footer";

export default function AutoDMPage() {
  return (
    <div className="font-apple w-full relative min-h-screen pt-[calc(3.5rem+var(--promo-h,0px))] md:pt-[calc(3rem+var(--promo-h,0px))] pb-20 md:pb-0 flex flex-col bg-white overflow-x-hidden text-[var(--apple-ink)]">
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />
      <div className="flex-1">
        <AutoDMManager />
      </div>
      <FooterSection />
    </div>
  );
}
