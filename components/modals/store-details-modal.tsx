"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Edit2, ImageIcon, Check } from "lucide-react";
import { uploadImage, Store, BG_TEMPLATES } from "@/lib/store";
import { ImageCropper } from "@/components/ui/image-cropper";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const inputBase = "w-full h-11 px-4 rounded-xl border bg-white text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200";
const inputOk = "border-zinc-200 focus:ring-zinc-950/10 focus:border-zinc-950";
const inputErr = "border-red-400 focus:ring-red-500/15 focus:border-red-500";

export function StoreDetailsModal({
  store,
  onClose,
  onSave,
}: {
  store: Store;
  onClose: () => void;
  onSave: (updated: Store) => void;
}) {
  const [name, setName] = useState(store.name || "");
  const [description, setDescription] = useState(store.description || "");
  const [creator, setCreator] = useState(store.creator || "");
  const [themeColor, setThemeColor] = useState(store.themeColor || "#dc2626");
  const [layoutStyle, setLayoutStyle] = useState<"card" | "flat">(store.layoutStyle || "card");
  const [bgTemplate, setBgTemplate] = useState(store.bgTemplate || "sunset");
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const [bannerPreview, setBannerPreview] = useState(store.banner || store.bannerUrl || "");
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState(store.logoUrl || "");
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

  const [croppingImage, setCroppingImage] = useState<{ url: string, type: 'banner' | 'logo' } | null>(null);

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCroppingImage({ url: URL.createObjectURL(file), type: 'banner' });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCroppingImage({ url: URL.createObjectURL(file), type: 'logo' });
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    if (croppingImage?.type === 'banner') {
      setPendingBannerFile(croppedFile);
      setBannerPreview(URL.createObjectURL(croppedFile));
    } else if (croppingImage?.type === 'logo') {
      setPendingLogoFile(croppedFile);
      setLogoPreview(URL.createObjectURL(croppedFile));
    }
    setCroppingImage(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Your store needs a name.");
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      let finalBannerUrl = bannerPreview;
      let finalLogoUrl = logoPreview;

      if (pendingBannerFile) {
        finalBannerUrl = await uploadImage(pendingBannerFile, 0.4);
      }
      if (pendingLogoFile) {
        finalLogoUrl = await uploadImage(pendingLogoFile, 0.2);
      }

      onSave({
        ...store,
        name,
        description,
        creator,
        banner: finalBannerUrl,
        bannerUrl: finalBannerUrl,
        logoUrl: finalLogoUrl,
        themeColor,
        layoutStyle,
        bgTemplate
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save store details. Image upload might have failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 sm:backdrop-blur-sm transition-all duration-300" onClick={!loading ? onClose : undefined}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="bg-zinc-50 text-zinc-900 rounded-t-2xl sm:rounded-2xl shadow-[0_24px_60px_-16px_rgb(0,0,0,0.35)] relative w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-2xl flex flex-col overflow-hidden sm:border sm:border-zinc-950/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Store Settings</h2>
              <p className="font-editorial text-sm text-zinc-400 mt-0.5">make it feel like yours</p>
            </div>
            <button onClick={onClose} disabled={loading} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors active:scale-95 disabled:opacity-50 cursor-pointer" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">

            {/* BRANDING SECTION */}
            <div className="bg-white border border-zinc-950/10 rounded-2xl shadow-sm overflow-hidden p-5 sm:p-6 space-y-6">
              <h3 className="text-sm font-bold text-zinc-950 pb-2 border-b border-zinc-100 uppercase tracking-wide text-[11px]">Branding</h3>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">Banner Image</label>
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className="relative w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-zinc-950 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden group"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Upload banner image"
                >
                  {bannerPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Edit2 className="size-6 text-white mb-2" />
                        <span className="text-sm font-medium text-white">Replace Banner</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="size-12 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow">
                        <ImageIcon className="size-5 text-zinc-400" />
                      </div>
                      <span className="text-sm font-medium text-zinc-900">Click to upload banner</span>
                      <span className="text-xs text-zinc-500 mt-1">Recommended 1200x400px (3:1 aspect ratio)</span>
                    </div>
                  )}
                </motion.div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerSelect} />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">Store Logo</label>
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative size-24 sm:size-28 rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-zinc-950 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden group shadow-sm"
                    onClick={() => logoInputRef.current?.click()}
                    role="button"
                    aria-label="Upload store logo"
                  >
                    {logoPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <Edit2 className="size-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                         <Upload className="size-6 text-zinc-400 mb-1" />
                      </div>
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-500">Upload your store's logo. This will be displayed on your store profile. Recommended size is 256x256px.</p>
                  </div>
                </div>
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoSelect} />
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="bg-white border border-zinc-950/10 rounded-2xl shadow-sm overflow-hidden p-5 sm:p-6 space-y-5">
              <h3 className="text-sm font-bold text-zinc-950 pb-2 border-b border-zinc-100 uppercase tracking-wide text-[11px]">Store Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="store-name" className="block text-sm font-medium text-zinc-700">Store Name <span className="text-red-500">*</span></label>
                  <input
                    id="store-name"
                    value={name}
                    onChange={e => { setName(e.target.value); if (nameError) setNameError(undefined); }}
                    onBlur={() => setNameError(!name.trim() ? "Your store needs a name." : undefined)}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "store-name-error" : undefined}
                    className={`${inputBase} ${nameError ? inputErr : inputOk}`}
                    placeholder="My Awesome Store"
                    disabled={loading}
                  />
                  <AnimatePresence>
                    {nameError && (
                      <motion.p
                        id="store-name-error"
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-xs text-red-600 font-medium"
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="store-creator" className="block text-sm font-medium text-zinc-700">Creator Name</label>
                  <input
                    id="store-creator"
                    value={creator}
                    onChange={e => setCreator(e.target.value)}
                    className={`${inputBase} ${inputOk}`}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="store-description" className="block text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  id="store-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all duration-200 resize-none h-28"
                  placeholder="Welcome to my store..."
                  disabled={loading}
                />
                <p className="text-[11px] text-zinc-400">Shown under your store name — a line or two about what you sell.</p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-zinc-700">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {["#09090b", "#dc2626", "#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#0ea5e9"].map(color => {
                    const isSelected = themeColor === color;
                    return (
                      <motion.button
                        key={color}
                        onClick={() => setThemeColor(color)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                        style={{ backgroundColor: color }}
                        className={`size-11 sm:size-10 rounded-full shadow-sm cursor-pointer flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-zinc-950' : 'ring-1 ring-black/10'}`}
                        aria-label={`Select theme color ${color}`}
                        aria-pressed={isSelected}
                        type="button"
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 24 }}
                            >
                              <Check className="size-4 text-white drop-shadow" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-zinc-400">Used for buttons, category pills, and accents across your storefront.</p>
              </div>

              {/* ————— STOREFRONT LOOK ————— */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-zinc-700">Storefront Look</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ["card", "Card view", "Products in a classic grid of cards"],
                    ["flat", "Flat view", "Borderless products on a colored backdrop"],
                  ] as const).map(([key, label, hint]) => {
                    const active = layoutStyle === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLayoutStyle(key)}
                        aria-pressed={active}
                        disabled={loading}
                        className={`rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                          active ? "border-zinc-950 ring-1 ring-zinc-950 bg-white" : "border-zinc-200 bg-white hover:border-zinc-400"
                        }`}
                      >
                        {/* mini preview */}
                        {key === "card" ? (
                          <div className="grid grid-cols-3 gap-1 mb-2.5" aria-hidden="true">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="h-7 rounded-md border border-zinc-200 bg-zinc-50" />
                            ))}
                          </div>
                        ) : (
                          <div className="mb-2.5 rounded-md p-1.5" style={{ background: BG_TEMPLATES[bgTemplate]?.page }} aria-hidden="true">
                            <span className="block h-1.5 w-3/4 rounded-full bg-white/80 mb-1" />
                            <span className="block h-1.5 w-1/2 rounded-full bg-white/80" />
                          </div>
                        )}
                        <span className="block text-sm font-semibold text-zinc-900">{label}</span>
                        <span className="block text-[11px] text-zinc-400 mt-0.5">{hint}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Background templates — only for flat view */}
                <AnimatePresence>
                  {layoutStyle === "flat" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-zinc-700 mt-1 mb-3">Background</label>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(BG_TEMPLATES).map(([key, t]) => {
                          const isSelected = bgTemplate === key;
                          return (
                            <motion.button
                              key={key}
                              type="button"
                              onClick={() => setBgTemplate(key)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
                              transition={{ type: "spring", stiffness: 420, damping: 20 }}
                              style={{ background: t.swatch }}
                              className={`size-11 sm:size-10 rounded-full shadow-sm cursor-pointer flex items-center justify-center ${isSelected ? "ring-2 ring-offset-2 ring-zinc-950" : "ring-1 ring-black/10"}`}
                              aria-label={`Background ${t.label}`}
                              aria-pressed={isSelected}
                              title={t.label}
                            >
                              {isSelected && <Check className="size-4 text-white drop-shadow" />}
                            </motion.button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-2">The backdrop shoppers see behind your products in flat view.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 flex-shrink-0 flex justify-end gap-3 border-t border-zinc-200 bg-white">
            <button onClick={onClose} disabled={loading} className="px-5 h-11 sm:h-10 rounded-xl text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:border-zinc-950 disabled:opacity-50 transition-colors cursor-pointer active:scale-[0.98]">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !name}
              className="flex items-center justify-center gap-2 px-6 h-11 sm:h-10 min-w-[140px] rounded-xl text-sm font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-[0_4px_12px_-4px_rgb(0,0,0,0.4)] disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {croppingImage && (
        <ImageCropper
          key={croppingImage.url}
          imageSrc={croppingImage.url}
          aspectRatio={croppingImage.type === 'banner' ? 3 / 1 : 1 / 1}
          onCropComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
        />
      )}
    </>
  );
}
