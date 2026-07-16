"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, Loader2, Send } from "lucide-react";
import { auth } from "@/lib/firebase";

export function SuggestUsModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill user data when the modal opens
  useEffect(() => {
    if (isOpen && auth.currentUser) {
      setName(auth.currentUser.displayName || "Creator");
      setEmail(auth.currentUser.email || "");
    } else if (!isOpen) {
      // Reset form when closed
      setContactNumber("");
      setFeatureName("");
      setFeatureDescription("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const GAS_URL = "https://script.google.com/macros/s/AKfycbzS-D4-rNh-tpzfaIJ9qcNhq03iU-CTfd2BrCsRnpUb63WeX1w-EjVlIN-1XFUtfCNl/exec";

      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { 
          // 🚀 THE FIX: Changed to text/plain so the browser doesn't block it!
          "Content-Type": "text/plain;charset=utf-8" 
        },
        body: JSON.stringify({ 
          name, 
          contactNumber, 
          email, 
          featureName, 
          featureDescription 
        }),
      });

      // Trigger the alert in the parent and close the modal
      onSuccess("Suggestion sent successfully! Thank you. ✨");
      onClose(); 

    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white text-zinc-900 border border-zinc-200 shadow-2xl rounded-3xl relative w-full max-w-[450px] p-6 md:p-8 animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors z-10"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 shrink-0">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl mb-4">
            <Lightbulb className="size-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Suggest a Feature</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Have an idea to make Loomingo better? We'd love to hear it!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Name</label>
              <input
                type="text"
                value={name}
                readOnly
                className="w-full text-sm border-2 border-transparent bg-zinc-100 text-zinc-500 rounded-xl p-3 outline-none cursor-not-allowed"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 234 567 890"
                className="w-full text-sm border-2 border-zinc-200 bg-white focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl p-3 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-sm border-2 border-zinc-200 bg-white focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl p-3 outline-none transition-all"
            />
          </div>

          {/* Feature Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Feature Name</label>
            <input
              type="text"
              required
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              placeholder="e.g., Auto-reply to Stories"
              className="w-full text-sm border-2 border-zinc-200 bg-white focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl p-3 outline-none transition-all"
            />
          </div>

          {/* Feature Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Description</label>
            <textarea
              required
              rows={4}
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              placeholder="How would this feature work and how would it help you?"
              className="w-full text-sm border-2 border-zinc-200 bg-white focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl p-3 outline-none transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-11 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4" /> Send Suggestion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}