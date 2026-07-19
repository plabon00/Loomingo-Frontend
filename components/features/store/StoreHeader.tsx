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

  const isOwner = !!onEdit;

  return (
    <div className="relative w-full flex flex-col items-center" ref={containerRef}>
      {/* Premium Hero Banner */}
      <div className="w-full h-48 sm:h-56 lg:h-[18rem] bg-zinc-100 overflow-hidden relative">
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
      <div className="w-full max-w-5xl px-4 sm:px-6 relative -mt-12 sm:-mt-16 z-10 pb-6">
        <div 
          className="gsap-store-card bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/50 p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center relative"
          style={{ boxShadow: `0 10px 40px -10px ${accent}20, 0 1px 3px ${accent}10` }}
        >
          {/* Decorative background elements (clipped to card radius) */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            {/* Subtle gradient glow behind the card */}
            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at top left, ${accent}, transparent 70%)` }} />
            
            {/* Accent ink edge */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} aria-hidden="true" />
          </div>

          {/* Logo */}
          <div className="gsap-store-logo shrink-0 -mt-10 sm:-mt-14 lg:-mt-16 shadow-lg rounded-2xl bg-white p-1 z-10">
            <div className="rounded-xl overflow-hidden size-16 sm:size-24 lg:size-28 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="size-8 sm:size-10 opacity-50" />
              )}
            </div>
          </div>

          {/* Text Info */}
          <div className="gsap-store-text flex-1 min-w-0 z-10">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>
              <Sparkles className="size-3" aria-hidden="true" />
              {isOwner ? "Your storefront" : "Storefront"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 truncate pb-0.5">
              {store.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-1 mb-2 flex items-center gap-1.5">
              curated <span className="font-editorial text-base text-zinc-700">by {store.creator || "Anonymous"}</span>
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
