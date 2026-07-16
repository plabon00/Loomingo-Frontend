"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
// Safely importing the initialized font from your global layout
import { instrumentSerif } from "@/app/fonts";

export default function AboutSection() {
  // Stagger container: triggers children sequentially
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 } 
    }
  };

  // Item variant: bottom-to-top pop up
  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    // Removed bg-white so the page's gradient shines through
    <section className="relative w-full pt-8 pb-24 md:pt-12 md:pb-32 bg-transparent flex justify-center min-h-[80vh]">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
      >
        
        {/* Top Badge - Updated to glassmorphic white */}
        <motion.div 
          variants={popUpVariants}
          className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm shadow-sm tracking-wider uppercase"
        >
          The Founder&apos;s Note
        </motion.div>

        {/* Main Heading - Updated to white and light red */}
        <motion.div variants={popUpVariants}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] mb-12 tracking-tight">
            Built by Creators, <br className="hidden sm:block" />
            for <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Creators</span>
          </h2>
        </motion.div>

        {/* Content Body */}
        <div className="flex flex-col gap-8 md:gap-10 text-left max-w-2xl mx-auto">
          
          <motion.p 
            variants={popUpVariants}
            className="text-lg md:text-xl text-white/80 leading-relaxed font-medium"
          >
            Loomingo began with a simple observation: creators are losing thousands of potential sales and leads simply because they can’t be everywhere at once. I’m a backend developer who believes that growth shouldn&apos;t be held back by manual tasks.
          </motion.p>

          <motion.p 
            variants={popUpVariants}
            className="text-lg md:text-xl text-white/80 leading-relaxed font-medium"
          >
            I am currently building Loomingo solo, obsessing over every line of code to ensure your Instagram automation is seamless, lightning-fast, and secure. 
          </motion.p>

          {/* Highlight Box for Early Access - Updated to dark glassmorphism */}
          <motion.div 
            variants={popUpVariants}
            className="p-6 md:p-8 bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden my-2"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <p className="text-lg md:text-xl text-white leading-relaxed font-semibold">
              We are currently in our <span className={`${instrumentSerif.className} text-red-400 text-2xl`}>Early Access</span> phase, which means you get full, free access to all our automation tools while I refine the engine and scale the infrastructure.
            </p>
          </motion.div>

          <motion.p 
            variants={popUpVariants}
            className="text-lg md:text-xl text-white/80 leading-relaxed font-medium"
          >
            This is just the beginning—I’m scaling the platform daily, and as the team grows, so will our capabilities. Thank you for being here at the start of the journey.
          </motion.p>

          {/* Sign-off - Updated colors for dark mode */}
          <motion.div
            variants={popUpVariants}
            className="pt-6 border-t border-white/10 mt-4 flex flex-wrap items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <p className="font-bold text-white text-lg">Plaban</p>
              <p className="text-sm text-white/60 font-medium">Founder & Sole Developer</p>
            </div>

            {/* Connect link to developer portfolio */}
            <a
              href="https://plaban-psi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-semibold text-white hover:bg-white hover:text-red-950 transition-all duration-300 active:scale-[0.97]"
            >
              Connect
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}