import Link from "next/link";
import Navbar from "@/components/shadcn-space/radix/blocks/navbar-01/navbar";
import OtherPagesFooter from "@/components/layout/other-pages-footer";
import { instrumentSerif } from "@/app/fonts";

export default function NotFound() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-red-950 overflow-hidden">
      {/* Deep Red Radial Gradient Background (matches About page) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0 pointer-events-none"></div>

      {/* Extra center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-40 z-0 pointer-events-none"></div>

      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <p className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm shadow-sm tracking-wider uppercase">
          Error 404
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] tracking-tight mb-6">
          This page went{" "}
          <span className={`${instrumentSerif.className} text-red-300 pr-1`}>missing</span>
        </h1>

        <p className="text-base md:text-lg text-white/70 max-w-md mb-10">
          The page you are looking for does not exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-red-950 text-sm font-semibold hover:bg-red-50 transition-colors duration-300 shadow-lg active:scale-[0.97]"
          >
            Back to Home
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/20 transition-colors duration-300 active:scale-[0.97]"
          >
            Visit Help Center
          </Link>
        </div>
      </div>

      {/* Footer finishes the page */}
      <footer className="relative z-10">
        <OtherPagesFooter />
      </footer>
    </main>
  );
}
