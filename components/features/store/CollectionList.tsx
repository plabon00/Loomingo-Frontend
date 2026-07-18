"use client";

import { useState } from "react";
import { Share2, Trash2, Check, PackageOpen, FolderOpen, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ProductCollection } from "@/lib/store";

interface CollectionListProps {
  collections: ProductCollection[];
  onDelete: (id: string) => void;
  themeColor?: string;
}

export function CollectionList({ collections, onDelete, themeColor }: CollectionListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const accent = themeColor || "#dc2626";

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 sm:py-20 bg-white/60 backdrop-blur rounded-2xl border border-dashed border-zinc-300">
        <FolderOpen className="size-10 mb-3 text-zinc-300" />
        <p className="font-editorial text-lg text-zinc-500">No collections yet</p>
        <p className="text-sm text-zinc-400 mt-1 max-w-xs">Select products and create a collection to share curated picks with anyone.</p>
      </div>
    );
  }

  const handleShare = (e: React.MouseEvent, collection: ProductCollection) => {
    e.stopPropagation();
    const link = `${window.location.origin}/shop/collection/${collection.shareToken}`;
    navigator.clipboard.writeText(link);
    setCopiedId(collection.id);
    setTimeout(() => setCopiedId(null), 2000);

    if (navigator.share) {
      navigator.share({ title: collection.name, url: link }).catch(() => {});
    }
  };

  const handleDelete = async (e: React.MouseEvent, collection: ProductCollection) => {
    e.stopPropagation();
    setDeletingId(collection.id);
    await onDelete(collection.id);
    setDeletingId(null);
  };

  const handleCardClick = (collection: ProductCollection) => {
    window.open(`/shop/collection/${collection.shareToken}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <AnimatePresence mode="popLayout">
        {collections.map((collection, index) => {
          const productCount = Array.isArray(collection.productIds)
            ? collection.productIds.length
            : JSON.parse(collection.productIds as any || "[]").length;

          return (
            <motion.div
              layout
              key={collection.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.3) }}
              onClick={() => handleCardClick(collection)}
              className="group relative bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
            >

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  {collection.thumbnailUrl ? (
                    <div className="w-full aspect-[2/1] rounded-xl overflow-hidden mb-3 bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={collection.thumbnailUrl} alt={collection.name} className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  <h3 className="text-base font-bold text-zinc-950 truncate">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{collection.description}</p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-1 mt-1">
                  <button
                    onClick={(e) => handleShare(e, collection)}
                    className="size-8 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-all cursor-pointer"
                    aria-label="Copy share link"
                  >
                    {copiedId === collection.id ? <Check className="size-3.5 text-green-600" /> : <Share2 className="size-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, collection)}
                    disabled={deletingId === collection.id}
                    className="size-8 rounded-full bg-zinc-50 hover:bg-red-50 flex items-center justify-center text-zinc-600 hover:text-red-600 transition-all cursor-pointer disabled:opacity-50"
                    aria-label="Delete collection"
                  >
                    {deletingId === collection.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <PackageOpen className="size-3" />
                    {productCount} {productCount === 1 ? "item" : "items"}
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(collection.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <ChevronRight className="size-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
