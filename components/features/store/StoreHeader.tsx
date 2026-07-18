"use client";

import { Store } from "@/lib/store";
import { Edit2, Image as ImageIcon, Share2, Check, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function StoreHeader({ store, onEdit }: { store: Store, onEdit?: () => void }) {
  const [copied, setCopied] = useState(false);
  const accent = store.themeColor || "#dc2626";
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate the main card floating up
    tl.fromTo(".gsap-store-card", 
      { opacity: 0, y: 24 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
    
    // Stagger in the logo, text content, and buttons
    tl.fromTo([".gsap-store-logo", ".gsap-store-text", ".gsap-store-btn"],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.3"
    );
  }, { scope: containerRef });

  const handleShare = async () => {
    const url = `${window.location.origin}/shop/${store.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Store link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);

    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          url: url
        });
      } catch (e) {
        // user cancelled or error
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center" ref={containerRef}>
      {/* Premium Hero Banner */}
      <div className="w-full h-56 sm:h-72 lg:h-[22rem] bg-zinc-100 overflow-hidden relative">
        {store.banner ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={store.banner} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-zinc-400"
            style={{ background: `linear-gradient(135deg, ${accent}0a, ${accent}1f 60%, ${accent}0a)` }}
          >
            <ImageIcon className="size-10 mb-2 opacity-30" />
          </div>
        )}

        {/* Subtle bottom gradient for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Store Info Container */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 z-10 pb-8">
        <div className="gsap-store-card bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center">
          
          {/* Accent ink edge */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl" style={{ backgroundColor: accent }} aria-hidden="true" />

          {/* Logo */}
          <div className="gsap-store-logo shrink-0 -mt-14 sm:-mt-20 lg:-mt-24 shadow-2xl rounded-3xl bg-white p-1.5">
            <div className="rounded-2xl overflow-hidden size-24 sm:size-32 lg:size-40 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="size-10 sm:size-12 opacity-50" />
              )}
            </div>
          </div>

          {/* Text Info */}
          <div className="gsap-store-text flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>
              <Sparkles className="size-3.5" aria-hidden="true" />
              Your storefront
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 truncate pb-1">
              {store.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 mt-1 mb-4 flex items-center gap-1.5">
              curated <span className="font-editorial text-lg text-zinc-700">by {store.creator || "Anonymous"}</span>
            </p>
            {store.description && (
              <div className="border-l-2 border-zinc-200/60 pl-4 py-1">
                <p className="text-[15px] sm:text-base text-zinc-600 leading-relaxed max-w-3xl line-clamp-3">
                  {store.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="gsap-store-btn flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 h-12 px-6 bg-white text-zinc-800 border border-zinc-200 rounded-2xl text-[15px] font-semibold hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm transition-all duration-300 cursor-pointer"
              title="Share Store"
            >
              {copied ? <Check className="size-4.5 text-green-600" /> : <Share2 className="size-4.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>

            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 h-12 px-6 bg-zinc-900 text-white rounded-2xl text-[15px] font-semibold hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md transition-all duration-300 cursor-pointer"
                title="Edit Store"
              >
                <Edit2 className="size-4.5" />
                <span>Edit Info</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
