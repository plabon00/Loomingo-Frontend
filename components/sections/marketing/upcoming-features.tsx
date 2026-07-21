"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Trophy, Link2, CalendarClock, LineChart } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  {
    label: "Core",
    title: "AI Reply Assistant",
    description: "On-brand replies drafted for every conversation, from one short prompt.",
    icon: Sparkles,
    status: "In design",
  },
  {
    label: "Engage",
    title: "Winner Selector",
    description: "Pick giveaway winners fairly, straight from your comments.",
    icon: Trophy,
    status: "Soon",
  },
  {
    label: "Convert",
    title: "Link in Bio",
    description: "One tidy page for every link you share with your audience.",
    icon: Link2,
    status: "Soon",
  },
  {
    label: "Publish",
    title: "Post Scheduler",
    description: "Plan and queue posts and Reels weeks ahead.",
    icon: CalendarClock,
    status: "Planned",
  },
  {
    label: "Measure",
    title: "Growth Analytics",
    description: "See what drives DMs, clicks, and followers over time.",
    icon: LineChart,
    status: "Planned",
  },
];

export default function UpcomingFeatures() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".roadmap-head", {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        });
        gsap.from(".roadmap-row", {
          opacity: 0,
          y: 22,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".roadmap-list", start: "top 82%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="font-apple w-full max-w-4xl mx-auto px-6">
      <div className="roadmap-head text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-3">
          Roadmap
        </p>
        <h2 className="apple-display text-[34px] md:text-[48px]">
          Everything you need. In one place.
        </h2>
        <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] mt-4 max-w-xl mx-auto">
          What we&apos;re building next for creators.
        </p>
      </div>

      {/* Flat editorial list — hairline dividers, no cards */}
      <ul className="roadmap-list mt-14 md:mt-16 divide-y divide-[var(--apple-hairline)] border-y border-[var(--apple-hairline)]">
        {features.map((f) => (
          <li
            key={f.title}
            className="roadmap-row group flex items-center gap-5 md:gap-8 py-6 md:py-7 transition-colors duration-[240ms]"
          >
            <f.icon
              className="size-6 md:size-7 shrink-0 text-[var(--apple-ink)] transition-colors duration-[240ms] group-hover:text-[var(--apple-blue)]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-[21px] md:text-[28px] font-semibold tracking-tight text-[var(--apple-ink)]">
                  {f.title}
                </h3>
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-gray-2)]">
                  {f.label}
                </span>
              </div>
              <p className="text-[17px] leading-relaxed text-[var(--apple-gray)] mt-1.5 max-w-xl">
                {f.description}
              </p>
            </div>
            <span className="hidden sm:inline text-[14px] font-medium text-[var(--apple-gray-2)] whitespace-nowrap tabular-nums">
              {f.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-[14px] text-[var(--apple-gray-2)]">
        Shipping through 2026. Storefront and Invoice Studio are live today.
      </p>
    </section>
  );
}
