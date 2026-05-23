"use client";

import { Lock, ShoppingBag } from "lucide-react";
// 👈 IMPORT YOUR LAYOUT COMPONENTS (Adjust paths if needed)
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/AppNavigation"; 

export default function ShopComingSoonPage() {
  return (
    // 👈 Wrap in your standard layout container
    <div className="w-full relative bg-background min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 overflow-hidden">
      
      {/* 👈 INJECT LAYOUT COMPONENTS */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* Main Content Area - Centered viewport */}
      <main className="flex flex-col items-center justify-center px-4 relative min-h-[calc(100vh-8rem)] md:min-h-screen">
        
        {/* --- DYNAMIC BACKGROUND GRADIENTS (To show through the blur) --- */}
        {/* These blobs move slightly in the background */}
        <div className="absolute top-1/4 left-1/4 size-72 bg-blue-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-72 bg-primary/20 rounded-full blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-background rounded-full blur-[64px] z-10" />

        {/* --- CENTRAL GLASS CONTAINER --- */}
        <div className="relative z-20 p-8 md:p-16 rounded-[32px] border border-border/50 bg-background/30 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center max-w-2xl w-full border-border/60">
          
          {/* Lock Icon Section */}
          <div className="p-5 bg-muted/60 border rounded-2xl mb-8 shadow-innerrelative">
            <Lock className="size-10 text-muted-foreground/80" />
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
          </div>

          {/* Subheading */}
          <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-sm tracking-widest uppercase bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
            <ShoppingBag className="size-4" />
            <span>Loomingo Store</span>
          </div>

          {/* LARGE "COMING SOON" TEXT */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6">
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Coming
            </span>
            <br />
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Soon
            </span>
          </h1>

          {/* Muted Description */}
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
            Our exclusive store for merchandise, account add-ons, and plan upgrades is currently under construction. Stay tuned for launch updates!
          </p>

          {/* Optional decorative glow line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_3px_rgba(59,130,246,0.5)]" />
        </div>

        {/* CSS for custom background animation within this page only */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          .animate-pulse {
            animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .delay-700 {
            animation-delay: 2s;
          }
        `}</style>
      </main>
    </div>
  );
}