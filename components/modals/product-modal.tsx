"use client";

import { useState, useRef } from "react";
import { X, Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Star, Check, MessageCircle, Link2 } from "lucide-react";
import { uploadImage, Product, newId } from "@/lib/store";
import { ImageCropper } from "@/components/ui/image-cropper";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

type ImagePreview = {
  url: string;
  file?: File;
};

const AFFILIATE_PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho", "Others"];
const PREDEFINED_CATEGORIES = ["Electronics", "Top Wear", "Bottom Wear", "Dress", "Accessories", "Digital", "Beauty", "Face Care", "Others"];

const inputBase = "w-full px-4 py-2.5 rounded-xl border bg-white text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200";
const inputOk = "border-zinc-200 focus:ring-zinc-950/10 focus:border-zinc-950";
const inputErr = "border-red-400 focus:ring-red-500/15 focus:border-red-500";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-xs text-red-600 mt-1.5 font-medium"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");

  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.category ? product.category.split(",").map(s => s.trim()).filter(Boolean) : []
  );
  const [shakeTags, setShakeTags] = useState(false);

  const [isWhatsapp, setIsWhatsapp] = useState(product?.isWhatsapp ?? true); // Default to WA
  const [whatsappNumber, setWhatsappNumber] = useState(product?.whatsappNumber || "");
  const [affiliatePlatform, setAffiliatePlatform] = useState(product?.affiliatePlatform || "Amazon");
  const [link, setLink] = useState(product?.link || "");

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [images, setImages] = useState<ImagePreview[]>(
    (product?.images || []).map(url => ({ url }))
  );

  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const currentCropFile = cropQueue.length > 0 ? cropQueue[0] : null;
  const currentCropUrl = currentCropFile ? URL.createObjectURL(currentCropFile) : null;

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Inline validation (runs on blur, cleared on change) ---
  const validators: Record<string, () => string | undefined> = {
    name: () => (!name.trim() ? "Give your product a name." : undefined),
    price: () => (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0) ? "Enter a valid price." : undefined),
    whatsappNumber: () => {
      if (!isWhatsapp) return undefined;
      if (!whatsappNumber.trim()) return "WhatsApp number is required for WhatsApp sales.";
      if (!/^\+\d{7,15}$/.test(whatsappNumber.replace(/[\s-]/g, ""))) return "Use international format, e.g. +919876543210.";
      return undefined;
    },
    link: () => {
      if (isWhatsapp) return undefined;
      if (!link.trim()) return "Paste your affiliate link.";
      try { new URL(link); return undefined; } catch { return "That doesn't look like a valid URL."; }
    },
  };

  const validateField = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: validators[field]?.() }));
  };
  const clearError = (field: string) => {
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 3 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      setCropQueue(filesToAdd);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    setImages(prev => [...prev, {
      url: URL.createObjectURL(croppedFile),
      file: croppedFile
    }]);
    setCropQueue(prev => prev.slice(1));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    if (direction === 'left' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'right' && index < images.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setImages(newImages);
  };

  const handleSave = async () => {
    // Full validation pass on submit
    const newErrors: Record<string, string | undefined> = {};
    for (const field of Object.keys(validators)) {
      newErrors[field] = validators[field]();
    }
    setErrors(newErrors);

    if (selectedTags.length === 0) {
      setShakeTags(true);
      toast.error("Please select at least one tag");
      setTimeout(() => setShakeTags(false), 500);
      return;
    }
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      const finalImageUrls: string[] = [];

      for (const img of images) {
        if (img.file) {
          const url = await uploadImage(img.file, 0.15); // Compress to 150KB
          finalImageUrls.push(url);
        } else {
          finalImageUrls.push(img.url);
        }
      }

      onSave({
        id: product?.id || newId(),
        storeId: product?.storeId || "",
        name,
        code: product?.code || "", // Keeps existing code, otherwise backend generates it
        price: price ? parseFloat(price) : undefined,
        isWhatsapp,
        whatsappNumber: isWhatsapp ? whatsappNumber : "",
        affiliatePlatform: !isWhatsapp ? affiliatePlatform : "",
        description,
        category: selectedTags.join(", "),
        link: !isWhatsapp ? link : "",
        images: finalImageUrls,
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product. Image upload might have failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-zinc-900" onClick={!loading ? onClose : undefined}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="bg-white rounded-2xl shadow-[0_24px_60px_-16px_rgb(0,0,0,0.35)] border border-zinc-950/10 relative w-full max-w-lg flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 p-5 sm:p-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{product ? "Edit Product" : "Add Product"}</h2>
              <p className="font-editorial text-sm text-zinc-400 mt-0.5">{product ? "give it a little polish" : "something new for the shelf"}</p>
            </div>
            <button onClick={onClose} disabled={loading} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 disabled:opacity-50 transition-colors cursor-pointer" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700">Product Images <span className="text-zinc-400 font-normal">(max 3, first is the cover)</span></label>
              <div className="flex flex-wrap gap-3 mb-2">
                <AnimatePresence mode="popLayout">
                  {images.map((img, i) => (
                    <motion.div
                      layout
                      key={img.url}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="relative w-24 h-24 rounded-xl border-2 overflow-hidden group shrink-0 shadow-sm"
                      style={{ borderColor: i === 0 ? '#10b981' : '#e4e4e7' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />

                      {/* Main Image Badge */}
                      {i === 0 && (
                        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-[10px] font-bold py-0.5 text-center flex items-center justify-center gap-1">
                          <Star className="size-3 fill-white" /> Main
                        </div>
                      )}

                      {/* Desktop Hover Overlay (Delete) */}
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        <X className="size-3.5" />
                      </button>

                      {/* Move Left/Right Controls */}
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-sm flex items-center justify-between px-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveImage(i, 'left')}
                          disabled={i === 0}
                          className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded cursor-pointer"
                          aria-label="Move image left"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <button
                          onClick={() => moveImage(i, 'right')}
                          disabled={i === images.length - 1}
                          className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded cursor-pointer"
                          aria-label="Move image right"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {images.length < 3 && (
                  <motion.div
                    layout
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center cursor-pointer hover:border-zinc-950 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    aria-label="Add product image"
                  >
                    <Plus className="size-5 text-zinc-400" />
                  </motion.div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
            </div>

            <div>
              <label htmlFor="product-name" className="block text-sm font-medium mb-1.5 text-zinc-700">Product Name <span className="text-red-500">*</span></label>
              <input
                id="product-name"
                value={name}
                onChange={e => { setName(e.target.value); clearError("name"); }}
                onBlur={() => validateField("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                placeholder="Cool T-Shirt"
                disabled={loading}
              />
              <FieldError id="product-name-error" message={errors.name} />
            </div>

            <div>
              <label htmlFor="product-description" className="block text-sm font-medium mb-1.5 text-zinc-700">Description</label>
              <textarea
                id="product-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`${inputBase} ${inputOk} resize-none h-24`}
                placeholder="100% cotton, ethically sourced..."
                disabled={loading}
              />
            </div>

            <div className={shakeTags ? "animate-shake" : ""}>
              <label className={`block text-sm font-medium mb-2 ${shakeTags ? "text-red-500" : "text-zinc-700"}`}>
                Tags (Select 1 to 3) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_CATEGORIES.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <motion.button
                      key={tag}
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          if (selectedTags.length >= 3) {
                            toast.error("You can only select up to 3 tags");
                            return;
                          }
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <Check className="size-3" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {tag}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="product-price" className="block text-sm font-medium mb-1.5 text-zinc-700">Price <span className="text-zinc-400 font-normal">(optional)</span></label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                <input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={price}
                  onChange={e => { setPrice(e.target.value); clearError("price"); }}
                  onBlur={() => validateField("price")}
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  className={`${inputBase} pl-7 ${errors.price ? inputErr : inputOk}`}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              <FieldError id="product-price-error" message={errors.price} />
            </div>

            {/* Sales Channel Tabs */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden p-1">
              <div className="relative flex bg-zinc-200/60 p-1 rounded-lg mb-4" role="tablist" aria-label="Sales channel">
                {[
                  { key: true, label: "WhatsApp Sale", icon: MessageCircle },
                  { key: false, label: "Affiliate Link", icon: Link2 },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={isWhatsapp === key}
                    onClick={() => { setIsWhatsapp(key); setErrors(prev => ({ ...prev, whatsappNumber: undefined, link: undefined })); }}
                    className={`relative flex-1 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${isWhatsapp === key ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    {isWhatsapp === key && (
                      <motion.span
                        layoutId="channel-tab"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 bg-white rounded-md shadow-sm"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5"><Icon className="size-3.5" />{label}</span>
                  </button>
                ))}
              </div>

              <div className="px-3 pb-3">
                <AnimatePresence mode="wait" initial={false}>
                  {isWhatsapp ? (
                    <motion.div
                      key="whatsapp"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <label htmlFor="wa-number" className="block text-xs font-medium mb-1.5 text-zinc-700">WhatsApp Number <span className="text-red-500">*</span></label>
                      <input
                        id="wa-number"
                        type="tel"
                        value={whatsappNumber}
                        onChange={e => { setWhatsappNumber(e.target.value); clearError("whatsappNumber"); }}
                        onBlur={() => validateField("whatsappNumber")}
                        aria-invalid={!!errors.whatsappNumber}
                        aria-describedby={errors.whatsappNumber ? "wa-number-error" : "wa-number-help"}
                        className={`${inputBase} text-sm ${errors.whatsappNumber ? inputErr : inputOk}`}
                        placeholder="+919876543210"
                        disabled={loading}
                      />
                      <FieldError id="wa-number-error" message={errors.whatsappNumber} />
                      {!errors.whatsappNumber && (
                        <p id="wa-number-help" className="text-[11px] text-zinc-500 mt-1.5">Include country code (e.g. +1 for US, +91 for India)</p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="affiliate"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div>
                        <label htmlFor="affiliate-platform" className="block text-xs font-medium mb-1.5 text-zinc-700">Platform</label>
                        <select
                          id="affiliate-platform"
                          value={affiliatePlatform}
                          onChange={e => setAffiliatePlatform(e.target.value)}
                          className={`${inputBase} text-sm ${inputOk} bg-white cursor-pointer`}
                          disabled={loading}
                        >
                          {AFFILIATE_PLATFORMS.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="affiliate-link" className="block text-xs font-medium mb-1.5 text-zinc-700">Affiliate Link <span className="text-red-500">*</span></label>
                        <input
                          id="affiliate-link"
                          type="url"
                          value={link}
                          onChange={e => { setLink(e.target.value); clearError("link"); }}
                          onBlur={() => validateField("link")}
                          aria-invalid={!!errors.link}
                          aria-describedby={errors.link ? "affiliate-link-error" : undefined}
                          className={`${inputBase} text-sm ${errors.link ? inputErr : inputOk}`}
                          placeholder="https://amazon.com/..."
                          disabled={loading}
                        />
                        <FieldError id="affiliate-link-error" message={errors.link} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          <div className="p-5 sm:p-6 pt-4 shrink-0 flex justify-end gap-3 border-t border-zinc-100">
            <button onClick={onClose} disabled={loading} className="px-5 h-11 rounded-xl font-semibold text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-colors cursor-pointer active:scale-[0.98]">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name || loading}
              className="flex items-center gap-2 px-6 h-11 min-w-[140px] justify-center rounded-xl font-semibold text-sm bg-zinc-950 text-white hover:bg-zinc-800 shadow-[0_4px_12px_-4px_rgb(0,0,0,0.4)] disabled:opacity-50 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {currentCropUrl && (
        <ImageCropper
          key={currentCropUrl}
          imageSrc={currentCropUrl}
          aspectRatio={1} // Square aspect ratio for products
          hasNext={cropQueue.length > 1}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropQueue([])}
        />
      )}
    </>
  );
}
