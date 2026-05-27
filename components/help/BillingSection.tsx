"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { instrumentSerif } from "@/app/fonts";

export default function BillingSection() {
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
          Early Access & <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Billing</span>
        </h1>
        <p className="text-white/70 mt-4 text-lg md:text-xl font-medium">
          Information about our current free phase and future pricing structures.
        </p>
      </motion.div>

      <motion.div variants={popUpVariants} className="flex flex-col gap-12 text-left w-full">
        
        <div className="p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden shadow-xl">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500"></div>
          <div className="shrink-0 size-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">No Credit Card Required</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
              You can set up and launch your automations right now without entering any payment information. We want you to see the value before you pay a dime.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

        <div className="pl-2">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">1</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">The Early Access Phase</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Loomingo is currently in active beta development. During this phase, core automation features are entirely free. In exchange, we ask for your feedback if you encounter any bugs or have feature requests!
          </p>
        </div>

        <div className="pl-2 pt-8 border-t border-white/5">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">2</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Future Pricing</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            When we transition to a full release, Loomingo will offer tiered subscription plans based on DM volume. Don't worry—Early Access users will be notified 30 days in advance and will receive exclusive founder-level discounts when we flip the switch.
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}