"use client";

import { useState, useRef } from "react";
import { X, PackagePlus, Copy, Check, Loader2, ExternalLink, ImagePlus, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { uploadImage } from "@/lib/store";

interface CreateCollectionModalProps {
  selectedCount: number;
  onClose: () => void;
  onSubmit: (name: string, description: string, thumbnailUrl: string) => Promise<string | null>; // returns shareToken
}

export function CreateCollectionModal({ selectedCount, onClose, onSubmit }: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shareLink = shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/shop/collection/${shareToken}`
    : null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    let uploadedUrl = "";
    try {
      if (thumbnailFile) {
        uploadedUrl = await uploadImage(thumbnailFile);
      }
      const token = await onSubmit(name.trim(), description.trim(), uploadedUrl);
      if (token) {
        setShareToken(token);
      }
    } catch (e) {
      console.error("Upload failed", e);
    }
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Also trigger native share on mobile
    if (navigator.share) {
      navigator.share({ title: name, url: shareLink }).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_24px_60px_-16px_rgb(0,0,0,0.35)] w-full sm:max-w-md max-h-[100dvh] overflow-y-auto border border-zinc-950/10 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-zinc-100 px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <PackagePlus className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  {shareToken ? "Collection Created!" : "Create Collection"}
                </h3>
                <p className="text-xs text-zinc-500">
                  {shareToken ? "Your link is ready to share" : `${selectedCount} product${selectedCount !== 1 ? "s" : ""} selected`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {!shareToken ? (
              <>
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-800 mb-2">Collection Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Essentials, Top Picks…"
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    autoFocus
                    maxLength={60}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-800 mb-2">Description <span className="font-normal text-zinc-400">(optional)</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short description of this collection…"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    maxLength={200}
                  />
                </div>

                {/* Thumbnail Input */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-800 mb-2">Thumbnail <span className="font-normal text-zinc-400">(optional)</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all cursor-pointer flex items-center justify-center overflow-hidden relative"
                  >
                    {thumbnailPreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-zinc-400">
                        <ImagePlus className="size-5" />
                        <span className="text-xs font-medium text-zinc-500">Upload cover image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100">
                  <PackagePlus className="size-4 text-violet-600 shrink-0" />
                  <p className="text-xs text-violet-700 leading-relaxed">
                    A shareable link will be generated. Anyone with the link can view these {selectedCount} products.
                  </p>
                </div>

                {/* Submit */}
                <div className="pb-8 sm:pb-0 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || isSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-[0_4px_12px_-4px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      "Create & Get Link"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Success state */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="space-y-4"
                >
                  {/* Success icon */}
                  <div className="flex justify-center py-2">
                    <div className="size-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                      <Check className="size-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <p className="text-center text-sm text-zinc-600">
                    <span className="font-semibold text-zinc-900">&quot;{name}&quot;</span> is ready with {selectedCount} products
                  </p>

                  {/* Share link */}
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-1">Share link</p>
                      <p className="text-sm text-zinc-800 font-medium truncate">{shareLink}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 size-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all cursor-pointer active:scale-95"
                    >
                      {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <a
                      href={shareLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-11 rounded-xl bg-zinc-100 text-zinc-700 font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="size-4" />
                      Preview
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
