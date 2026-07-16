"use client";

import { Store } from "@/lib/store";
import { Edit, Image as ImageIcon, Share2, Check } from "lucide-react";
import { useState } from "react";

export function StoreHeader({ store, onEdit }: { store: Store, onEdit?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shop/${store.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full">
      {/* Banner */}
      <div className="w-full aspect-[3/1] bg-zinc-100 overflow-hidden relative">
        {store.banner ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={store.banner} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
            <ImageIcon className="size-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">No Banner</span>
          </div>
        )}
        
        {/* Dark gradient overlay for text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Store Info Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative pb-6">
        <div 
          className="bg-white rounded-3xl shadow-xl border-t-4 p-5 sm:p-8 -mt-16 relative"
          style={{ borderTopColor: store.themeColor || '#dc2626' }}
        >
          {/* Logo and Buttons Row */}
          <div className="flex justify-between items-start -mt-14 sm:-mt-20 mb-3 sm:mb-4">
            
            {/* Logo */}
            {store.logoUrl ? (
              <div className="rounded-full border-4 border-white shadow-md bg-zinc-50 overflow-hidden size-24 sm:size-32 shrink-0">
                <img src={store.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-full border-4 border-white shadow-md bg-zinc-100 flex items-center justify-center size-24 sm:size-32 shrink-0 text-zinc-400">
                <ImageIcon className="size-10 sm:size-12 opacity-50" />
              </div>
            )}

            {/* Buttons aligned right, pushed down to sit beside text */}
            <div className="flex items-center gap-2 shrink-0 pt-16 sm:pt-24">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 size-10 sm:size-auto sm:py-2.5 bg-zinc-100 text-zinc-900 rounded-xl font-semibold hover:bg-zinc-200 transition active:scale-95"
                title="Share Store"
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />}
                <span className="hidden sm:inline">Share</span>
              </button>

              {onEdit && (
                <button 
                  onClick={onEdit}
                  className="flex items-center justify-center size-10 sm:size-11 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition shadow-sm active:scale-95"
                  title="Edit Store"
                >
                  <Edit className="size-4 sm:size-5" />
                </button>
              )}
            </div>
          </div>

          {/* Store Text Info */}
          <div className="flex-1 mt-1 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-1">{store.name}</h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base mb-3">by {store.creator || "Anonymous"}</p>
            {store.description && (
              <p className="text-zinc-600 leading-relaxed max-w-2xl text-sm sm:text-base">{store.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
