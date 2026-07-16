"use client";

import { useState } from "react";
import { Edit2, Trash2, ExternalLink, Share2, Check, Plus } from "lucide-react";
import type { Product } from "@/lib/store";
import { ProductPreviewModal } from "@/components/modals/product-preview-modal";

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  onAddProduct,
  initialPreviewProduct,
  themeColor,
}: {
  products: Product[];
  onEdit?: (p: Product) => void;
  onDelete?: (id: string) => void;
  onAddProduct?: () => void;
  initialPreviewProduct?: Product | null;
  themeColor?: string;
}) {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(initialPreviewProduct || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (products.length === 0 && !onAddProduct) {
    return (
      <div className="text-center py-20 text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-3xl">
        No products yet.
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {onAddProduct && (
          <div
            onClick={onAddProduct}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors h-full min-h-[260px] cursor-pointer"
          >
            <div className="size-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm" style={{ backgroundColor: themeColor || '#dc2626', color: 'white' }}>
              <Plus className="size-6" />
            </div>
            <span className="font-semibold text-sm text-zinc-600">Add Product</span>
          </div>
        )}
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => setPreviewProduct(p)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer"
          >
            {/* Image Section */}
            <div className="aspect-square bg-zinc-50 relative overflow-hidden border-b border-zinc-100">
              {p.images[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-medium text-sm">No Image</div>
              )}
              
              {/* Action Overlay */}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                
                <button
                  onClick={(e) => handleShare(e, p)}
                  className="size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-blue-600 shadow-sm border border-zinc-200 transition"
                  aria-label="Share product"
                >
                  {copiedId === p.id ? <Check className="size-3.5 text-green-600" /> : <Share2 className="size-3.5" />}
                </button>

                {onEdit && (
                  <button
                    onClick={(e) => handleEdit(e, p)}
                    className="size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-red-600 shadow-sm border border-zinc-200 transition"
                    aria-label="Edit product"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(e, p)}
                    className="size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-zinc-600 hover:text-red-600 shadow-sm border border-zinc-200 transition"
                    aria-label="Delete product"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Details Section */}
            <div className="p-3 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-sm font-semibold text-zinc-900 truncate">{p.name}</h3>
                {p.price != null && (
                  <span className="text-sm font-bold text-green-600 shrink-0">${Number(p.price).toFixed(2)}</span>
                )}
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 flex-1 mb-3">{p.description}</p>
              
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (p.isWhatsapp && p.whatsappNumber) {
                    const productLink = `${window.location.origin}/shop/${p.storeId}/${p.code || p.id}`;
                    const msg = encodeURIComponent(`Hi, I would like to purchase ${p.name} for $${Number(p.price).toFixed(2)}.\n\nProduct Link: ${productLink}`);
                    window.open(`https://wa.me/${p.whatsappNumber}?text=${msg}`, "_blank");
                  } else {
                    window.open(p.link || "#", "_blank"); 
                  }
                }}
                style={{ backgroundColor: themeColor || '#dc2626' }}
                className="w-full py-2 flex items-center justify-center gap-1.5 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Get it now <ExternalLink className="size-3" />
              </button>
            </div>
          </div>
        ))}
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
