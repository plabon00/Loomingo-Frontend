"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Testimonial data ──────────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: "Fiza Kazim",
    location: "Dubai, UAE",
    handle: "@fizaakazim",
    followers: "49.5K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
    heading: "Effortless automation, real results.",
    text: "Loomin is honestly the most easy to use AND affordable automation tool that I've used so far. I recommend it to all my social media clients.",
  },
  {
    id: 2,
    name: "Marcus Chen",
    location: "San Francisco, USA",
    handle: "@thegrowthguy",
    followers: "120K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
    heading: "Engagement doubled in a week.",
    text: "The DM automation saved me literally hours every day. My engagement rate doubled in a week, and my audience loves the quick replies!",
  },
  {
    id: 3,
    name: "Sarah Mitchell",
    location: "London, UK",
    handle: "@sarahcreates",
    followers: "85K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
    heading: "Intuitive and incredibly fast.",
    text: "I was skeptical at first, but Loomin's interface is so intuitive. Setting up campaigns takes 2 minutes and the analytics are crystal clear.",
  },
  {
    id: 4,
    name: "James Rodriguez",
    location: "Madrid, Spain",
    handle: "@marketing.ninja",
    followers: "210K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    heading: "Best ROI on any tool we use.",
    text: "We set up an auto-DM for a product launch and saw a 40% increase in click-through rates. Absolutely game-changing for our brand.",
  },
  {
    id: 5,
    name: "Anya Petrova",
    location: "Berlin, Germany",
    handle: "@creators_hub",
    followers: "34K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop",
    heading: "Feels personal, not like a bot.",
    text: "Finally an automation tool that doesn't feel like a bot. The personalization tags make every conversation feel completely natural.",
  },
  {
    id: 6,
    name: "Lily Park",
    location: "Seoul, Korea",
    handle: "@lilydigital",
    followers: "67K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500&auto=format&fit=crop",
    heading: "Scaled my business 3x in a month.",
    text: "I went from manually DMing 50 people a day to reaching thousands automatically. The keyword triggers are genius — set it and forget it.",
  },
  {
    id: 7,
    name: "David Okafor",
    location: "Lagos, Nigeria",
    handle: "@davidgrows",
    followers: "92K",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop",
    heading: "My secret weapon for launches.",
    text: "Every product launch, Loomin handles thousands of DMs flawlessly. My audience gets instant responses while I focus on creating content.",
  },
];

const AUTO_ROTATE_MS = 2000;

/* ─── Card positions for the fan spread ─────────────────────── */
const fanPositions = [
  { x: "-135%", rotate: -16, scale: 0.68, opacity: 1, zIndex: 1, y: "14%", blur: "6px", mask: "linear-gradient(to right, rgba(0,0,0,0) -20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)" },
  { x: "-70%", rotate: -8, scale: 0.84, opacity: 1, zIndex: 2, y: "5%", blur: "2px", mask: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)" },
  { x: "0%", rotate: 0, scale: 1, opacity: 1, zIndex: 5, y: "0%", blur: "0px", mask: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)" },
  { x: "70%", rotate: 8, scale: 0.84, opacity: 1, zIndex: 2, y: "5%", blur: "2px", mask: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)" },
  { x: "135%", rotate: 16, scale: 0.68, opacity: 1, zIndex: 1, y: "14%", blur: "6px", mask: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 120%)" },
];

/* ─── Single Fan Card ───────────────────────────────────────── */
const FanCard = ({
  testimonial,
  position,
  isCenter,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial: (typeof testimonials)[0];
  position: (typeof fanPositions)[0];
  isCenter: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <motion.div
      animate={{
        x: position.x,
        rotate: position.rotate,
        scale: position.scale,
        opacity: position.opacity,
        y: position.y,
        filter: `blur(${position.blur})`,
        webkitMaskImage: position.mask,
        maskImage: position.mask,
      } as any}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 22,
        mass: 1,
      }}
      onClick={onClick}
      className={`absolute left-1/2 -translate-x-1/2 origin-bottom ${
        !isCenter ? "cursor-pointer" : ""
      }`}
      style={{ zIndex: position.zIndex }}
    >
      <motion.div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={
          isCenter
            ? { scale: 1.04, y: -6 }
            : { scale: 1.06, opacity: 1 }
        }
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        style={{ 
          transform: "translateZ(0)",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)"
        }}
        className={`group relative w-[170px] sm:w-[195px] md:w-[215px] lg:w-[235px] aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden isolation-isolate ${
          isCenter
            ? "shadow-2xl shadow-red-950/25"
            : "shadow-lg shadow-red-950/10"
        }`}
      >
        {/* Image */}
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl"
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 rounded-2xl md:rounded-3xl ${
            isCenter
              ? "bg-gradient-to-t from-red-950/80 via-red-950/15 to-transparent"
              : "bg-gradient-to-t from-red-950/50 via-red-950/5 to-transparent"
          }`}
        />

        {/* Center card — name & location */}
        {isCenter && (
          <>
            {/* Bottom info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-gradient-to-t from-red-950/90 to-transparent"
            >
              <h4 className="text-white font-semibold text-sm md:text-base tracking-tight leading-tight">
                {testimonial.name}
              </h4>
              <p className="text-white/60 text-[11px] md:text-xs mt-0.5 font-medium">
                {testimonial.location}
              </p>
            </motion.div>

            {/* Shine sweep on hover */}
            <div
              className="absolute inset-y-0 -left-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[1.2s] ease-out group-hover:translate-x-[250%] pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ─── Star Rating Animation ─────────────────────────────────── */
const AnimatedStars = ({ rating, isVisible }: { rating: number; isVisible: boolean }) => {
  return (
    <div className="flex items-center gap-0.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={
            isVisible
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0, rotate: -90 }
          }
          transition={{
            delay: i * 0.08,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className={`text-sm md:text-base ${
            i < rating ? "text-amber-400" : "text-zinc-200"
          }`}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
};

/* ─── Main Section ──────────────────────────────────────────── */
export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCount = testimonials.length;

  // Get the 5 visible testimonials centered around activeIndex
  const getVisibleIndices = useCallback(() => {
    const indices: number[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = (activeIndex + offset + totalCount) % totalCount;
      indices.push(idx);
    }
    return indices;
  }, [activeIndex, totalCount]);

  const visibleIndices = getVisibleIndices();

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCount);
    setProgress(0);
  }, [totalCount]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
    setProgress(0);
  }, [totalCount]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
  }, []);

  // Auto-rotation with smooth progress
  useEffect(() => {
    // Clear existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    if (isPaused) {
      return;
    }

    const progressTick = 50; // Update progress every 50ms
    const totalTicks = AUTO_ROTATE_MS / progressTick;
    let tickCount = 0;

    progressRef.current = setInterval(() => {
      tickCount++;
      setProgress(tickCount / totalTicks);

      if (tickCount >= totalTicks) {
        tickCount = 0;
        setProgress(0);
        setActiveIndex((prev) => (prev + 1) % totalCount);
      }
    }, progressTick);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, totalCount, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Click side cards to navigate
  const handleCardClick = (posIndex: number) => {
    if (posIndex < 2) goPrev();
    if (posIndex > 2) goNext();
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative py-16 md:py-24 bg-transparent w-full overflow-hidden flex flex-col items-center justify-center min-h-[100dvh]">
      {/* ── Ambient Glows ── */}
      <motion.div
        animate={{
          x: ["-8%", "8%", "-8%"],
          y: ["-4%", "4%", "-4%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[300px] md:h-[400px] bg-red-400 rounded-full opacity-[0.12] blur-[150px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <motion.div
        animate={{
          x: ["6%", "-6%", "6%"],
          y: ["3%", "-3%", "3%"],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/3 w-[300px] h-[200px] bg-orange-300 rounded-full opacity-[0.06] blur-[120px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ── Section Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/60 text-red-950 text-sm font-medium mb-6 md:mb-8 backdrop-blur-sm shadow-sm"
      >
        <span className="relative flex h-1.5 w-1.5 mr-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        Loved by creators worldwide
      </motion.div>

      {/* ── Heading ── */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-red-950 tracking-tight text-center mb-10 md:mb-14 px-4"
      >
        Used by 60K+{" "}
        <br className="hidden sm:block" />
        <span className="font-editorial text-red-600">
          creators & brands
        </span>
      </motion.h2>

      {/* ── Fan Card Carousel ── */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-4 select-none"
        style={{ perspective: "1200px" }}
      >
        {/* Fan card area — hover here pauses auto-rotation */}
        <div
          className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[370px]"
        >
          {visibleIndices.map((testimonialIndex, posIndex) => (
            <FanCard
              key={testimonials[testimonialIndex].id}
              testimonial={testimonials[testimonialIndex]}
              position={fanPositions[posIndex]}
              isCenter={posIndex === 2}
              onClick={posIndex !== 2 ? () => handleCardClick(posIndex) : undefined}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            />
          ))}
        </div>

        {/* ── Quote Circle ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          viewport={{ once: true }}
          className="relative z-20 mx-auto -mt-5 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg shadow-red-950/10 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-red-950/70"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </motion.div>

        {/* ── Testimonial Text ── */}
        <div className="relative z-10 text-center mt-6 md:mt-8 max-w-2xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Star rating */}
              <div className="mb-3 md:mb-4">
                <AnimatedStars rating={activeTestimonial.rating} isVisible={true} />
              </div>

              {/* Heading */}
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] lg:leading-[1.15] font-semibold text-red-950 tracking-tight mb-3 md:mb-4">
                {activeTestimonial.heading}
              </h3>

              {/* Quote text */}
              <p className="text-sm sm:text-base md:text-lg text-zinc-500 leading-relaxed font-normal italic max-w-xl mx-auto">
                &ldquo;{activeTestimonial.text}&rdquo;
              </p>

              {/* Author pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="inline-flex items-center gap-3 mt-5 md:mt-7 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-zinc-200/60 shadow-sm"
              >
                <img
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-red-950">
                    {activeTestimonial.handle}
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {activeTestimonial.followers} followers
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Progress Dots Only ── */}
        <div className="relative z-10 flex items-center justify-center mt-8 md:mt-10">
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.button
                  key={index}
                  onClick={() => goTo(index)}
                  className="relative h-2 rounded-full overflow-hidden"
                  animate={{
                    width: isActive ? 32 : 8,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  {/* Track bg */}
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-400 ${
                      isActive
                        ? "bg-red-200"
                        : index < activeIndex
                        ? "bg-red-950/18 hover:bg-red-950/30"
                        : "bg-red-950/8 hover:bg-red-950/18"
                    }`}
                  />
                  {/* Active fill with progress */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}