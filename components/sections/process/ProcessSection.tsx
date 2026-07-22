"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { Zap, Hash, MessageSquare, TrendingUp } from "lucide-react";

/* ─── Layout constants ──────────────────────────────────────── */
const NODE_H   = 40;  // node circle diameter (px) — slightly smaller looks great on mobile
const N        = 4;   // number of steps

// Slot height differs by breakpoint — computed after hydration
const SLOT_H_MOBILE  = 96;  // px (compact on small screens)
const SLOT_H_DESKTOP = 110; // px

/* ─── Step data ─────────────────────────────────────────────── */
const steps = [
  {
    id: "01",
    title: "Select Your Content",
    subtext:
      "Connect your Instagram and pick the specific post, reel, or story you want to supercharge with automation.",
    icon: Zap,
    accentSolid: "#ef4444",
    accentLight: "#fca5a5",
    accentDark:  "#b91c1c",
    stat: "3 sec",
    statLabel: "avg. setup",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Set Your Keywords",
    subtext:
      "Define the exact trigger words (like 'LINK' or 'GUIDE'). When a follower comments these, the automation begins.",
    icon: Hash,
    accentSolid: "#f97316",
    accentLight: "#fdba74",
    accentDark:  "#c2410c",
    stat: "∞",
    statLabel: "triggers",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Craft the Response",
    subtext:
      "Write your custom DM, add your exclusive links, and optionally require a follow before they get the goods.",
    icon: MessageSquare,
    accentSolid: "#f43f5e",
    accentLight: "#fda4af",
    accentDark:  "#be123c",
    stat: "1-click",
    statLabel: "builder",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Watch Sales Grow",
    subtext:
      "Publish your campaign. Sit back as every comment turns into a personalized, high-converting conversation.",
    icon: TrendingUp,
    accentSolid: "#dc2626",
    accentLight: "#fca5a5",
    accentDark:  "#991b1b",
    stat: "10x",
    statLabel: "conversions",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
] as const;

type Step = (typeof steps)[number];

/* ─── Step node ─────────────────────────────────────────────── */
function StepNode({
  step,
  isActive,
  isPast,
}: {
  step: Step;
  isActive: boolean;
  isPast: boolean;
}) {
  const Icon = step.icon;
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: NODE_H, height: NODE_H }}
    >
      <motion.div
        animate={{ scale: isActive ? 1 : isPast ? 0.82 : 0.72 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: NODE_H,
          height: NODE_H,
          background: isActive
            ? `linear-gradient(135deg, ${step.accentSolid}, ${step.accentDark})`
            : isPast
            ? `${step.accentSolid}28`
            : "rgba(255,255,255,0.9)",
          border: isActive
            ? "2px solid rgba(255,255,255,0.9)"
            : isPast
            ? `2px solid ${step.accentSolid}44`
            : "2px solid rgba(0,0,0,0.08)",
          boxShadow: isActive
            ? `0 0 0 4px ${step.accentSolid}22, 0 8px 24px -4px ${step.accentSolid}55`
            : "none",
          transition: "all 0.45s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              <Icon className="w-4 h-4 text-white" />
            </motion.div>
          ) : isPast ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke={step.accentSolid}
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          ) : (
            <motion.span
              key="num"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-[11px] font-bold"
              style={{ color: "rgba(0,0,0,0.22)" }}
            >
              {step.id}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Image card ────────────────────────────────────────────── */
function ImageCard({ activeIndex, activeStep }: { activeIndex: number; activeStep: Step }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.93, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 150, damping: 24, mass: 0.7 }}
          className="group absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
          style={{
            boxShadow: `0 24px 56px -14px ${activeStep.accentSolid}35, 0 6px 18px -4px rgba(0,0,0,0.1)`,
          }}
        >
          <img
            src={steps[activeIndex].image}
            alt={steps[activeIndex].title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(140deg, ${activeStep.accentSolid}30 0%, transparent 60%)`,
            }}
          />



          {/* Top-left badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.36 }}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${activeStep.accentSolid}, ${activeStep.accentLight})`,
              }}
            />
            Step {steps[activeIndex].id}
          </motion.div>

          {/* Stat — top right */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.36 }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-right"
          >
            <div className="text-white/45 text-[9px] font-semibold uppercase tracking-widest">
              {steps[activeIndex].statLabel}
            </div>
            <div
              className="text-xl font-bold"
              style={{
                background: `linear-gradient(135deg, #fff, ${activeStep.accentLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {steps[activeIndex].stat}
            </div>
          </motion.div>

          {/* Orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            aria-hidden="true"
          >
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                background: activeStep.accentLight,
                boxShadow: `0 0 6px ${activeStep.accentSolid}`,
              }}
            />
          </motion.div>



        </motion.div>
      </AnimatePresence>

      {/* Drop shadow bloom */}
      <div
        className="absolute -bottom-4 left-6 right-6 h-8 rounded-full blur-xl pointer-events-none transition-all duration-700"
        style={{ background: `${activeStep.accentSolid}38` }}
      />
    </div>
  );
}

/* ─── Main Section ──────────────────────────────────────────── */
const ProcessSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const [slotH, setSlotH] = useState(SLOT_H_DESKTOP);

  // Responsive slot height
  useEffect(() => {
    const update = () => {
      setSlotH(window.innerWidth < 768 ? SLOT_H_MOBILE : SLOT_H_DESKTOP);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Derived layout values — recomputed whenever slotH changes
  const NODE_TOP_IN_SLOT = (slotH - NODE_H) / 2;
  const TRACK_H = (N - 1) * slotH;
  const TOTAL_H = N * slotH;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setRawProgress(latest);
    const chunk = 1 / N;
    const next = Math.max(0, Math.min(N - 1, Math.floor(latest / chunk)));
    setActiveIndex(next);
  });

  const activeStep = steps[activeIndex];

  // Bar fill: reaches centre of node i exactly at scroll = i / N
  const fillFrac = Math.min(1, (rawProgress * N) / (N - 1));
  const fillPx   = fillFrac * TRACK_H;

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${N * 100}vh` }}
    >
      {/* ── STICKY VIEWPORT ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Ambient blobs */}
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"], y: ["-5%", "5%", "-5%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none z-0"
          style={{ background: activeStep.accentSolid, opacity: 0.08, transition: "background 0.8s ease" }}
          aria-hidden="true"
        />
        <motion.div
          animate={{ x: ["10%", "-10%", "10%"], y: ["5%", "-5%", "5%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[280px] rounded-full blur-[140px] pointer-events-none z-0"
          style={{ background: activeStep.accentLight, opacity: 0.06, transition: "background 0.8s ease" }}
          aria-hidden="true"
        />

        {/* ── INNER SCROLL AREA ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col h-full py-6 sm:py-8 md:py-12">

          {/* ── Header ── */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border border-zinc-200 bg-white/60 text-red-950 text-xs sm:text-sm font-medium mb-3 sm:mb-4 backdrop-blur-sm shadow-sm"
            >
              <span
                className="w-1.5 h-1.5 rounded-full mr-2 animate-pulse"
                style={{ background: activeStep.accentSolid, transition: "background 0.5s ease" }}
              />
              How it works
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-red-950 leading-[1.1] mb-2 sm:mb-3 tracking-tight"
            >
              Launch in under{" "}
              <span className="font-editorial text-red-600 tracking-tight">2 minutes</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm md:text-base text-red-950/50 max-w-sm sm:max-w-md mx-auto"
            >
              Four simple steps. No code required. Let our platform do the heavy lifting.
            </motion.p>
          </div>

          {/* ── MOBILE: image card above timeline ── */}
          <div className="block md:hidden shrink-0 mb-4 px-0">
            <ImageCard activeIndex={activeIndex} activeStep={activeStep} />
          </div>

          {/* ── Body ── */}
          <div className="flex-1 flex flex-row items-center gap-6 sm:gap-8 md:gap-12 lg:gap-20 min-h-0">

            {/* ─── Timeline ─── */}
            <div className="w-full md:w-[44%] flex items-center justify-center">
              {/*
                CRITICAL: All nodes are absolutely positioned inside a fixed-height
                container so expanding descriptions never shift node positions.
              */}
              <div
                className="relative w-full max-w-xs sm:max-w-sm"
                style={{ height: TOTAL_H }}
              >
                {/* Vertical track */}
                <div
                  className="absolute z-0 rounded-full"
                  style={{
                    left: NODE_H / 2 - 1,
                    top: slotH / 2,
                    width: 2,
                    height: TRACK_H,
                    background: "rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Animated fill — no height transition → dot stays in sync */}
                  <div
                    className="absolute top-0 left-0 right-0 rounded-full overflow-visible"
                    style={{
                      height: fillPx,
                      background: `linear-gradient(to bottom, ${steps[0].accentSolid}cc, ${activeStep.accentDark})`,
                      boxShadow: fillPx > 4 ? `0 0 7px 2px ${activeStep.accentSolid}44` : "none",
                      transition: "box-shadow 0.4s ease, background 0.5s ease",
                    }}
                  >
                    {fillPx > 0 && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 rounded-full"
                        style={{
                          width: 9,
                          height: 9,
                          bottom: -4,
                          background: activeStep.accentSolid,
                          boxShadow: `0 0 0 3px ${activeStep.accentSolid}44, 0 0 12px 2px ${activeStep.accentSolid}99`,
                          transition: "background 0.4s ease",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Nodes + text — absolutely placed */}
                {steps.map((step, index) => {
                  const isActive = index === activeIndex;
                  const isPast   = index < activeIndex;
                  const nodeTop  = index * slotH + NODE_TOP_IN_SLOT;

                  return (
                    <React.Fragment key={step.id}>
                      {/* Node */}
                      <div className="absolute z-10" style={{ top: nodeTop, left: 0 }}>
                        <StepNode step={step} isActive={isActive} isPast={isPast} />
                      </div>

                      {/* Text */}
                      <div
                        className="absolute"
                        style={{
                          top: nodeTop - 4,
                          left: NODE_H + 12,
                          right: 0,
                        }}
                      >
                        <motion.div
                          animate={{ opacity: isActive ? 1 : isPast ? 0.52 : 0.26 }}
                          transition={{ duration: 0.38, ease: "easeOut" }}
                        >
                          {/* Badge + title */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                            <motion.span
                              animate={{
                                width:        isActive ? "auto" : 0,
                                opacity:      isActive ? 1 : 0,
                                paddingLeft:  isActive ? "8px" : 0,
                                paddingRight: isActive ? "8px" : 0,
                              }}
                              transition={{ duration: 0.34, ease: "easeOut" }}
                              className="overflow-hidden whitespace-nowrap rounded-full py-0.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white inline-flex items-center"
                              style={{
                                background: `linear-gradient(90deg, ${step.accentSolid}, ${step.accentDark})`,
                              }}
                            >
                              Step {step.id}
                            </motion.span>
                            <h3
                              className="font-semibold tracking-tight text-sm sm:text-base md:text-lg leading-snug transition-colors duration-400"
                              style={{
                                color: isActive
                                  ? "#1c0a09"
                                  : isPast
                                  ? "rgba(28,10,9,0.42)"
                                  : "rgba(28,10,9,0.22)",
                              }}
                            >
                              {step.title}
                            </h3>
                          </div>

                          {/* Expandable description */}
                          <motion.div
                            initial={false}
                            animate={{
                              height:  isActive ? "auto" : 0,
                              opacity: isActive ? 1 : 0,
                            }}
                            transition={{ duration: 0.38, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div
                              className="rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 mt-1.5"
                              style={{
                                background:    "rgba(255,255,255,0.68)",
                                backdropFilter: "blur(18px)",
                                border:        "1px solid rgba(255,255,255,0.82)",
                                boxShadow:     `0 4px 18px -6px ${step.accentSolid}22`,
                              }}
                            >
                              <p className="text-zinc-500 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                                {step.subtext}
                              </p>
                              <div
                                className="flex items-center gap-2.5 mt-2 pt-2"
                                style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                              >
                                <span
                                  className="text-lg sm:text-xl font-bold"
                                  style={{
                                    background: `linear-gradient(90deg, ${step.accentSolid}, ${step.accentDark})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                  }}
                                >
                                  {step.stat}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">
                                  {step.statLabel}
                                </span>
                                <div
                                  className="flex-1 h-1 rounded-full overflow-hidden"
                                  style={{ background: "rgba(0,0,0,0.06)" }}
                                >
                                  <motion.div
                                    key={step.id}
                                    className="h-full rounded-full"
                                    style={{
                                      background: `linear-gradient(90deg, ${step.accentSolid}, ${step.accentLight})`,
                                    }}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.3, ease: "easeOut", delay: 0.15 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ─── Desktop image card ─── */}
            <div className="hidden md:flex w-full md:w-[56%] items-center justify-center">
              <div className="w-full max-w-lg">
                <ImageCard activeIndex={activeIndex} activeStep={activeStep} />
              </div>
            </div>
          </div>

          {/* ── Progress dots ── */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 shrink-0">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const isPast   = index < activeIndex;
              return (
                <motion.div
                  key={index}
                  animate={{ scale: isActive ? 1 : 0.88 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                >
                  <div
                    className="relative h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: isActive ? 28 : 6 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-500"
                      style={{
                        background: isActive
                          ? `linear-gradient(90deg, ${step.accentSolid}, ${step.accentDark})`
                          : isPast
                          ? `${step.accentSolid}44`
                          : "rgba(0,0,0,0.1)",
                        boxShadow: isActive ? `0 0 7px ${step.accentSolid}88` : "none",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
