"use client";

import React from "react";
import { motion } from "motion/react";
import { instrumentSerif } from "@/app/fonts";
import { Search, Rocket, ShieldCheck, MessageSquare, CreditCard, LifeBuoy, Zap } from "lucide-react";
import Link from "next/link"; // Imported Next.js Link

export default function HelpCenterSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };

  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  // Added 'href' to each category for routing
  const categories = [
    { href: "/help/getting-started", icon: <Rocket className="size-6" />, title: "Getting Started", desc: "Connect your Instagram and launch your first automation in minutes." },
    { href: "/help/automation-recipes", icon: <Zap className="size-6" />, title: "Automation Recipes", desc: "Learn how to use keyword triggers and follow-gate links effectively." },
    { href: "/help/account-safety", icon: <ShieldCheck className="size-6" />, title: "Account Safety", desc: "Best practices to keep your Instagram account safe and within limits." },
    { href: "/help/conversations", icon: <MessageSquare className="size-6" />, title: "Conversations", desc: "Crafting DMs that convert and managing automated replies." },
    { href: "/help/billing", icon: <CreditCard className="size-6" />, title: "Early Access & Billing", desc: "Information about our free phase and future pricing structures." },
    { href: "/help/troubleshooting", icon: <LifeBuoy className="size-6" />, title: "Troubleshooting", desc: "Solving common issues with Meta API permissions and triggers." },
  ];

  return (
    <section className="relative w-full pt-8 pb-24 md:pt-12 md:pb-32 bg-transparent flex justify-center min-h-[80vh]">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center"
      >
        
        {/* Top Badge */}
        <motion.div 
          variants={popUpVariants}
          className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm shadow-sm tracking-wider uppercase"
        >
          Support Hub
        </motion.div>

        {/* Search Hero */}
        <motion.div variants={popUpVariants} className="text-center mb-16 w-full max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] mb-8 tracking-tight">
            How can I <span className={`${instrumentSerif.className} text-red-300 pr-2`}>help</span> you?
          </h1>
          
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-red-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles (e.g. Instagram Setup)"
              className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl py-5 px-14 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-black/40 transition-all shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {categories.map((cat, index) => (
            <motion.div 
              key={index}
              variants={popUpVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Link wraps the card content and takes over the styling */}
              <Link 
                href={cat.href}
                className="group block h-full p-8 bg-black/20 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-xl flex flex-col items-start text-left hover:bg-black/30 transition-all cursor-pointer"
              >
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-white/60 leading-relaxed font-medium text-sm">
                  {cat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured Recipe / Promo Box */}
        <motion.div 
          variants={popUpVariants}
          className="w-full max-w-4xl p-8 md:p-12 bg-gradient-to-br from-red-600/20 to-transparent backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a <span className={`${instrumentSerif.className} text-red-300 text-4xl`}>Quickstart</span> Guide?
            </h2>
            <p className="text-white/70 leading-relaxed font-medium mb-6">
              I’ve recorded a 2-minute video showing you exactly how I personally set up my automations to handle high-volume comments.
            </p>
            <button className="bg-white text-red-950 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
              Watch Video Tutorial
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center">
             <div className="size-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl">
                <LifeBuoy size={32} />
             </div>
          </div>
        </motion.div>

        {/* Support Footer */}
        <motion.div variants={popUpVariants} className="mt-20 pt-8 border-t border-white/10 w-full text-center">
            <p className="text-white/60 font-medium">
              Still have questions? I'm iterating daily. <br className="sm:hidden"/> 
              <span className="text-white font-bold ml-1 cursor-pointer hover:text-red-400 transition-colors underline underline-offset-4">Shoot me an email: support@loomingo.com</span>
            </p>
        </motion.div>

      </motion.div>
    </section>
  );
}