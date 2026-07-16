"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Share2, ExternalLink, Check, Edit2, Trash2, MoreVertical } from "lucide-react";
import { Product } from "@/lib/store";
import { toast } from "sonner";

export function ProductPreviewModal({
  product,
  onClose,
  themeColor,
  onEdit,
  onDelete
}: {
  product: Product;
  onClose: () => void;
  themeColor?: string;
  onEdit?: (p: Product) => void;
  onDelete?: (id: string) => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const images = product.images?.length > 0 ? product.images : [""];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = product.code || product.id;
    const url = `${window.location.origin}/shop/${product.storeId}/${code}`;
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Product link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: url
        });
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-zinc-900"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl relative w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2.5 bg-white/90 backdrop-blur text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 shadow-sm transition active:scale-95"
            title="Share product"
          >
            {copied ? <Check className="size-4 text-green-600" /> : <Share2 className="size-4" />}
          </button>

          {(onEdit || onDelete) && (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="p-2.5 bg-white/90 backdrop-blur text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 shadow-sm transition active:scale-95"
              >
                <MoreVertical className="size-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden py-1 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-50 mb-1">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</span>
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-600">
                      <X className="size-3" />
                    </button>
                  </div>
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClose(); onEdit(product); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 flex items-center gap-2.5 transition"
                    >
                      <Edit2 className="size-4" /> Edit Product
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClose(); onDelete(product.id); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2.5 transition"
                    >
                      <Trash2 className="size-4" /> Delete Product
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={onClose} 
            className="p-2.5 bg-white/90 backdrop-blur text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 shadow-sm transition active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Left Side - Image Carousel */}
        <div className="relative w-full md:w-1/2 aspect-square bg-zinc-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 shrink-0">
          {images[currentImage] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={images[currentImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-zinc-400 font-medium">No image</div>
          )}

          {hasMultipleImages && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-zinc-700 hover:bg-white hover:text-zinc-900 shadow border border-zinc-200 transition"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-zinc-700 hover:bg-white hover:text-zinc-900 shadow border border-zinc-200 transition"
              >
                <ChevronRight className="size-5" />
              </button>
              
              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`size-2 rounded-full transition-all ${idx === currentImage ? "bg-zinc-800 w-4" : "bg-zinc-300"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="flex flex-col p-6 md:p-8 w-full md:w-1/2 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 pr-8 md:pr-16">{product.name}</h2>
              {product.price != null && (
                <div className="text-xl font-bold text-green-600 mt-1">${Number(product.price).toFixed(2)}</div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">Description</h3>
            <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <button 
              onClick={() => {
                if (product.isWhatsapp && product.whatsappNumber) {
                  const productLink = `${window.location.origin}/shop/${product.storeId}/${product.code || product.id}`;
                  const msg = encodeURIComponent(`Hi, I would like to purchase ${product.name} for $${Number(product.price).toFixed(2)}.\n\nProduct Link: ${productLink}`);
                  window.open(`https://wa.me/${product.whatsappNumber}?text=${msg}`, "_blank");
                } else {
                  window.open(product.link || "#", "_blank");
                }
              }}
              style={{ backgroundColor: themeColor || '#dc2626' }}
              className="flex w-full items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              Get it now <ExternalLink className="size-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
