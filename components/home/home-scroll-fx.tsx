"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ————————————————————————————————————————————————
   1. SCROLL PROGRESS BAR
   Thin crimson bar scrubbed to total page scroll.
———————————————————————————————————————————————— */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.5,
        },
      }
    );
  });

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[200] origin-left pointer-events-none bg-gradient-to-r from-red-700 via-red-500 to-red-700"
    />
  );
}

/* ————————————————————————————————————————————————
   2. MARQUEE BAND
   Two counter-scrolling rows of editorial text, tilted,
   scrubbed to scroll. Sits between hero and first section.
———————————————————————————————————————————————— */
const MARQUEE_WORDS = ["Automate", "Engage", "Convert", "Grow", "Repeat"];

function MarqueeRow({ className, reverse }: { className: string; reverse?: boolean }) {
  const row = Array.from({ length: 3 }).flatMap((_, r) =>
    MARQUEE_WORDS.map((w, i) => ({ key: `${r}-${i}`, word: w, serif: (r * MARQUEE_WORDS.length + i) % 2 === 1 }))
  );
  return (
    <div className={`flex items-center gap-6 sm:gap-10 whitespace-nowrap will-change-transform ${className}`}>
      {row.map(({ key, word, serif }) => (
        <span key={key} className="flex items-center gap-6 sm:gap-10 shrink-0">
          <span
            className={
              serif
                ? "font-editorial text-3xl sm:text-5xl text-red-200"
                : "text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase"
            }
          >
            {word}
          </span>
          <span className={`size-2 sm:size-2.5 rounded-full shrink-0 ${reverse ? "bg-red-300/60" : "bg-red-200/60"}`} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export function MarqueeBand() {
  const bandRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = {
          trigger: bandRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        };
        gsap.fromTo(".marquee-row-a", { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: st });
        gsap.fromTo(".marquee-row-b", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: bandRef }
  );

  return (
    <div ref={bandRef} aria-hidden="true" className="relative w-full overflow-hidden -rotate-2 -my-6 sm:-my-8 z-20">
      <div className="bg-red-950 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4 shadow-[0_16px_40px_-16px_rgb(69,10,10,0.5)] border-y border-red-900">
        <MarqueeRow className="marquee-row-a" />
        <MarqueeRow className="marquee-row-b opacity-60" reverse />
      </div>
    </div>
  );
}

/* ————————————————————————————————————————————————
   3. STATEMENT DIVIDER
   Big editorial sentence — each word inks in from faint
   to crimson as it scrolls through the viewport (scrub),
   followed by count-up stats. The "expensive magazine" effect.
———————————————————————————————————————————————— */
const STATEMENT: { text: string; accent?: boolean }[] = [
  { text: "Your" }, { text: "audience" }, { text: "is" }, { text: "already" },
  { text: "talking.", accent: true }, { text: "Loomingo" }, { text: "makes" }, { text: "every" },
  { text: "comment" }, { text: "count.", accent: true },
];

const STATS = [
  { value: 10, suffix: "x", label: "Reach amplified" },
  { value: 2, suffix: " min", label: "To launch a campaign" },
  { value: 1000, suffix: "+", label: "Creators on board" },
];

export function StatementDivider() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Word-by-word ink reveal, scrubbed to scroll
        gsap.fromTo(
          ".st-word",
          { opacity: 0.14, y: 15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".st-sentence",
              start: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Stats: count up once when they enter
        gsap.utils.toArray<HTMLElement>(".st-num").forEach((el) => {
          const target = Number(el.dataset.value || 0);
          const obj = { n: 0 };
          gsap.to(obj, {
            n: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => { el.textContent = String(Math.round(obj.n)); },
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });

        // Stat cards rise in with a stagger
        gsap.from(".st-stat", {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".st-stats",
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      // Reduced motion: everything simply visible
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".st-word", { opacity: 1, y: 0 });
        gsap.utils.toArray<HTMLElement>(".st-num").forEach((el) => {
          el.textContent = el.dataset.value || "0";
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20">
          <div className="relative z-10 max-w-4xl mx-auto px-6">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-6 sm:mb-8 text-center">
          Why creators switch
        </p>

        <h2 className="st-sentence text-3xl sm:text-5xl md:text-6xl font-medium leading-[1.15] tracking-tight text-white text-center flex flex-wrap justify-center gap-x-[0.3em] gap-y-1">
          {STATEMENT.map((w, i) => (
            <span
              key={i}
              className={`st-word will-change-transform ${w.accent ? "font-editorial text-red-600" : ""}`}
            >
              {w.text}
            </span>
          ))}
        </h2>

        <div className="st-stats grid grid-cols-3 gap-3 sm:gap-8 mt-14 sm:mt-20 max-w-2xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="st-stat text-center">
              <p className="text-3xl sm:text-5xl font-bold text-white tabular-nums tracking-tight">
                <span className="st-num" data-value={s.value}>0</span>
                <span className="text-red-600">{s.suffix}</span>
              </p>
              <p className="text-[10px] sm:text-sm text-zinc-500 font-medium mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}
