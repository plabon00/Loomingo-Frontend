"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop";

const reviews = [
  { id: 1, handle: "@fizaakazim", name: "Fizaa Kazim", role: "Creator", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80", text: "Loomingo is honestly the most easy to use AND affordable automation tool that I've used so far. I recommend it to all my social media clients." },
  { id: 2, handle: "@thegrowthguy", name: "Alex Hormozi", role: "CEO, Growth Co", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80", text: "The DM automation saved me literally hours every day. My engagement rate doubled in a week, and my audience loves the quick replies!" },
  { id: 3, handle: "@sarahcreates", name: "Sarah Jenkins", role: "Designer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80", text: "I was skeptical at first, but Loomingo's interface is so intuitive. Setting up campaigns takes 2 minutes and the analytics are crystal clear." },
  { id: 4, handle: "@marketing.ninja", name: "David Chen", role: "Marketing Director", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80", text: "Best ROI on any SaaS tool we use. We set up an auto-DM for a product launch and saw a 40% increase in click-through rates." },
  { id: 5, handle: "@creators_hub", name: "Emma Watson", role: "Content Strategist", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80", text: "Finally an automation tool that doesn't feel like a bot. The personalization tags make every conversation feel completely natural." },
  { id: 6, handle: "@fitness_empire", name: "Marcus Thorne", role: "Fitness Coach", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80", text: "We went from answering 500 DMs manually to zero. Loomingo handles our entire sales funnel directly in the DMs now." },
  { id: 7, handle: "@stylebyjess", name: "Jessica Lin", role: "Fashion Blogger", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80", text: "The follow-gate feature is a game changer. I've gained 15,000 targeted followers this month alone just by offering a free guide." },
  { id: 8, handle: "@tech_reviews", name: "Marcus B.", role: "Tech Reviewer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80", text: "As a creator, time is money. This tool gives me back 3 hours a day. The analytics dashboard is absolutely gorgeous too." },
  { id: 9, handle: "@daily_motivation", name: "Chris E.", role: "Motivator", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80", text: "I've tried many tools, but the 99.9% uptime and zero-lag responses make Loomingo the undisputed king of IG automation." },
  { id: 10, handle: "@baking_magic", name: "Chloe Smith", role: "Chef", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80", text: "My recipe links are finally getting clicks! By telling people to comment 'RECIPE', my reach has skyrocketed by literally 10x." },
  { id: 11, handle: "@travel_diaries", name: "Ryan R.", role: "Photographer", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80", text: "Being able to capture emails directly inside Instagram DMs means I never have to send people to a clunky Linktree again." },
  { id: 12, handle: "@startup_hustle", name: "Evan M.", role: "Founder", avatar: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=150&q=80", text: "The AI sales assistant actually closes deals for us while we sleep. It's like having a full-time employee that costs pennies." },
];

export default function TestimonialSection() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 5 on desktop, 3 on mobile
      setItemsPerPage(window.innerWidth < 1024 ? 3 : 5);
    };
    handleResize();
    setIsMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure pagination doesn't break if page is out of bounds after resize
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const safePage = page >= totalPages ? 0 : page;

  const paginate = (newDirection: number) => {
    let newPage = safePage + newDirection;
    if (newPage < 0) newPage = totalPages - 1;
    if (newPage >= totalPages) newPage = 0;
    setPage([newPage, newDirection]);
  };

  const currentReviews = reviews.slice(safePage * itemsPerPage, (safePage + 1) * itemsPerPage);

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
    <section className="relative w-full py-6 lg:py-12 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-12 lg:py-16 rounded-[40px] overflow-hidden border border-white/20 flex flex-col">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              What our customers are saying about Loomingo
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Join the increasing number of creators and brands who rely on Loomingo for seamless and effective DM automation.
            </p>
          </div>

          {/* Grid Slider Container */}
          <div className="w-full relative min-h-[500px] md:min-h-[400px] lg:min-h-[320px] overflow-hidden flex flex-col">
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
                // This creates the seamless internal borders (masonry grid look)
                className="grid grid-cols-1 lg:grid-cols-5 w-full border-t border-l border-white/10 rounded-tl-2xl rounded-bl-none md:rounded-bl-2xl bg-transparent"
              >
                {currentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="flex flex-col p-6 border-b border-r border-white/10 min-h-[220px] lg:min-h-[280px] group hover:bg-white/[0.02] transition-colors"
                  >
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8 flex-1">
                      &quot;{review.text}&quot;
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <img 
                        src={review.avatar} 
                        className="w-10 h-10 rounded-full object-cover bg-white/5"
                        alt={review.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{review.name}</span>
                        <span className="text-zinc-500 text-xs">{review.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4 mt-12">
            <button 
              onClick={() => paginate(-1)}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Previous Reviews"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            
            <div className="flex gap-2">
              {isMounted && Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === safePage ? 'w-6 bg-red-500' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={() => paginate(1)}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Next Reviews"
            >
              <ArrowRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}