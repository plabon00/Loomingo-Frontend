"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Receipt, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InvoiceIntroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".gsap-invoice-badge",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        ".gsap-invoice-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-invoice-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-invoice-list li",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-invoice-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-invoice-image",
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-24 sm:py-32 relative overflow-hidden bg-zinc-950 text-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)" }} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="gsap-invoice-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 text-xs font-bold tracking-wide uppercase mb-6 border border-violet-500/20 shadow-sm">
            <Receipt className="size-3.5" />
            Professional Invoicing
          </div>
          
          <h2 className="gsap-invoice-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Get paid faster with <span className="text-zinc-500 font-editorial font-normal italic">beautiful invoices.</span>
          </h2>
          
          <p className="gsap-invoice-desc text-lg text-zinc-400 mb-6 max-w-xl mx-auto lg:mx-0">
            Generate stunning PDF invoices in seconds. Keep track of your billing, impress your clients, and organize your revenue—all in one place.
          </p>
          
          <ul className="gsap-invoice-list text-zinc-300 space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
            <li className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <CheckCircle2 className="size-4 text-violet-400 shrink-0" /> One-click PDF generation
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <CheckCircle2 className="size-4 text-violet-400 shrink-0" /> Custom branding & logos
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <CheckCircle2 className="size-4 text-violet-400 shrink-0" /> Automated calculations
            </li>
          </ul>

          <div className="gsap-invoice-btn flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/apps/invoice-generator"
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-colors active:scale-95 shadow-xl shadow-white/5 w-full sm:w-auto"
            >
              Generate Invoice
            </Link>
          </div>
        </div>

        {/* Image/Mockup */}
        <div className="flex-1 w-full max-w-md lg:max-w-none perspective-[2000px]">
          <div className="gsap-invoice-image relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-zinc-800 bg-zinc-900 transform lg:rotate-y-[12deg] lg:rotate-x-[5deg]">
            <div className="aspect-[3/4] relative p-6 bg-zinc-900">
              {/* Mockup UI representation */}
              <div className="absolute inset-4 bg-white rounded-xl shadow-sm flex flex-col p-6 border border-zinc-200">
                <div className="flex justify-between items-start border-b border-zinc-100 pb-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-16 bg-zinc-900 rounded-sm" />
                    <div className="h-2 w-24 bg-zinc-200 rounded-sm" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-6 w-24 bg-zinc-100 rounded-md" />
                    <div className="h-2 w-16 bg-zinc-200 rounded-sm" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                    <div className="h-2 w-32 bg-zinc-300 rounded-sm" />
                    <div className="h-2 w-12 bg-zinc-800 rounded-sm" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                    <div className="h-2 w-24 bg-zinc-200 rounded-sm" />
                    <div className="h-2 w-12 bg-zinc-800 rounded-sm" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                    <div className="h-2 w-28 bg-zinc-200 rounded-sm" />
                    <div className="h-2 w-12 bg-zinc-800 rounded-sm" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-zinc-200">
                  <div className="h-8 w-24 bg-violet-100 rounded-lg" />
                  <div className="flex flex-col items-end gap-1">
                    <div className="h-2 w-16 bg-zinc-400 rounded-sm" />
                    <div className="h-5 w-24 bg-zinc-900 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
