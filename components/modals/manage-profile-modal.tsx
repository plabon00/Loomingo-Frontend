"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Loader2, Info, Mail, CheckCircle2 } from "lucide-react";
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

        const res = await fetch(`/api/v1/me/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || user.email || "");
          setPhone(data.phone || ""); 
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const payload = {
        email, 
        name,
        phone,
        photoUrl,
        notifyWhatsapp,
        notifyEmail
      };

      const res = await fetch(`/api/v1/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 sm:bg-black/20 sm:backdrop-blur-[2px] sm:p-4 transition-all duration-300" onClick={onClose}>
      <div 
        className="bg-zinc-50 text-zinc-900 sm:border sm:border-zinc-200 shadow-2xl relative w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-4xl flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 fade-in duration-300 overflow-hidden rounded-t-[24px] sm:rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <h2 className="text-lg font-semibold tracking-tight">Account Settings</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors active:scale-95">
            <X className="size-5" />
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden bg-zinc-50/50">
          
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-zinc-200 p-4 sm:p-6 flex flex-row sm:flex-col gap-1 overflow-x-auto shrink-0 bg-white sm:bg-transparent">
            {(["basic", "notifications", "billing"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-lg text-left capitalize whitespace-nowrap transition-all active:scale-[0.98]",
                  activeTab === tab 
                    ? "bg-zinc-900 text-white shadow-sm" 
                    : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto relative custom-scrollbar">
            {isLoading && activeTab === "basic" ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-zinc-400" />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto w-full pb-20 sm:pb-0">
                {/* BASIC INFO TAB */}
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    
                    {/* Shadcn-style Card */}
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-zinc-200">
                        <h3 className="text-base font-semibold text-zinc-900">Personal Information</h3>
                        <p className="text-sm text-zinc-500 mt-1">Update your photo and personal details.</p>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center gap-5">
                          <div className="relative group">
                            <img 
                              src={photoUrl || "https://i.ibb.co/w04Prt6/c1f64245afb2.gif"} 
                              alt="Profile" 
                              className="size-20 sm:size-24 rounded-full object-cover border-2 border-zinc-100 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute -bottom-2 -right-2 bg-white text-zinc-700 p-2 rounded-full border border-zinc-200 shadow-sm hover:shadow-md hover:text-zinc-900 transition-all active:scale-95"
                              disabled={isUploading}
                            >
                              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                            </button>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-zinc-900">Profile Photo</h4>
                            <p className="text-xs text-zinc-500 mt-1">Recommended 256x256px.<br/> JPG, GIF or PNG.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Full Name</label>
                            <input 
                              type="text" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)}
                              className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-white text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm"
                              placeholder="Jane Doe"
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
                            <input 
                              type="tel" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-white text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm"
                              placeholder="+1 234 567 890"
                            />
                          </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input 
                              type="email" 
                              value={email} 
                              disabled
                              className="w-full h-11 pl-10 pr-4 rounded-lg border border-zinc-200 bg-zinc-50 text-base sm:text-sm text-zinc-500 outline-none cursor-not-allowed shadow-sm"
                            />
                          </div>
                          <p className="text-xs text-zinc-500">Contact support to change your email address.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200">
                      <h3 className="text-base font-semibold text-zinc-900">Communication Preferences</h3>
                      <p className="text-sm text-zinc-500 mt-1">Manage how you receive updates and alerts.</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <label className="flex items-start gap-4 p-4 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-all active:scale-[0.99]">
                        <div className="mt-0.5">
                           <input type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-900 block">WhatsApp Updates</span>
                          <span className="text-sm text-zinc-500">Receive order notifications and alerts via WhatsApp.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 p-4 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-all active:scale-[0.99]">
                        <div className="mt-0.5">
                           <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-900 block">Email Newsletters</span>
                          <span className="text-sm text-zinc-500">Receive feature updates, tips, and offers via Email.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* BILLING TAB */}
                {activeTab === "billing" && (
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200">
                      <h3 className="text-base font-semibold text-zinc-900">Plan & Billing</h3>
                      <p className="text-sm text-zinc-500 mt-1">Manage your subscription and payment methods.</p>
                    </div>
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2 ring-8 ring-blue-50/50">
                        <Info className="size-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-900">Beta Mode Active</h3>
                      <div className="max-w-sm space-y-2 text-sm text-zinc-500">
                        <p>We are currently in beta mode. The subscription model will be introduced soon.</p>
                        <p>You are helping us improve! Enjoy all premium features for free during this period.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 h-10 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-[0.98]">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading || activeTab === "billing"} 
            className="px-6 h-10 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm min-w-[120px]"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
