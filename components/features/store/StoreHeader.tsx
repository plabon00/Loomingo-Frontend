"use client";

import { Store } from "@/lib/store";
import { Edit2, Image as ImageIcon, Share2, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function StoreHeader({ store, onEdit }: { store: Store, onEdit?: () => void }) {
  const [copied, setCopied] = useState(false);
  const accent = store.themeColor || "#dc2626";

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
    <div className="relative w-full">
      {/* Banner */}
      <div className="w-full aspect-[4/1] sm:aspect-[5/1] lg:aspect-[6/1] bg-zinc-100 overflow-hidden relative">
        {store.banner ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={store.banner} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-zinc-400"
            style={{ background: `linear-gradient(135deg, ${accent}0a, ${accent}1f 60%, ${accent}0a)` }}
          >
            <ImageIcon className="size-8 mb-2 opacity-30" />
          </div>
        )}

        {/* Grain-ish gradient so the card edge reads against any banner */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Store Info Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-zinc-950/10 p-6 sm:p-8 -mt-12 sm:-mt-16 lg:-mt-20 relative shadow-[0_1px_2px_rgb(0,0,0,0.04),0_12px_32px_-12px_rgb(0,0,0,0.12)] flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center"
        >
          {/* Accent ink edge — ties the card to the store's brand color */}
          <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 rounded-l-2xl" style={{ backgroundColor: accent }} aria-hidden="true" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
            className="-mt-14 sm:-mt-20 lg:-mt-24 shrink-0 pl-2 sm:pl-1"
          >
            {store.logoUrl ? (
              <div className="rounded-2xl border-4 border-white shadow-[0_8px_24px_-8px_rgb(0,0,0,0.25)] bg-zinc-50 overflow-hidden size-24 sm:size-32 lg:size-36">
                <img src={store.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-2xl border-4 border-white shadow-[0_8px_24px_-8px_rgb(0,0,0,0.25)] bg-zinc-50 flex items-center justify-center size-24 sm:size-32 lg:size-36 text-zinc-300">
                <ImageIcon className="size-10 sm:size-12 opacity-50" />
              </div>
            )}
          </motion.div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 pl-2 sm:pl-0">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: accent }}>
              <Sparkles className="size-3" aria-hidden="true" />
              Your storefront
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 truncate">
              {store.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-1 mb-3 sm:mb-2">
              curated <span className="font-editorial text-base text-zinc-700">by {store.creator || "Anonymous"}</span>
            </p>
            {store.description && (
              <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none border-l-2 border-zinc-200 pl-3">
                {store.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pl-2 sm:pl-0">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-5 bg-white text-zinc-800 border border-zinc-300 rounded-xl text-sm font-semibold hover:border-zinc-950 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              title="Share Store"
            >
              {copied ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </motion.button>

            {onEdit && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onEdit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-5 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors duration-200 cursor-pointer shadow-[0_4px_12px_-4px_rgb(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                title="Edit Store"
              >
                <Edit2 className="size-4" />
                <span>Edit</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
