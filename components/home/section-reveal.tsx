"use client";

import { ReactNode } from "react";
import { m, LazyMotion, domAnimation } from "motion/react";

/**
 * Wraps a below-the-fold section with a gentle scroll reveal:
 * a fade + rise as it enters.
 * Pinned/sticky sections (which manage their own scroll) should be
 * given `still` so we don't fight their transforms.
 */
export function SectionReveal({ children, still = false }: { children: ReactNode; still?: boolean }) {
  if (still) {
    return <div>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }} // Triggers when exactly 5% of the top is visible
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
