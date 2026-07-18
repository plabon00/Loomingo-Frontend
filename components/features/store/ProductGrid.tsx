"use client";

import { useState } from "react";
import { Edit2, Trash2, ArrowUpRight, Share2, Check, Plus, PackageOpen, CheckCircle2 } from "lucide-react";
import type { Product } from "@/lib/store";
import { ProductPreviewModal } from "@/components/modals/product-preview-modal";
import { motion, AnimatePresence } from "motion/react";

const cardTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  onAddProduct,
  initialPreviewProduct,
  themeColor,
  selectionMode = false,
  selectedIds = [],
  onToggleSelect,
}: {
  products: Product[];
  onEdit?: (p: Product) => void;
  onDelete?: (id: string) => void;
  onAddProduct?: () => void;
  initialPreviewProduct?: Product | null;
  themeColor?: string;
  selectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}) {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(initialPreviewProduct || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const accent = themeColor || "#dc2626";

  if (products.length === 0 && !onAddProduct) {
    return (
      <div className="flex flex-col items-center text-center py-20 text-zinc-400 text-sm border border-dashed border-zinc-300 rounded-2xl bg-white/60">
        <PackageOpen className="size-8 mb-3 opacity-40" />
        <p className="font-editorial text-lg text-zinc-500">Nothing on the shelves yet.</p>
      </div>
    );
  }

  const handleShare = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    const code = p.code || p.id;
    navigator.clipboard.writeText(`${window.location.origin}/shop/${p.storeId}/${code}`);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    onEdit?.(p);
  };

  const handleDelete = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    onDelete?.(p.id);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {onAddProduct && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardTransition}
            onClick={onAddProduct}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onAddProduct(); } }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-white/70 hover:border-zinc-950 transition-colors duration-300 h-full min-h-[220px] sm:min-h-[320px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            <div
              className="size-14 rounded-full flex items-center justify-center mb-4 text-white transition-transform duration-300 group-hover:rotate-90"
              style={{ backgroundColor: accent }}
            >
              <Plus className="size-6" />
            </div>
            <span className="font-semibold text-sm text-zinc-800">Add New Product</span>
            <span className="font-editorial text-sm text-zinc-500 mt-1">stock your shelves</span>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {products.map((p, index) => (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
              transition={{ ...cardTransition, delay: Math.min(index * 0.05, 0.4) }}
              onClick={() => {
                if (selectionMode && onToggleSelect) {
                  onToggleSelect(p.id);
                } else {
                  setPreviewProduct(p);
                }
              }}
              className={`group relative flex flex-col overflow-hidden bg-white transition-all duration-300 h-full cursor-pointer ${
                selectionMode && selectedIds.includes(p.id)
                  ? "border-violet-600 border-2 rounded-lg"
                  : "border border-zinc-200 rounded-lg hover:shadow-md"
              }`}
            >
              {/* Image Section */}
              <div className="aspect-[4/5] bg-zinc-50 relative overflow-hidden">
                {/* Selection checkbox overlay */}
                {selectionMode && (
                  <div className={`absolute top-2.5 left-2.5 z-20 size-7 flex items-center justify-center transition-all duration-200 border-2 ${
                    selectedIds.includes(p.id)
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "bg-white border-zinc-900 text-zinc-400"
                  }`}>
                    {selectedIds.includes(p.id) && (
                      <CheckCircle2 className="size-5" />
                    )}
                  </div>
                )}
                {p.images[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                    <PackageOpen className="size-8" />
                  </div>
                )}
                {/* Price tag in image - removing, we will put it below like the sample */}

                {/* Action Overlay */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-1 sm:group-hover:translate-x-0 transition-all duration-200">
                  <button
                    onClick={(e) => handleShare(e, p)}
                    className="size-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-zinc-950 shadow-sm border border-zinc-950/10 transition-all duration-150 active:scale-90 cursor-pointer"
                    aria-label="Share product"
                  >
                    {copiedId === p.id ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />}
                  </button>

                  {onEdit && (
                    <button
                      onClick={(e) => handleEdit(e, p)}
                      className="size-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-zinc-950 shadow-sm border border-zinc-950/10 transition-all duration-150 active:scale-90 cursor-pointer"
                      aria-label="Edit product"
                    >
                      <Edit2 className="size-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => handleDelete(e, p)}
                      className="size-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-red-600 shadow-sm border border-zinc-950/10 transition-all duration-150 active:scale-90 cursor-pointer"
                      aria-label="Delete product"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-[15px] font-bold text-zinc-900 truncate tracking-tight">{p.name}</h3>
                {p.description && (
                  <p className="text-[13px] text-zinc-500 truncate mt-0.5">{p.description}</p>
                )}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[16px] font-bold text-zinc-900">
                    {p.price != null ? `₹${Number(p.price).toFixed(0)}` : 'Price on request'}
                  </span>
                </div>
              </div>

              {/* Action buttons (only in non-selection mode) */}
              {!selectionMode && (
                <div className="px-3 pb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.isWhatsapp && p.whatsappNumber) {
                        const productLink = `${window.location.origin}/shop/${p.storeId}/${p.code || p.id}`;
                        const msg = encodeURIComponent(`Hi, I would like to purchase ${p.name} for ₹${Number(p.price).toFixed(2)}.\n\nProduct Link: ${productLink}`);
                        window.open(`https://wa.me/${p.whatsappNumber}?text=${msg}`, "_blank");
                      } else {
                        window.open(p.link || "#", "_blank");
                      }
                    }}
                    style={{ backgroundColor: accent }}
                    className="group/btn w-full h-9 sm:h-10 flex items-center justify-center gap-1.5 text-white text-[13px] font-bold rounded-md hover:brightness-105 transition-all cursor-pointer"
                  >
                    Get it now
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
          themeColor={themeColor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
