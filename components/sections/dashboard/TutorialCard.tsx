import { Play, Clock3, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function GettingStartedGuide() {
  return (
    <div className="font-apple w-full max-w-5xl mx-auto px-6 text-center">
      {/* Centered header — same pattern as every other band */}
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-3">
        Quick start
      </p>
      <h2 className="apple-display text-[34px] md:text-[48px]">
        Set up your first auto-DM
      </h2>
      <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] mt-4 max-w-xl mx-auto">
        A two-minute crash course on connecting posts, setting keywords, and capturing leads while you sleep.
      </p>

      {/* Video thumbnail — flat, centered */}
      <Link
        href="/help/getting-started"
        aria-label="Watch the getting started guide"
        className="group relative block w-full max-w-2xl mx-auto aspect-video rounded-[18px] bg-[var(--apple-surface-alt)] overflow-hidden mt-12 md:mt-16 cursor-pointer transition-transform duration-[320ms] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-4"
      >
        <img
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
          alt="Getting started guide preview"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms]"
        />
        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-[320ms]" />

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-medium text-white">
          <Clock3 className="size-3" aria-hidden="true" />
          2 min
        </span>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-16 items-center justify-center rounded-full bg-white/95 shadow-lg group-hover:scale-110 transition-transform duration-[320ms]">
          <Play className="size-6 text-[var(--apple-ink)] ml-0.5 fill-current" aria-hidden="true" />
        </div>
      </Link>

      <Link
        href="/help/getting-started"
        className="apple-link inline-flex items-center gap-1 text-[17px] mt-8 group/link"
      >
        Read the full guide
        <ChevronRight className="size-4 transition-transform duration-[240ms] group-hover/link:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}
