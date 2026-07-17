"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  origin: { x: number; y: number } | null;
  startTransition: (x?: number, y?: number) => void;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  const startTransition = (x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) {
      setOrigin({ x, y });
    } else {
      setOrigin(null); // Fallback to center if no coordinates provided
    }
    setIsTransitioning(true);
  };
  
  const endTransition = () => setIsTransitioning(false);

  return (
    <TransitionContext.Provider value={{ isTransitioning, origin, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionState() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransitionState must be used within a TransitionProvider");
  }
  return context;
}
