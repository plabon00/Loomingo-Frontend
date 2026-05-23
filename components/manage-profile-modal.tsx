"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Loader2, Info, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase"; 

type Tab = "basic" | "notifications" | "billing";

interface ManageProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

export function ManageProfileModal({ isOpen, onClose, onSuccess, onError }: ManageProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Fetch initial data from Backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        // 🚀 UPDATED: Fetching from the new Controller endpoint
        const res = await fetch("http://localhost:8080/api/v1/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || user.email || ""); // Fallback to firebase email
          setPhone(data.phone || ""); // handles null safely
          setPhotoUrl(data.photoUrl || user.photoURL || "");
          setNotifyWhatsapp(data.notifyWhatsapp || false);
          setNotifyEmail(data.notifyEmail || false);
        } else {
            console.error("Failed to fetch from backend");
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen]);

  // Handle ImgBB Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=180243595d24120bf44f95066ee4384a`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        // Update the photoUrl state with the viewable URL from ImgBB
        setPhotoUrl(result.data.url); 
      } else {
        onError?.("Failed to upload image.");
      }
    } catch (error) {
      console.error(error);
      onError?.("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Save
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      // 🚀 UPDATED: Match the ManageProfileDTO structure exactly
      const payload = {
        email, 
        name,
        phone,
        photoUrl,
        notifyWhatsapp,
        notifyEmail
      };

      // 🚀 UPDATED: Hitting the new PUT endpoint
      const res = await fetch("http://localhost:8080/api/v1/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess?.("Profile updated successfully!");
        onClose();
      } else {
        onError?.("Failed to update profile.");
      }
    } catch (error) {
      onError?.("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4" onClick={onClose}>
      <div 
        className="bg-background md:border shadow-2xl relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden md:rounded-3xl rounded-none" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b">
          <h2 className="text-xl font-bold">Manage Account</h2>
          <button onClick={onClose} className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs & Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-48 border-b md:border-b-0 md:border-r p-4 flex flex-row md:flex-col gap-2 overflow-x-auto bg-muted/10 shrink-0">
            {(["basic", "notifications", "billing"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-xl text-left capitalize whitespace-nowrap transition-colors",
                  activeTab === tab ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
            {isLoading && activeTab === "basic" ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* BASIC INFO TAB */}
                {activeTab === "basic" && (
                  <div className="space-y-8 flex flex-col h-full">
                    <div className="flex-1 space-y-8">
                      {/* Profile Picture */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                          <img 
                            src={photoUrl || "https://i.ibb.co/w04Prt6/c1f64245afb2.gif"} // Fallback placeholder
                            alt="Profile" 
                            className="size-24 rounded-full object-cover border-4 border-muted shadow-sm"
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition transform hover:scale-105 active:scale-95"
                            disabled={isUploading}
                          >
                            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                          </button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Upload new picture</span>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-5 max-w-md mx-auto w-full">
                        {/* Email (Read Only) */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input 
                              type="email" 
                              value={email} 
                              disabled
                              className="w-full pl-10 p-3 rounded-xl border bg-muted/50 text-muted-foreground text-sm outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Name (Editable) */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Full Name</label>
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            placeholder="John Doe"
                          />
                        </div>

                        {/* Phone (Editable) */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Phone Number</label>
                          <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Developer Note */}
                    <div className="mt-8 pt-6 border-t">
                      <p className="text-[11px] md:text-xs text-muted-foreground/80 text-center leading-relaxed max-w-sm mx-auto">
                        <span className="text-primary font-bold mr-1">*</span> 
                        We are currently in active development mode. Many more features will be rolled out soon! You will be notified when the final product launches, but until then, enjoy early access for free.
                      </p>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <h3 className="font-semibold text-lg border-b pb-2">Communication Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/30 transition shadow-sm">
                        <input type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} className="size-5 accent-primary" />
                        <span className="text-sm font-medium">Receive updates via WhatsApp</span>
                      </label>
                      <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/30 transition shadow-sm">
                        <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="size-5 accent-primary" />
                        <span className="text-sm font-medium">Receive updates via Email</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* BILLING TAB */}
                {activeTab === "billing" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 h-full pt-8">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <Info className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold">Beta Mode Active</h3>
                    <div className="max-w-xs space-y-2 text-sm text-muted-foreground">
                      <p>We are currently in beta mode. The subscription model will be introduced soon.</p>
                      <p>You are helping us improve! Feel free to suggest a feature you need via the Suggestion tab.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:px-6 border-t bg-muted/10 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border bg-background text-sm font-semibold hover:bg-muted transition">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading || activeTab === "billing"} 
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}