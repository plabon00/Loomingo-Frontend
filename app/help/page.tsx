'use client';

import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import HelpCenterSection from '@/components/HelpCenterSection/HelpCenterSection';
import OtherPagesFooter from '@/components/other-pages-footer';

export default function HelpPage() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-red-950 overflow-hidden">
      
      {/* Deep Red Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0 pointer-events-none fixed"></div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-20 z-0 pointer-events-none fixed"></div>

      <Navbar />
      
      <div className="relative z-10 flex-1 flex flex-col pt-24 md:pt-32">
        <HelpCenterSection />
      </div>

      <footer className="relative z-20">
        <OtherPagesFooter />
      </footer>

    </main>
  );
}