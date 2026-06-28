"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// A hyper-reliable fallback image just in case any URL breaks
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop";

// Scrolling images data 
const baseLeftImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
];
const leftImages = [...baseLeftImages, ...baseLeftImages]; 

const baseRightImages = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488161628813-04466f872507?q=80&w=400&auto=format&fit=crop"
];
const rightImages = [...baseRightImages, ...baseRightImages];

const mobileImages = [...baseLeftImages, ...baseRightImages, ...baseLeftImages, ...baseRightImages];

const initialReviews = [
  {
    id: 1,
    handle: "@fizaakazim",
    followers: "49.5K followers",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop", 
    text: "Loomin is honestly the most easy to use AND affordable automation tool that I've used so far. I recommend it to all my social media clients."
  },
  {
    id: 2,
    handle: "@thegrowthguy",
    followers: "120K followers",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop", 
    text: "The DM automation saved me literally hours every day. My engagement rate doubled in a week, and my audience loves the quick replies!"
  },
  {
    id: 3,
    handle: "@sarahcreates",
    followers: "85K followers",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop", 
    text: "I was skeptical at first, but Loomin's interface is so intuitive. Setting up campaigns takes 2 minutes and the analytics are crystal clear."
  },
  {
    id: 4,
    handle: "@marketing.ninja",
    followers: "210K followers",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop", 
    text: "Best ROI on any SaaS tool we use. We set up an auto-DM for a product launch and saw a 40% increase in click-through rates."
  },
  {
    id: 5,
    handle: "@creators_hub",
    followers: "34K followers",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop", 
    text: "Finally an automation tool that doesn't feel like a bot. The personalization tags make every conversation feel completely natural."
  }
];

export default function TestimonialSection() {
  const [cards, setCards] = useState(initialReviews);

  const handleNext = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const topCard = newCards.shift();
      if (topCard) newCards.push(topCard);
      return newCards;
    });
  };

  return (
    <section className="relative py-12 md:py-24 bg-white w-full overflow-hidden flex flex-col items-center justify-center min-h-[100dvh] snap-center shrink-0">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-red-400 rounded-full opacity-35 blur-[120px] md:blur-[160px] pointer-events-none z-0" />

      {/* Headings */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-8 md:mb-16">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 text-red-950 text-xs md:text-sm font-medium mb-6 md:mb-8 backdrop-blur-sm shadow-sm">
          Loved by users worldwide
        </div>
        <h2 className="text-3xl md:text-6xl font-medium text-red-950 tracking-tight">
          Used by 60K+ <br className="hidden sm:block" /> 
          <span className="text-red-600 italic font-serif">creators & brands</span>
        </h2>
      </div>

      {/* Interactive Layout Row */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-[100vw] gap-4 lg:gap-8">
        
        {/* LEFT DESKTOP TRACK */}
        <div className="hidden md:flex flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_75%,transparent_100%)]">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }} 
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-4 shrink-0 w-max pr-4"
          >
            {leftImages.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                // FIX: Added bg-zinc-100 as a clean skeleton background
                className="w-32 lg:w-44 aspect-[9/16] object-cover rounded-2xl shadow-lg shrink-0 bg-zinc-100 text-transparent" 
                alt="creator" 
                // FIX: Fallback logic triggers instantly if the URL is broken
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* CENTER: Interactive Review Stack */}
        <div className="shrink-0 w-full max-w-[320px] md:max-w-sm px-4 flex flex-col items-center">
          
          <div className="relative w-full h-[300px] md:h-[340px] z-20">
            <AnimatePresence mode="popLayout">
              {cards.map((review, index) => {
                return (
                  <motion.div
                    key={review.id}
                    layout 
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{
                      y: index * 12,               
                      scale: 1 - index * 0.05,     
                      zIndex: cards.length - index, 
                      opacity: index < 3 ? 1 - index * 0.2 : 0, 
                      pointerEvents: index === 0 ? "auto" : "none",
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-0 left-0 w-full h-[260px] md:h-[300px] bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-zinc-100 flex flex-col justify-center origin-top"
                  >
                    <img 
                      src={review.avatar} 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 object-cover bg-zinc-100 text-transparent" 
                      alt="user" 
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="text-center">
                      <h4 className="font-bold text-red-950 text-sm md:text-base">{review.handle}</h4>
                      <p className="text-[10px] md:text-xs text-zinc-500 mb-2 md:mb-4">{review.followers}</p>
                      <div className="text-yellow-400 text-sm md:text-lg mb-2 md:mb-4 tracking-widest">★★★★★</div>
                      <p className="text-red-950/80 leading-relaxed text-xs md:text-sm">
                        "{review.text}"
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext}
            className="mt-2 md:mt-4 flex items-center justify-center gap-2 px-6 py-2 md:py-2.5 rounded-full border border-zinc-200 bg-white text-xs md:text-sm font-medium text-red-950 hover:bg-zinc-50 active:scale-95 transition-all shadow-sm z-20"
          >
            <span>↓</span> Next Review
          </button>
        </div>

        {/* RIGHT DESKTOP TRACK */}
        <div className="hidden md:flex flex-1 overflow-hidden [mask-image:linear-gradient(to_left,transparent_0%,black_15%,black_75%,transparent_100%)]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-4 shrink-0 w-max pl-4"
          >
            {rightImages.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                className="w-32 lg:w-44 aspect-[9/16] object-cover rounded-2xl shadow-lg shrink-0 bg-zinc-100 text-transparent" 
                alt="creator" 
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* MOBILE TRACK */}
        <div className="md:hidden flex w-full mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex gap-3 shrink-0 w-max px-4"
          >
            {mobileImages.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                className="w-24 aspect-[9/16] object-cover rounded-xl shadow-md shrink-0 bg-zinc-100 text-transparent" 
                alt="creator"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }} 
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}