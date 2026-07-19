"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StoreShowcaseSection() {
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
      ".gsap-store-badge",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        ".gsap-store-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-store-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-store-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".gsap-store-image",
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-24 sm:py-32 relative overflow-hidden bg-[#faf7f2]">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(220, 38, 38, 0.03) 0%, transparent 50%)" }} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="gsap-store-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold tracking-wide uppercase mb-6 border border-red-200 shadow-sm">
            <Sparkles className="size-3.5" />
            Your Digital Storefront
          </div>
          
          <h2 className="gsap-store-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-6">
            Sell digital products <span className="text-zinc-400 font-editorial font-normal italic">effortlessly.</span>
          </h2>
          
          <p className="gsap-store-desc text-lg text-zinc-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Set up your premium storefront in minutes. Upload files, set your price, and start selling directly to your audience without the marketplace fees.
          </p>
          
          <div className="gsap-store-btn flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/store"
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full sm:w-auto"
            >
              <ShoppingBag className="size-5" />
              Build Your Store
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-50 transition-colors border border-zinc-200 active:scale-95 w-full sm:w-auto shadow-sm"
            >
              View Example <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Image/Mockup */}
        <div className="flex-1 w-full max-w-md lg:max-w-none perspective-[2000px]">
          <div className="gsap-store-image relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-200/60 bg-white transform lg:rotate-y-[-12deg] lg:rotate-x-[5deg]">
            <div className="aspect-[4/3] relative p-6 bg-zinc-50">
              {/* Mockup UI representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-zinc-50 p-6 flex flex-col gap-5">
                <div className="w-full h-1/2 bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden relative">
                   <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-sm flex items-center gap-4 border border-zinc-100">
                      <div className="size-12 bg-zinc-100 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <div className="h-3 w-1/2 bg-zinc-200 rounded-full mb-2" />
                        <div className="h-2 w-1/3 bg-zinc-100 rounded-full" />
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-5 flex-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3"><div className="size-6 rounded-full bg-zinc-100" /></div>
                    <div className="h-2 w-2/3 bg-zinc-100 rounded-full mb-2" />
                    <div className="h-3 w-1/3 bg-zinc-800 rounded-full" />
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3"><div className="size-6 rounded-full bg-zinc-100" /></div>
                    <div className="h-2 w-2/3 bg-zinc-100 rounded-full mb-2" />
                    <div className="h-3 w-1/3 bg-zinc-800 rounded-full" />
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
