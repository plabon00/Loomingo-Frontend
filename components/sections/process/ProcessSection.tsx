"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

// A hyper-reliable fallback image just in case an Unsplash URL breaks
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800&auto=format&fit=crop";

const steps = [
  {
    id: "01",
    title: "Select Your Content",
    subtext: "Connect your Instagram and pick the specific post, reel, or story you want to supercharge with automation.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" 
  },
  {
    id: "02",
    title: "Set Your Keywords",
    subtext: "Define the exact trigger words (like 'LINK' or 'GUIDE'). When a follower comments these, the automation begins.",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Craft the Response",
    subtext: "Write your custom DM, add your exclusive links, and optionally require a follow before they get the goods.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Watch Sales Grow",
    subtext: "Publish your campaign. Sit back as every comment automatically turns into a personalized, high-converting conversation.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
  }
];

const ProcessSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.round(latest * (steps.length - 1));
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-transparent">
      {/* FIX: Comment moved safely inside the section tag */}
      
      {/* STICKY CONTAINER */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Background Glow */}
        <div 
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-400 rounded-full opacity-30 blur-[160px] pointer-events-none z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          
          {/* LEFT SIDE: Text Content */}
          <div className="w-full md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left shrink-0">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 text-red-950 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
              How it works
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-red-950 leading-[1.1] mb-5 tracking-tight">
              Launch in under <br className="hidden sm:block" />
              <span className="font-editorial text-red-600 tracking-tight drop-shadow-sm">
                2 minutes
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-red-950/70 font-normal max-w-md">
              You don't need a degree in coding to automate your business. Just follow these four simple steps and let our platform do the heavy lifting.
            </p>
          </div>

          {/* RIGHT SIDE: Horizontal Scroll Window & Indicators */}
          <div className="w-full md:w-7/12 flex flex-col">
            
            <div className="w-full overflow-hidden">
              <motion.div 
                style={{ x }} 
                className="flex w-[320%]"
              >
                {steps.map((step) => (
                  <div key={step.id} className="w-1/4 px-4 md:px-6 flex flex-col">
                    
                    <div className="h-full flex flex-col items-start text-left">
                      <div className="flex items-baseline gap-3 mb-2 shrink-0">
                        <span className="text-red-600 font-bold text-xl">{step.id}.</span>
                        <h3 className="text-2xl font-semibold text-red-950">{step.title}</h3>
                      </div>
                      
                      <p className="text-zinc-500 mb-5 leading-relaxed text-sm md:text-base grow">
                        {step.subtext}
                      </p>

                      <div className="w-full aspect-[5/4] rounded-2xl overflow-hidden shadow-md border border-zinc-200/60 bg-zinc-100 shrink-0">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-cover text-transparent"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* DOT INDICATORS */}
            <div className="flex items-center justify-start gap-2 mt-8 px-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? "w-8 bg-red-600" 
                      : "w-2 bg-zinc-200"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;