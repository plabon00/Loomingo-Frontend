"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTransitionState } from "@/components/providers/transition-provider";

export default function SplashTransition() {
  const { isTransitioning, endTransition, origin } = useTransitionState();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window size for fallback center coordinates
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Failsafe: End the transition as soon as the route actually changes
  useEffect(() => {
    if (isTransitioning) {
      endTransition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const cx = origin?.x ?? windowSize.width / 2;
  const cy = origin?.y ?? windowSize.height / 2;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ clipPath: `circle(0px at ${cx}px ${cy}px)`, opacity: 1 }}
          animate={{ clipPath: `circle(150% at ${cx}px ${cy}px)`, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
            exit: { duration: 0.4, ease: "easeOut" } 
          }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center pointer-events-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <img 
              src="/annimation/Loader cat.svg" 
              alt="Loading" 
              className="w-48 md:w-64 h-auto pointer-events-none drop-shadow-sm" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
