"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "1",
    title: "Select Your Content",
    subtext: "Connect your Instagram and pick the specific post, reel, or story you want to supercharge with automation.",
    mockup: (
      <div className="w-full h-40 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        {/* Mock Instagram Grid */}
        <div className="grid grid-cols-3 gap-1 w-full max-w-[140px] opacity-80">
          <div className="aspect-square bg-zinc-800 rounded-sm"></div>
          <div className="aspect-square bg-red-500 rounded-sm border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-full"></div>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800 rounded-sm"></div>
          <div className="aspect-square bg-zinc-800 rounded-sm"></div>
          <div className="aspect-square bg-zinc-800 rounded-sm"></div>
          <div className="aspect-square bg-zinc-800 rounded-sm"></div>
        </div>
      </div>
    )
  },
  {
    id: "2",
    title: "Set Your Keywords",
    subtext: "Define the exact trigger words. When a follower comments these, the automation begins.",
    mockup: (
      <div className="w-full h-40 flex flex-col justify-center gap-3 relative px-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <span className="text-xs text-zinc-300 font-medium">Trigger Words</span>
        </div>
        <div className="w-full h-12 bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/5 flex items-center px-3 gap-2 shadow-inner">
          <div className="px-2 py-1.5 rounded-md bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]">LINK</div>
          <div className="px-2 py-1.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-medium border border-white/5">GUIDE</div>
          <div className="w-px h-4 bg-zinc-700 animate-pulse ml-1"></div>
        </div>
      </div>
    )
  },
  {
    id: "3",
    title: "Craft the Response",
    subtext: "Write your custom DM, add your exclusive links, and optionally require a follow.",
    mockup: (
      <div className="w-full h-40 relative flex flex-col justify-end px-2">
        <div className="w-[90%] bg-white/[0.02] backdrop-blur-md rounded-2xl rounded-tl-sm p-4 border border-white/5 mb-4 shadow-lg relative">
          {/* Mock text lines */}
          <div className="w-full h-2 bg-zinc-700 rounded-full mb-2.5"></div>
          <div className="w-3/4 h-2 bg-zinc-700 rounded-full mb-4"></div>
          {/* Mock Button */}
          <div className="w-2/3 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
            <span className="text-[10px] text-red-400 font-medium">Tap to open link</span>
          </div>
          
          {/* Little avatar floating outside */}
          <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-zinc-600 border-2 border-[#0a0a0a]"></div>
        </div>
      </div>
    )
  },
  {
    id: "4",
    title: "Watch Sales Grow",
    subtext: "Publish your campaign. Sit back as comments automatically turn into conversations.",
    mockup: (
      <div className="w-full h-40 flex flex-col justify-center gap-4 px-2">
        <div className="flex justify-between items-end">
          <span className="text-xs text-zinc-400 font-medium">Engagement Rate</span>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+350%</span>
        </div>
        <div className="w-full h-16 flex items-end gap-1.5">
          <div className="flex-1 bg-zinc-800 rounded-t-sm h-[30%]"></div>
          <div className="flex-1 bg-zinc-800 rounded-t-sm h-[45%]"></div>
          <div className="flex-1 bg-zinc-800 rounded-t-sm h-[60%]"></div>
          <div className="flex-1 bg-red-500 rounded-t-sm h-[85%] shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
          <div className="flex-1 bg-emerald-500 rounded-t-sm h-[100%] shadow-[0_0_15px_rgba(16,185,129,0.4)] relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }
];

export default function ProcessSection() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default to 4 for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 4 : 1);
    };
    handleResize();
    setIsMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const totalPages = Math.ceil(steps.length / itemsPerPage);
  const safePage = page >= totalPages ? 0 : page;

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [page, isHovering, totalPages]);

  const paginate = (newDirection: number) => {
    let newPage = safePage + newDirection;
    if (newPage < 0) newPage = totalPages - 1;
    if (newPage >= totalPages) newPage = 0;
    setPage([newPage, newDirection]);
  };

  const currentSteps = steps.slice(safePage * itemsPerPage, (safePage + 1) * itemsPerPage);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />
        
        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20 flex flex-col">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs md:text-sm font-medium mb-6">
              How It Works
            </div>
            
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Simple Four-Step Workflow
            </h2>
            
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
              Experience our streamlined approach to Instagram automation that empowers you to capture leads and drive sales instantly.
            </p>
          </div>

          {/* Slider Container */}
          <div 
            className="w-full relative overflow-hidden flex flex-col min-h-[420px] bg-transparent"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="grid grid-cols-1 lg:grid-cols-4 w-full border-t border-l border-white/10 rounded-tl-3xl rounded-bl-3xl lg:rounded-bl-none lg:rounded-tr-3xl overflow-hidden"
              >
                {currentSteps.map((step, idx) => (
                  <div 
                    key={step.id} 
                    className="flex flex-col p-4 sm:p-6 lg:p-8 border-b border-r border-white/10 hover:bg-white/[0.02] transition-colors relative group min-h-[380px]"
                  >
                    {/* Number Indicator */}
                    <span className="text-xs font-bold text-zinc-500 mb-6 sm:mb-8 font-mono tracking-widest group-hover:text-red-400 transition-colors">
                      {step.id}
                    </span>

                    {/* Mockup Area */}
                    <div className="w-full flex-1 mb-6 sm:mb-8 flex flex-col justify-center transform scale-90 sm:scale-100 origin-left">
                      {step.mockup}
                    </div>
                    
                    {/* Text Area */}
                    <div className="mt-auto flex flex-col">
                      <h3 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {step.subtext}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls - Only show if there's more than 1 page */}
          {isMounted && totalPages > 1 && (
            <div className="flex items-center justify-between mt-12 px-2">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === safePage ? 'w-6 bg-red-500' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => paginate(-1)}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 hover:bg-white/10 transition-colors bg-white/[0.02]"
                  aria-label="Previous Steps"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                </button>
                <button 
                  onClick={() => paginate(1)}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 hover:bg-white/10 transition-colors bg-white/[0.02]"
                  aria-label="Next Steps"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}