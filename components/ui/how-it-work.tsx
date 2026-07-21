"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, ScanSearch, ShieldCheck, Send } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    id: 1,
    tag: "Trigger",
    title: "Someone comments",
    description: "A follower drops your trigger word under any post or Reel.",
    icon: MessageCircle,
  },
  {
    id: 2,
    tag: "Detect",
    title: "Keyword matched",
    description: "Loomingo spots the match the moment the comment lands.",
    icon: ScanSearch,
  },
  {
    id: 3,
    tag: "Protect",
    title: "Safety checks run",
    description: "A human-like delay and throttle run before anything sends.",
    icon: ShieldCheck,
  },
  {
    id: 4,
    tag: "Deliver",
    title: "DM lands in inbox",
    description: "Your message and link go straight to their DMs.",
    icon: Send,
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".flow-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        });
        gsap.from(".flow-line-v", {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        });
        gsap.from(".flow-node", {
          scale: 0,
          duration: 0.45,
          ease: "back.out(2)",
          stagger: 0.18,
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        });
        gsap.from(".flow-step", {
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="font-apple w-full max-w-5xl mx-auto px-6 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-3">
        The flow
      </p>
      <h2 className="apple-display text-[34px] md:text-[48px]">
        Comment in. DM out.
      </h2>
      <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] mt-4 max-w-xl mx-auto">
        Four things happen between a comment and a delivered DM.
      </p>

      <div className="relative mt-16 md:mt-20">
        {/* connector lines */}
        <div className="flow-line hidden md:block absolute left-[12.5%] right-[12.5%] top-6 h-px bg-[var(--apple-hairline)]" />
        <div className="flow-line-v md:hidden absolute left-6 top-6 bottom-8 w-px bg-[var(--apple-hairline)]" />

        <ol className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
          {steps.map((step) => (
            <li
              key={step.id}
              className="flow-step relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 text-left md:text-center"
            >
              {/* node */}
              <span className="flow-node relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--apple-surface)] ring-1 ring-[var(--apple-hairline)] text-[var(--apple-blue)] md:mb-7">
                <step.icon className="size-5" aria-hidden="true" />
              </span>

              <div className="flex-1 md:flex-none">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-blue)] mb-2">
                  {step.tag}
                </p>
                <h3 className="text-[21px] font-semibold tracking-tight text-[var(--apple-ink)]">
                  {step.title}
                </h3>
                <p className="text-[17px] leading-relaxed text-[var(--apple-gray)] mt-2 md:max-w-[15rem] md:mx-auto">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
