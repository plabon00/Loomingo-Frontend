"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Store, 
  ShoppingBag, 
  ShoppingCart, 
  Tag, 
  CreditCard, 
  Layout, 
  Grid,
  BarChart,
  Percent,
  Smartphone,
  Globe,
  Settings
} from "lucide-react";

const integrations = [
  { icon: ShoppingBag, bg: "bg-blue-500/10", text: "text-blue-500" },
  { icon: ShoppingCart, bg: "bg-orange-500/10", text: "text-orange-500" },
  { icon: Tag, bg: "bg-pink-500/10", text: "text-pink-500" },
  { icon: CreditCard, bg: "bg-indigo-500/10", text: "text-indigo-500" },
  { icon: Layout, bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { icon: Grid, bg: "bg-rose-500/10", text: "text-rose-500" },
  { icon: Percent, bg: "bg-amber-500/10", text: "text-amber-500" },
  { icon: Store, bg: "bg-zinc-500/10", text: "text-zinc-400" },
];

const features = [
  {
    icon: Layout,
    title: "Beautiful Templates",
    desc: "Choose from dozens of high-converting, mobile-optimized storefront templates.",
  },
  {
    icon: ShoppingCart,
    title: "Frictionless Checkout",
    desc: "Reduce cart abandonment with a seamless, one-click checkout experience.",
  },
  {
    icon: Tag,
    title: "Dynamic Pricing",
    desc: "Set up discounts, bundles, and dynamic pricing rules in seconds.",
  },
  {
    icon: CreditCard,
    title: "Global Payments",
    desc: "Accept credit cards, Apple Pay, and local payment methods worldwide.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Your store looks and functions perfectly on any device, right inside Instagram.",
  },
  {
    icon: BarChart,
    title: "Sales Analytics",
    desc: "Track visitors, conversion rates, and total revenue in real-time.",
  },
];

export default function StoreFrontFeatureSection() {
  return (
    <section className="relative w-full py-6 lg:py-8 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-12 lg:py-16 rounded-[40px] overflow-hidden border border-white/20 flex flex-col items-center">
          {/* TOP HALF: Hero (Side by Side) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* LEFT: Floating Icons (Visual) */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center min-h-[300px]">
            {/* Subtle faint grid background for the integration icons */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-[0.08] z-0"
              style={{ 
                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
                backgroundSize: '80px 80px',
                maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 80%)'
              }}
            />

            {/* Masonry/Staggered 3-column grid of icons */}
            <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-6 scale-90 md:scale-100 items-center">
              {integrations.slice(0, 7).map((integration, idx) => {
                const Icon = integration.icon;
                
                // Stagger columns: middle column translates down
                const isMiddleColumn = idx % 3 === 1;
                const translateY = isMiddleColumn ? 'translate-y-6' : '';

                return (
                  <div key={idx} className={`${translateY} flex items-center justify-center size-14 md:size-16 rounded-2xl bg-white/[0.02] border border-white/5 shadow-lg hover:scale-110 transition-transform backdrop-blur-md`}>
                    <Icon className={`w-7 h-7 ${integration.text}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Text Content */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs md:text-sm font-medium mb-6">
              Digital Store Front
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.15]">
              Sell seamlessly, right where your audience lives
            </h2>
            
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Launch a beautifully branded storefront directly linked to your Instagram. Turn engaged followers into paying customers without ever forcing them to leave the app.
            </p>

            <button className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-600/20">
              Build Your Store
            </button>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
