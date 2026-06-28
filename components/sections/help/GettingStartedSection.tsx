"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { instrumentSerif } from "@/app/fonts";

export default function GettingStartedSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 } 
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible" 
      className="w-full max-w-3xl mx-auto flex flex-col"
    >
      {/* Back Button */}
      <motion.div variants={popUpVariants}>
        <Link 
          href="/help" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Help Center
        </Link>
      </motion.div>

      {/* Main Heading */}
      <motion.div variants={popUpVariants} className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
          Getting <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Started</span>
        </h1>
        <p className="text-white/70 mt-4 text-lg md:text-xl font-medium">
          Launch your first automation campaign in under two minutes.
        </p>
      </motion.div>

      {/* Guide Content - No Card Wrapper */}
      <motion.div 
        variants={popUpVariants}
        className="flex flex-col gap-12 text-left w-full"
      >
        
        {/* CRITICAL SECURITY NOTICE - Kept slightly boxed to stand out */}
        <div className="p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden shadow-xl">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500"></div>
          <div className="shrink-0 size-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Official Meta Authentication</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
              You will always log in directly through Instagram's official portal. <strong className="text-white">Loomingo never sees, collects, or stores your Instagram ID or password.</strong> We only receive a secure token to send DMs on your behalf.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

        {/* Step 1 */}
        <div className="pl-2">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">
              1
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Connect your Instagram</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Log into your Loomingo dashboard and click the "Connect Instagram" button. You will be redirected to Facebook/Meta to securely approve the necessary permissions. Make sure to select the specific Creator or Business page you want to automate.
          </p>
        </div>

        {/* Step 2 */}
        <div className="pl-2 pt-8 border-t border-white/5">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">
              2
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Create a Keyword Trigger</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Navigate to the Automations tab and click "New Campaign". Select the specific Post or Reel you want to automate, then type the exact trigger word you want your followers to comment (e.g., "LINK", "GUIDE", or "SEND").
          </p>
        </div>

        {/* Step 3 */}
        <div className="pl-2 pt-8 border-t border-white/5">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">
              3
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Craft the DM Response</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            Write the message that will instantly send to anyone who comments your trigger word. Add your exclusive links, product pages, or lead-capture forms. You can also require the user to "Follow" you before the link unlocks!
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}