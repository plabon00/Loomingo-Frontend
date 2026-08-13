"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    id: "replies",
    title: "Instant Comment Replies",
    text: "Turn every comment into a conversation. Trigger automated DMs the moment someone engages with your posts or reels to boost the algorithm.",
    bullets: ["Auto-DM delivery", "Keyword triggers", "Story reply integration"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "gate",
    title: "Smart 'Follow Gate' Links",
    text: "Grow your audience effortlessly. Automatically require users to follow your page before they receive your exclusive links, templates, or offers.",
    bullets: ["Follower validation", "Lead magnet delivery", "High conversion rates"],
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "capture",
    title: "Seamless Lead Capture",
    text: "Collect emails, phone numbers, and customer feedback directly inside DMs. Skip the clunky external landing pages and convert faster.",
    bullets: ["In-chat forms", "CRM integration", "Instant data export"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "ai",
    title: "24/7 AI Sales Assistant",
    text: "Let smart AI handle FAQs, qualify leads, and close sales around the clock. Ensure no customer is ever left waiting for a reply.",
    bullets: ["Context-aware replies", "Sales qualification", "Human hand-off"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
  }
];

export default function PotentialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-rotation timer
  useEffect(() => {
    if (isHovering) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000); // 3 seconds per feature

    return () => clearInterval(timer);
  }, [isHovering]);

  return (
    <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20">
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-xl leading-[1.15]">
            For ambitious creators and brands
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-md lg:text-right">
            Four pillars that power your automated social growth from first comment to final sale.
          </p>
        </div>

        {/* MAIN CONTAINER */}
        <div 
          className="relative w-full rounded-[24px] border border-white/10 overflow-hidden bg-[#0a0a0a] min-h-[600px] flex flex-col md:flex-row"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Subtle dot grid background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />

          {/* LEFT SIDE: Accordion */}
          <div className="relative z-10 w-full md:w-[45%] lg:w-[40%] flex flex-col p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/10">
            <div className="flex flex-col gap-3">
              {features.map((feature, i) => {
                const isActive = activeIndex === i;
                return (
                  <div 
                    key={feature.id}
                    onClick={() => setActiveIndex(i)}
                    className={`flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive 
                        ? 'bg-white/5 border-white/10 shadow-lg' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Header */}
                    <div className="px-5 py-4 flex items-center justify-between">
                      <h3 className={`text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                        {feature.title}
                      </h3>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 min-h-[220px] md:min-h-[260px] lg:min-h-[200px]">
                            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                            {feature.text}
                          </p>
                          
                          <div className="flex flex-col gap-2.5">
                            {feature.bullets.map((bullet, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                {bullet}
                              </div>
                            ))}
                          </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Visual Area */}
          <div className="relative z-10 w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 relative"
              >
                {/* Subtle overlay gradient to match the dark theme feel */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
                <img 
                  src={features[activeIndex].image}
                  alt={features[activeIndex].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          </div>
        </div>
      </div>
      </div>
    </section>
  );
}