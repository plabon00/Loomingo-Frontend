"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Waves, Shuffle, Zap, Clock } from "lucide-react";

import DashboardContent from "@/components/sections/dashboard/DashboardContent";
import GettingStartedGuide from "@/components/sections/dashboard/TutorialCard";
import HowItWorks from "@/components/ui/how-it-work";
import UpcomingFeatures from "@/components/sections/marketing/upcoming-features";
import { TransitionLink } from "@/components/ui/transition-link";

import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/layout/AppNavigation";

import FooterSection from "@/components/layout/dashboard-footer";
import LineSidebar from "@/components/LineSidebar";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const workspaceApps = [
  {
    href: "/store",
    title: "Storefront",
    accent: "Sell digital products",
    description:
      "Upload files, set prices, customize your brand, and start earning from your audience.",
  },
  {
    href: "/apps/invoice-generator",
    title: "Invoice Studio",
    accent: "Get paid faster",
    description:
      "Generate branded PDF invoices in seconds with auto calculations and one-click export.",
  },
];

const sectionIndex = [
  { id: "band-overview", label: "Overview" },
  { id: "band-workspace", label: "Workspace" },
  { id: "band-trust", label: "Trust" },
  { id: "band-quickstart", label: "Quick start" },
  { id: "band-flow", label: "The flow" },
  { id: "band-roadmap", label: "Roadmap" },
];

const trustPoints = [
  {
    title: "Flood Control",
    value: "Smart throttle",
    description:
      "Messages go out at natural intervals, never fast enough to trip Instagram's radar.",
    icon: Waves,
  },
  {
    title: "Human-like Timing",
    value: "Randomized",
    description: "Every reply has a different delay. No robotic patterns, ever.",
    icon: Shuffle,
  },
  {
    title: "Instant Replies",
    value: "< 30s",
    description: "Comments get answered in seconds, not hours.",
    icon: Zap,
  },
  {
    title: "Never Sleeps",
    value: "24 / 7",
    description: "Runs while you sleep, eat, and create.",
    icon: Clock,
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Scroll-spy: highlight the rail item for the band nearest the viewport center.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = sectionIndex.findIndex((sec) => sec.id === entry.target.id);
            if (i !== -1) setActiveSection(i);
          }
        }
      },
      // Band counts as "current" when it crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sectionIndex.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".gsap-dash-header",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
        );

        gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                // Recompute start on refresh; if already in view, reveal immediately.
                invalidateOnRefresh: true,
                once: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: group,
                start: "top 90%",
                invalidateOnRefresh: true,
                once: true,
              },
            }
          );
        });

        const stat = document.querySelector<HTMLElement>("[data-count]");
        if (stat) {
          const count = { v: 12 };
          gsap.to(count, {
            v: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: stat, start: "top 90%", invalidateOnRefresh: true, once: true },
            onUpdate: () => {
              stat.textContent = Math.round(count.v).toString();
            },
          });
        }

        // The dashboard grid loads async (skeleton → real content) and changes page
        // height AFTER ScrollTrigger measured its start points, which can leave lower
        // sections stuck at opacity:0. Refresh so positions recompute against final height.
        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // Async dashboard content + images settle after first paint and grow the page.
  // Refresh ScrollTrigger on those events so no reveal section is left invisible.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [250, 800, 1600].map((ms) => window.setTimeout(refresh, ms));
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="font-apple w-full relative flex flex-col bg-white min-h-screen pt-[calc(3.5rem+var(--promo-h,0px))] md:pt-[calc(3rem+var(--promo-h,0px))] pb-20 md:pb-0 overflow-x-hidden text-[var(--apple-ink)]"
    >
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* Section index rail — proximity-reactive, desktop only */}
      <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
        <LineSidebar
          items={sectionIndex.map((s) => s.label)}
          accentColor="#0066cc"
          textColor="#6e6e73"
          markerColor="#d2d2d7"
          markerLength={28}
          maxShift={14}
          proximityRadius={80}
          itemGap={14}
          fontSize={0.8}
          showIndex={false}
          activeIndex={activeSection}
          onItemClick={(i: number) => document.getElementById(sectionIndex[i].id)?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      {/* ━━━━ BAND 1 · HEADER + LIVE DASHBOARD (white) ━━━━ */}
      <section id="band-overview" className="w-full bg-white scroll-mt-24">
        <div className="gsap-dash-header w-full max-w-5xl mx-auto px-6">
          <DashboardContent />
        </div>
      </section>

      {/* ━━━━ BAND 2 · WORKSPACE (alt surface) ━━━━ */}
      <section id="band-workspace" className="w-full bg-[var(--apple-surface-alt)] py-20 md:py-28 scroll-mt-24">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="gsap-reveal text-center mb-14 md:mb-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-3">
              Your apps
            </p>
            <h2 className="apple-display text-[34px] md:text-[48px]">Workspace</h2>
            <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] mt-4 max-w-xl mx-auto">
              Two tools live today. More on the way.
            </p>
          </div>

          <div data-stagger className="divide-y divide-[var(--apple-hairline)] border-y border-[var(--apple-hairline)]">
            {workspaceApps.map((app) => (
              <TransitionLink
                key={app.href}
                href={app.href}
                className="group flex items-center justify-between gap-6 py-8 md:py-10 transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-4 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-blue)] mb-2">
                    {app.accent}
                  </p>
                  <h3 className="apple-display text-[28px] md:text-[40px]">
                    {app.title}
                  </h3>
                  <p className="text-[17px] leading-relaxed text-[var(--apple-gray)] max-w-lg mt-2">
                    {app.description}
                  </p>
                </div>
                <span className="apple-link inline-flex items-center gap-1 text-[17px] shrink-0 whitespace-nowrap">
                  Open
                  <ChevronRight className="size-4 transition-transform duration-[240ms] group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </TransitionLink>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━ BAND 3 · TRUST & SAFETY (white) ━━━━ */}
      <section id="band-trust" className="w-full bg-white py-20 md:py-28 scroll-mt-24">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="gsap-reveal text-center max-w-2xl mx-auto">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-3">
              Trust &amp; safety
            </p>
            <h2 className="apple-display text-[40px] md:text-[64px]">
              <span data-count>0</span> bans. Ever.
            </h2>
            <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] mt-5">
              We use Instagram&apos;s official Graph API. No scraping, no unauthorized
              access, no risk. Other tools get flagged — we don&apos;t.
            </p>
          </div>

          <div
            data-stagger
            className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            {trustPoints.map((p) => (
              <div key={p.title} className="flex flex-col">
                <p.icon className="size-7 text-[var(--apple-ink)] mb-5" aria-hidden="true" />
                <span className="apple-display text-[28px]">{p.value}</span>
                <span className="text-[17px] font-semibold text-[var(--apple-ink)] mt-3">
                  {p.title}
                </span>
                <span className="text-[14px] leading-relaxed text-[var(--apple-gray)] mt-1.5">
                  {p.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━ BAND 4 · QUICK START (alt surface) ━━━━ */}
      <section id="band-quickstart" className="w-full bg-[var(--apple-surface-alt)] py-20 md:py-28 scroll-mt-24">
        <div className="gsap-reveal">
          <GettingStartedGuide />
        </div>
      </section>

      {/* ━━━━ BAND 5 · THE FLOW (white) ━━━━ */}
      <section id="band-flow" className="w-full bg-white py-20 md:py-28 scroll-mt-24">
        <div className="gsap-reveal">
          <HowItWorks />
        </div>
      </section>

      {/* ━━━━ BAND 6 · ROADMAP (alt surface) ━━━━ */}
      <section id="band-roadmap" className="w-full bg-[var(--apple-surface-alt)] py-20 md:py-28 scroll-mt-24">
        <div className="gsap-reveal">
          <UpcomingFeatures />
        </div>
      </section>

      <div className="relative z-10 w-full">
        <FooterSection />
      </div>
    </div>
  );
}
