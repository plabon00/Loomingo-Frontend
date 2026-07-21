"use client";

import { useState } from "react";
import ProductGrid from "@/components/features/store/ProductGrid";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { useAuthUser } from "@/hooks/use-auth-user";
import { GridBackground } from "@/components/ui/grid-background";
import type { ProductCollection } from "@/lib/store";
import { Share2, Check, ArrowLeft, PackageOpen, FolderOpen } from "lucide-react";
import { motion } from "motion/react";

export function CollectionViewClient({ collection }: { collection: ProductCollection }) {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const inApp = !isAuthLoading && !!user;
  const [copied, setCopied] = useState(false);

  const store = collection.store;
  const products = collection.products || [];
  const accent = store?.themeColor || "#dc2626";

  const handleShare = async () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (navigator.share) {
      try {
        await navigator.share({
          title: collection.name,
          url,
        });
      } catch (e) {
        // user cancelled
      }
    }
  };

  return (
    <GridBackground themeColor={accent} className={`bg-zinc-200 min-h-screen ${inApp ? "pt-[calc(3.5rem+var(--promo-h,0px))] md:pt-[calc(3rem+var(--promo-h,0px))] pb-20 md:pb-0" : "pb-8"}`}>
      {inApp && (
        <>
          <MobileNavbar />
          <DesktopSidebar />
          <BottomDock />
        </>
      )}

      {/* ─── Collection Header ──────────────────────────────────────── */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-zinc-950/10 p-6 sm:p-8 relative shadow-[0_1px_2px_rgb(0,0,0,0.04),0_12px_32px_-12px_rgb(0,0,0,0.12)]"
          >
            {/* Accent top bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 rounded-l-2xl" style={{ backgroundColor: accent }} aria-hidden="true" />

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
              {/* Collection icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                className="shrink-0"
              >
                <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200/50 flex items-center justify-center shadow-sm">
                  <FolderOpen className="size-8 sm:size-10 text-violet-500" />
                </div>
              </motion.div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                {store && (
                  <a
                    href={`/shop/${store.id}`}
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-1.5 hover:underline transition-colors"
                    style={{ color: accent }}
                  >
                    <ArrowLeft className="size-3" />
                    {store.name}
                  </a>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950">
                  {collection.name}
                </h1>
                {collection.description && (
                  <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed max-w-3xl mt-2 line-clamp-2 sm:line-clamp-none border-l-2 border-zinc-200 pl-3">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
                    <PackageOpen className="size-3" />
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>
                  {store?.creator && (
                    <span className="text-sm text-zinc-500">
                      curated <span className="font-editorial text-base text-zinc-700">by {store.creator}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Share button */}
              <div className="shrink-0 w-full sm:w-auto">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-5 bg-white text-zinc-800 border border-zinc-300 rounded-xl text-sm font-semibold hover:border-zinc-950 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  title="Share Collection"
                >
                  {copied ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />}
                  <span>{copied ? "Copied" : "Share"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Products Grid ──────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-zinc-100 shadow-sm">
            <PackageOpen className="size-10 mx-auto mb-3 text-zinc-300" />
            <p className="text-zinc-500 font-medium">This collection is empty.</p>
            <p className="text-zinc-400 text-sm mt-1">Products may have been removed by the creator.</p>
          </div>
        ) : (
          <ProductGrid
            products={products}
            themeColor={accent}
          />
        )}
      </main>
    </GridBackground>
  );
}
