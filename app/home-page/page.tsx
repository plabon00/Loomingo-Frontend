"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingBag,
  ArrowRight,
  Receipt,
  Zap,
  Palette,
  TrendingUp,
  FileDown,
  Calculator,
  Layers,
} from "lucide-react";

import HowItWorks from "@/components/ui/how-it-work";
import UpcomingFeatures from "@/components/sections/marketing/upcoming-features";
import DashboardContent from "@/components/sections/dashboard/DashboardContent";
import GettingStartedGuide from "@/components/sections/dashboard/TutorialCard";

import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";

import FooterSection from "@/components/layout/footer-one";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ─── Dashboard header fade-slide ───
      gsap.fromTo(
        ".gsap-dash-header",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 }
      );

      // ─── Feature showcase cards: staggered reveal ───
      gsap.fromTo(
        ".gsap-feature-card",
        { opacity: 0, y: 32, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gsap-feature-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ─── Feature card mini-icons stagger ───
      gsap.fromTo(
        ".gsap-feature-pill",
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".gsap-feature-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ─── Guide sections: sequential reveal ───
      gsap.fromTo(
        ".gsap-guide-block",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gsap-guides-area",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ─── Pill stagger animation ───
      gsap.fromTo(
        ".gsap-pill-item",
        { opacity: 0, scale: 0.92, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".gsap-pill-row",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full relative flex flex-col items-center bg-white min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans overflow-x-hidden"
    >
      {/* ─── Ambient background glow ─── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-400 rounded-full opacity-[0.12] blur-[160px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[30%] right-0 w-[500px] h-[300px] bg-violet-400 rounded-full opacity-[0.06] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ─── Layout components ─── */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* ─── Main content ─── */}
      <div className="w-full flex flex-col items-center justify-start max-w-6xl mx-auto px-4 relative z-10">
        {/* Dashboard content (greeting + Instagram + analytics) */}
        <div className="gsap-dash-header w-full">
          <DashboardContent />
        </div>

        {/* ━━━━ FEATURE SHOWCASE ━━━━ */}
        <div className="gsap-feature-grid gsap-pill-row w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 mb-10">
          {/* ── Store Card ── */}
          <Link
            href="/store"
            className="gsap-feature-card gsap-pill-item group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-zinc-200/50 bg-white/80 backdrop-blur-sm p-6 sm:p-8 min-h-[260px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:border-zinc-300/60 transition-all duration-500"
          >
            {/* Decorative corner glow */}
            <div
              className="absolute -top-12 -right-12 size-48 rounded-full pointer-events-none opacity-60 bg-red-400/[0.08] blur-[60px]"
              aria-hidden="true"
            />

            {/* Top row: badge + feature pills */}
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="gsap-feature-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold tracking-wider uppercase border border-red-100/80">
                  <ShoppingBag className="size-3" />
                  Storefront
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300">
                    <Zap className="size-3.5" />
                  </span>
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300">
                    <Palette className="size-3.5" />
                  </span>
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300">
                    <TrendingUp className="size-3.5" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[22px] sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
                  Sell digital products{" "}
                  <span className="text-zinc-400 italic font-normal">
                    effortlessly
                  </span>
                </h3>
                <p className="text-[13px] sm:text-sm text-zinc-500 leading-relaxed max-w-sm">
                  Set up your premium storefront in minutes — upload files, set
                  prices, customize your brand, and start earning.
                </p>
              </div>
            </div>

            {/* CTA row */}
            <div className="relative z-10 mt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-semibold shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:bg-red-700 hover:shadow-[0_6px_28px_rgba(220,38,38,0.45)] transition-all duration-300">
                Open Store
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <span className="size-1.5 rounded-full bg-green-500" />
                Live
              </div>
            </div>
          </Link>

          {/* ── Invoice Card (White Glass — matching Store Card) ── */}
          <Link
            href="/apps/invoice-generator"
            className="gsap-feature-card gsap-pill-item group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-zinc-200/50 bg-white/80 backdrop-blur-sm p-6 sm:p-8 min-h-[260px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:border-zinc-300/60 transition-all duration-500"
          >
            {/* Decorative corner glow */}
            <div
              className="absolute -bottom-16 -left-16 size-56 rounded-full pointer-events-none opacity-60 bg-violet-400/[0.10] blur-[60px]"
              aria-hidden="true"
            />

            {/* Top row: badge + feature pills */}
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="gsap-feature-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-[11px] font-bold tracking-wider uppercase border border-violet-100/80">
                  <Receipt className="size-3" />
                  Invoicing
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-violet-500 group-hover:bg-violet-50 group-hover:border-violet-100 transition-all duration-300">
                    <FileDown className="size-3.5" />
                  </span>
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-violet-500 group-hover:bg-violet-50 group-hover:border-violet-100 transition-all duration-300">
                    <Calculator className="size-3.5" />
                  </span>
                  <span className="gsap-feature-pill size-8 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 flex items-center justify-center text-zinc-400 group-hover:text-violet-500 group-hover:bg-violet-50 group-hover:border-violet-100 transition-all duration-300">
                    <Layers className="size-3.5" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[22px] sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
                  Get paid faster with{" "}
                  <span className="text-zinc-400 italic font-normal">
                    beautiful invoices
                  </span>
                </h3>
                <p className="text-[13px] sm:text-sm text-zinc-500 leading-relaxed max-w-sm">
                  Generate stunning PDF invoices in seconds — custom branding,
                  auto calculations, and one-click export.
                </p>
              </div>
            </div>

            {/* CTA row */}
            <div className="relative z-10 mt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-xs font-semibold shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:bg-violet-700 hover:shadow-[0_6px_28px_rgba(139,92,246,0.45)] transition-all duration-300">
                Create Invoice
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <span className="size-1.5 rounded-full bg-violet-400" />
                PDF Ready
              </div>
            </div>
          </Link>
        </div>

        {/* ━━━━ GUIDES & ROADMAP ━━━━ */}
        <div className="gsap-guides-area w-full flex flex-col gap-8 pb-8">
          <div className="gsap-guide-block">
            <GettingStartedGuide />
          </div>
          <div className="gsap-guide-block">
            <HowItWorks />
          </div>
          <div className="gsap-guide-block">
            <UpcomingFeatures />
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}