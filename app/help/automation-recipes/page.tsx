'use client';

import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import OtherPagesFooter from '@/components/other-pages-footer';
// CHANGE THIS IMPORT FOR EACH PAGE
import AutomationRecipesSection from '@/components/help/AutomationRecipesSection'; 

export default function HelpArticlePage() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-red-950 overflow-x-hidden text-white/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0 pointer-events-none fixed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-20 z-0 pointer-events-none fixed"></div>

      <Navbar />
      
      <div className="relative z-10 flex-1 flex flex-col mt-nav-mobile md:pt-10 lg:pt-10 pb-24 px-4 sm:px-6">
        {/* CHANGE THIS COMPONENT FOR EACH PAGE */}
        <AutomationRecipesSection />
      </div>

      <footer className="relative z-20 mt-auto">
        <OtherPagesFooter />
      </footer>
    </main>
  );
}