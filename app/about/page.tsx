"use client";

import Navbar from "@/components/shadcn-space/radix/blocks/navbar-01/navbar";
import AboutSection from "@/components/sections/about/AboutSection";

import Link from "next/link";
import OtherPagesFooter from "@/components/layout/other-pages-footer";

export default function AboutPage() {
  const footerLinks = {
    Product: [
      { title: "DM Automation", href: "#", disabled: false },
      { title: "Follow Gate Links", href: "#", disabled: false },
      {
        title: "Lead Capture Forms",
        href: "#",
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "AI Sales Assistant",
        href: "#",
        disabled: true,
        badge: "Coming Soon",
      },
      {
        title: "Advanced Analytics",
        href: "#",
        disabled: true,
        badge: "Coming Soon",
      },
    ],
    Company: [
      { title: "About Us", href: "/about", disabled: false },
      { title: "Pricing", href: "#", disabled: false },
      { title: "Help Center", href: "#", disabled: false },
      { title: "Careers", href: "#", disabled: true, badge: "Hiring" },
    ],
    Legal: [
      { title: "Privacy Policy", href: "/privacy-policy", disabled: false },
      { title: "Terms & Conditions", href: "/terms", disabled: false },
      { title: "Cookie Policy", href: "#", disabled: false },
    ],
  };
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-red-950 overflow-hidden">
      {/* Deep Red Radial Gradient Background (From Hero Section) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0 pointer-events-none"></div>

      {/* Extra center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-40 z-0 pointer-events-none"></div>

      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col pt-24 md:pt-32">
        <AboutSection />
      </div>

      {/* Footer finishes the page */}
      <footer>
        <OtherPagesFooter />
      </footer>
    </main>
  );
}
