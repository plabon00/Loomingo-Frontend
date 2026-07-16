import { Play, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GettingStartedGuide() {
  return (
    <div className="bg-white border border-zinc-200 rounded-[2rem] p-2 shadow-sm flex flex-col md:flex-row gap-4 items-center overflow-hidden">

      {/* Video Thumbnail Area - links to the getting started guide */}
      <Link
        href="/help/getting-started"
        aria-label="Watch the getting started guide"
        className="relative block w-full md:w-48 h-32 bg-zinc-100 rounded-3xl overflow-hidden shrink-0 group cursor-pointer border border-zinc-200/50"
      >
        {/* Replace the src below with your actual thumbnail image */}
        <img
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"
          alt="Video Thumbnail"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-red-950/20 group-hover:bg-transparent transition-colors duration-300" />

        {/* Play Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="size-4 text-red-600 ml-1" />
        </div>
      </Link>

      {/* Text & Links Content */}
      <div className="flex-1 p-4 md:p-2 md:pr-6 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">
          <BookOpen className="size-3" /> Quick Start
        </div>
        <h3 className="text-lg font-medium text-red-950 mb-1">
          How to set up your first auto-DM
        </h3>
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
          Watch our 2-minute crash course on connecting your posts, setting up keywords, and capturing leads while you sleep.
        </p>

        <Link href="/help/getting-started" className="inline-flex items-center text-sm font-semibold text-red-950 hover:text-red-600 transition-colors group">
          Read the full guide
          <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </div>
  );
}
