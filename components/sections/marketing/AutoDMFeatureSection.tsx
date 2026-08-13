"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Cloud, 
  MessageCircle, 
  MousePointer2, 
  Clock,
  Puzzle,
  Send,
  MessageSquare,
  Heart,
  Bell,
  Bot,
  Users,
  Zap
} from "lucide-react";

const integrations = [
  { icon: MessageCircle, bg: "bg-blue-500/10", text: "text-blue-500" },
  { icon: Zap, bg: "bg-orange-500/10", text: "text-orange-500" },
  { icon: Heart, bg: "bg-pink-500/10", text: "text-pink-500" },
  { icon: Send, bg: "bg-indigo-500/10", text: "text-indigo-500" },
  { icon: Users, bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { icon: MessageSquare, bg: "bg-rose-500/10", text: "text-rose-500" },
  { icon: Bell, bg: "bg-amber-500/10", text: "text-amber-500" },
  { icon: Bot, bg: "bg-zinc-500/10", text: "text-zinc-400" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "AI-Powered Analytics",
    desc: "Use machine learning for deeper marketing insights and real-time optimization.",
  },
  {
    icon: Cloud,
    title: "Intelligent Automation",
    desc: "Automate repetitive tasks so your team can focus on strategy.",
  },
  {
    icon: MessageCircle,
    title: "Predictive Targeting",
    desc: "Identify high-value audiences with advanced predictive modeling.",
  },
  {
    icon: MousePointer2,
    title: "Smart Personalization",
    desc: "Deliver tailored content based on user behavior and preferences.",
  },
  {
    icon: Clock,
    title: "Real-Time Insights",
    desc: "Monitor campaigns with live dashboards and instant notifications.",
  },
  {
    icon: Puzzle,
    title: "Cross-Channel Integration",
    desc: "Connect all marketing channels for unified reporting and campaigns.",
  },
];

export default function AutoDMFeatureSection() {
  return (
    <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20 flex flex-col items-center">
          {/* TOP HALF: Auto DM Hero (Side by Side) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* LEFT: Text Content */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs md:text-sm font-medium mb-6">
              Auto DM Engine
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.15]">
              Automate your DMs. <br /> Close more sales.
            </h2>
            
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Instantly reply to comments and story mentions. Turn casual followers into paying customers on complete autopilot.
            </p>

            <button className="px-6 py-2.5 text-sm md:text-base md:px-8 md:py-3.5 rounded-lg md:rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-600/20">
              Start Automating
            </button>
          </div>

          {/* RIGHT: Floating Icons */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
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

            {/* Diamond shape grid of icons */}
            <div className="relative z-10 grid grid-cols-4 gap-4 md:gap-6 scale-75 sm:scale-90 md:scale-100 mt-[-20px] md:mt-0">
              {integrations.map((integration, idx) => {
                const Icon = integration.icon;
                
                // Add col-start classes to stagger the rows (diamond shape)
                let colClass = "";
                if (idx === 0) colClass = "col-start-2";
                if (idx === 2) colClass = "col-start-1";
                if (idx === 6) colClass = "col-start-2";

                return (
                  <div key={idx} className={`${colClass} flex items-center justify-center size-14 rounded-2xl bg-[#111] border border-white/10 shadow-lg hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${integration.text}`} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM HALF: Description Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 border-t border-white/10 pt-16 md:pt-24 pb-4 md:pb-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="size-10 md:size-14 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center mb-4 md:mb-6 group-hover:border-white/20 transition-colors">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm md:text-lg font-medium text-white mb-2 md:mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-[280px]">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
