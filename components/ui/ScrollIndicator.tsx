"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, useScroll, useMotionValueEvent } from "motion/react";

export default function ScrollIndicator() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.98) {
      setIsAtBottom(true);
    } else if (isAtBottom && latest <= 0.98) {
      setIsAtBottom(false);
    }
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        animate={{ 
          y: [0, 8, 0], 
          opacity: isAtBottom ? 0 : 1 
        }}
        transition={{ 
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
          opacity: { duration: 0.3 } 
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none text-red-950/40"
      >
        <span className="text-[10px] font-medium uppercase tracking-widest mb-1">Scroll</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </m.div>
    </LazyMotion>
  );
}
