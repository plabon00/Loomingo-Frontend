"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Edit2 } from "lucide-react";
import { uploadImage, Store } from "@/lib/store";
import { ImageCropper } from "@/components/ui/image-cropper";

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
    setLoading(true);
    try {
      let finalBannerUrl = bannerPreview;
      let finalLogoUrl = logoPreview;
      
      // Only upload if the user actually cropped a new image
      if (pendingBannerFile) {
        finalBannerUrl = await uploadImage(pendingBannerFile, 0.4); // Compress to 400KB
      }
      if (pendingLogoFile) {
        finalLogoUrl = await uploadImage(pendingLogoFile, 0.2); // Compress to 200KB
      }
      
      onSave({ 
        ...store, 
        name, 
        description, 
        creator, 
        banner: finalBannerUrl, 
        bannerUrl: finalBannerUrl,
        logoUrl: finalLogoUrl,
        themeColor
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save store details. Image upload might have failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-zinc-900" onClick={!loading ? onClose : undefined}>
        <div 
          className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg p-6 animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} disabled={loading} className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 disabled:opacity-50">
            <X className="size-5" />
          </button>
          
          <h2 className="text-xl font-bold mb-6">Manage Store</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Banner Image</label>
              <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center overflow-hidden group">
                {bannerPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="size-5 mb-1" />
                      <span className="text-sm font-medium">Change Banner</span>
                    </button>
                  </>
                ) : (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-6 mb-2 text-zinc-400" />
                    <span className="text-sm text-zinc-500">Click to upload banner</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerSelect} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Store Logo</label>
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center overflow-hidden group">
                {logoPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="size-5" />
                    </button>
                  </>
                ) : (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="size-5 mb-1 text-zinc-400" />
                  </div>
                )}
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoSelect} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Store Name</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                placeholder="My Awesome Store"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Creator Name</label>
              <input 
                value={creator} 
                onChange={e => setCreator(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none h-24"
                placeholder="Welcome to my store..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700">Store Theme Color</label>
              <div className="flex flex-wrap gap-3">
                {["#dc2626", "#4f46e5", "#10b981", "#f59e0b", "#64748b", "#8b5cf6", "#ec4899", "#06b6d4"].map(color => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    style={{ backgroundColor: color }}
                    className={`size-8 rounded-full shadow-sm transition-all hover:scale-110 ${themeColor === color ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110' : ''}`}
                    aria-label={`Select theme color ${color}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-zinc-100 pt-4">
            <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading || !name} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
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
