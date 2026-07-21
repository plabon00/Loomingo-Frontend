"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";

const STORAGE_KEY = "loomingo_promo_dismissed_v1";
const ROTATE_MS = 5000;

// `highlight` is the phrase that gets the sketchy underline.
const messages = [
  {
    pre: "We're in development. ",
    highlight: "Everything is free",
    post: " while we build. Enjoy.",
    href: null,
    linkLabel: null,
  },
  {
    pre: "New: ",
    highlight: "Storefront",
    post: ". Sell digital products right from your profile.",
    href: "/store",
    linkLabel: "Try it",
  },
  {
    pre: "New: ",
    highlight: "Invoice Studio",
    post: ". Branded PDF invoices in seconds.",
    href: "/apps/invoice-generator",
    linkLabel: "Try it",
  },
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // sessionStorage is per-tab: dismissal sticks for this tab's session,
    // but every new tab/window shows the bar again.
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  // Drive nav offsets + body padding from one CSS var so fixed headers and
  // page content all shift together while the bar is visible.
  useEffect(() => {
    document.documentElement.style.setProperty("--promo-h", dismissed ? "0px" : "40px");
    return () => {
      document.documentElement.style.setProperty("--promo-h", "0px");
    };
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [dismissed, paused]);

  if (dismissed) return null;

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  const msg = messages[index];

  return (
    <div
      role="region"
      aria-label="Announcement"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="font-apple fixed inset-x-0 top-0 z-[95] h-10 bg-zinc-950 text-[#f5f5f7]"
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-center gap-2 px-10 md:px-6">
        {/* aria-live so screen readers hear rotations; single line, clips on tiny screens */}
        <p aria-live="polite" className="min-w-0 overflow-hidden whitespace-nowrap text-center text-[12px] md:text-[14px] font-medium">
          {/* key re-mounts the Highlighter each rotation so the underline redraws */}
          <span key={index} className="promo-msg inline-block pb-0.5">
            {msg.pre}
            <Highlighter action="underline" color="#6bb5ff" strokeWidth={2} animationDuration={700} padding={1}>
              {msg.highlight}
            </Highlighter>
            {msg.post}
            {msg.href && (
              <Link
                href={msg.href}
                className="ml-2 text-[#6bb5ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6bb5ff] focus-visible:outline-offset-2 rounded"
              >
                {msg.linkLabel} ›
              </Link>
            )}
          </span>
        </p>

        {/* rotation dots */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0 ml-2" aria-hidden="true">
          {messages.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-[240ms] ${
                i === index ? "w-4 bg-white/90" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
