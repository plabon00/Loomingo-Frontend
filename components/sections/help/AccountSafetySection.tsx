"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { instrumentSerif } from "@/app/fonts";

export default function AccountSafetySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-3xl mx-auto flex flex-col">
      <motion.div variants={popUpVariants}>
        <Link href="/help" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 font-medium group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Help Center
        </Link>
      </motion.div>

      <motion.div variants={popUpVariants} className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
          Account <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Safety</span>
        </h1>
        <p className="text-white/70 mt-4 text-lg md:text-xl font-medium">
          Best practices to keep your Instagram account safe and within limits.
        </p>
      </motion.div>

      <motion.div variants={popUpVariants} className="flex flex-col gap-12 text-left w-full">
        
        <div className="p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden shadow-xl">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500"></div>
          <div className="shrink-0 size-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">We Use Official APIs</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
              Loomingo does not "scrape" or hack Instagram. We use the 100% official Meta Developer API. However, Instagram still monitors spam behavior, so it is crucial to follow these guidelines.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

        <div className="pl-2">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">1</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Understand Rate Limits</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Instagram restricts the number of DMs you can send in a given hour (usually around 50-100 depending on account age). Loomingo automatically paces your messages if a Reel goes incredibly viral, but you should avoid setting up multiple heavy automations simultaneously on a brand-new account.
          </p>
        </div>

        <div className="pl-2 pt-8 border-t border-white/5">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">2</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Use Message Variations</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Sending the exact same 15-word response to 500 people triggers Instagram's spam filters. Inside Loomingo, we highly recommend setting up 3 to 4 variations of your response (e.g., "Here is the link!", "Just sent it to you!", "Check your DMs!"). Loomingo will randomly rotate through them.
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}