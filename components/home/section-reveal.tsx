"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Wraps a below-the-fold section with a gentle GSAP scroll reveal:
 * a fade + rise as it enters, reversing when scrolled back out.
 * Pinned/sticky sections (which manage their own scroll) should be
 * given `still` so we don't fight their transforms.
 */
export function SectionReveal({ children, still = false }: { children: ReactNode; still?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (still) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: 48,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
