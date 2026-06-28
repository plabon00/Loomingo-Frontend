"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { instrumentSerif } from "@/app/fonts";

export default function AutomationRecipesSection() {
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
          Automation <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Recipes</span>
        </h1>
        <p className="text-white/70 mt-4 text-lg md:text-xl font-medium">
          Learn how to use keyword triggers and follow-gate links effectively.
        </p>
      </motion.div>

      <motion.div variants={popUpVariants} className="flex flex-col gap-12 text-left w-full">
        
        <div className="p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden shadow-xl">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500"></div>
          <div className="shrink-0 size-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">High-Converting Templates</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
              These recipes are proven setups used by top creators. Use them as a baseline and customize the copy to match your personal brand voice.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

        <div className="pl-2">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">1</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">The Lead Magnet Drop</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            <strong className="text-white block mb-2">Trigger: "GUIDE" or "SEND"</strong>
            Ask followers to comment a specific word on your Reel to get a free resource. Loomingo will instantly reply to their comment (e.g., "Sent to your DMs! 🚀") and send the link privately. This signals high engagement to the Instagram algorithm, pushing your Reel to more people.
          </p>
        </div>

        <div className="pl-2 pt-8 border-t border-white/5">
          <div className="flex items-center gap-5 mb-5">
            <div className="shrink-0 flex items-center justify-center size-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-lg shadow-sm">2</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">The Follow-Gate</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-white/70 pl-[4.25rem] font-medium">
            <strong className="text-white block mb-2">Requirement: Must be a follower</strong>
            Enable the Follow-Gate feature on your link delivery. If a non-follower comments your trigger word, Loomingo will DM them saying: "Hey! Make sure you follow me first, then reply 'DONE' to get the link." This is the fastest way to turn viral reach into retained followers.
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}