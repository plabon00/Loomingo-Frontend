"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

const avatars: string[] = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/women/66.jpg',
  'https://randomuser.me/api/portraits/men/77.jpg',
  'https://randomuser.me/api/portraits/women/88.jpg'
];

const features = [
  {
    icon: "⚡️", 
    title: "Instant Comment Replies",
    text: "Turn every comment into a conversation. Trigger automated DMs the moment someone engages with your posts or reels to boost the algorithm."
  },
  {
    icon: "🔒",
    title: "Smart 'Follow Gate' Links",
    text: "Grow your audience effortlessly. Automatically require users to follow your page before they receive your exclusive links, templates, or offers."
  },
  {
    icon: "🎯",
    title: "Seamless Lead Capture",
    text: "Collect emails, phone numbers, and customer feedback directly inside DMs. Skip the clunky external landing pages and convert faster."
  },
  {
    icon: "🤖",
    title: "24/7 AI Sales Assistant",
    text: "Let smart AI handle FAQs, qualify leads, and close sales around the clock. Ensure no customer is ever left waiting for a reply."
  }
];

export default function PotentialSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] 
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const chunk = 1 / features.length;
    let newIndex = Math.floor(latest / chunk);
    newIndex = Math.max(0, Math.min(newIndex, features.length - 1));
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  return (
    // Slightly shorter scroll duration on mobile (250vh) so it doesn't feel tedious, 300vh on desktop
    <section ref={containerRef} className="relative w-full h-[250vh] md:h-[300vh] bg-white">
      
      {/* STICKY CONTAINER: Uses 100dvh for better mobile browser support */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden py-8 md:py-0">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 md:left-full -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] bg-red-400 rounded-full opacity-30 md:opacity-40 blur-[120px] md:blur-[160px] pointer-events-none z-0" />

        {/* flex-col-reverse pushes the accordion to the bottom and the text to the top on mobile.
          md:flex-row puts them side-by-side on desktop.
        */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col-reverse md:flex-row gap-6 md:gap-16 items-center md:items-start">
          
          {/* LEFT/BOTTOM: Accordion UI */}
          <div className="w-full md:w-1/2 flex flex-col w-full max-w-md md:max-w-none mx-auto md:pt-8">
            {features.map((feature, i) => {
              const isActive = i === activeIndex;
              
              return (
                <div 
                  key={i} 
                  className={`flex flex-col py-3 md:py-6 transition-all duration-500 ease-in-out ${
                    i !== features.length - 1 ? 'border-b border-zinc-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-xl md:text-2xl opacity-80 shrink-0">
                      {feature.icon}
                    </div>
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-medium transition-colors duration-300 ${
                      isActive ? 'text-red-950' : 'text-red-950/40'
                    }`}>
                      {feature.title}
                    </h3>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? 8 : 0,
                      marginBottom: isActive ? 8 : 0
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden pl-9 md:pl-12" 
                  >
                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed pr-2 md:pr-8">
                      {feature.text}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* RIGHT/TOP: Static Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right md:pt-12 shrink-0">
            <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-zinc-200 bg-white/50 text-red-950 text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm shadow-sm">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium text-red-950 leading-[1.1] mb-3 md:mb-6 tracking-tight">
              Automate your <br className="hidden sm:block" />
              <span className="text-red-600 italic font-serif">growth</span>
            </h2>
            <p className="text-sm md:text-base text-red-950/70 max-w-sm mb-6 md:mb-8 px-4 md:px-0">
              Everything you need to turn casual scrollers into loyal customers on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-xs md:text-sm text-red-950/80 font-medium">Trusted by top creators</p>
              <div className="flex -space-x-2 md:-space-x-3">
                {avatars.map((img, i) => (
                  <img key={i} src={img} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow" alt="avatar" />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}