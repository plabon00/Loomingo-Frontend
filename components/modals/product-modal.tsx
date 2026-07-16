"use client";

import { useState, useRef } from "react";
import { X, Loader2, Plus, Trash2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { uploadImage, Product, newId } from "@/lib/store";
import { ImageCropper } from "@/components/ui/image-cropper";
import { toast } from "sonner";

type ImagePreview = {
  url: string;
  file?: File; 
};

const AFFILIATE_PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho", "Others"];
const PREDEFINED_CATEGORIES = ["Electronics", "Top Wear", "Bottom Wear", "Dress", "Accessories", "Digital", "Beauty", "Face Care", "Others"];

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
  
  const [images, setImages] = useState<ImagePreview[]>(
    (product?.images || []).map(url => ({ url }))
  );
  
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const currentCropFile = cropQueue.length > 0 ? cropQueue[0] : null;
  const currentCropUrl = currentCropFile ? URL.createObjectURL(currentCropFile) : null;
  
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (selectedTags.length === 0) {
      setShakeTags(true);
      toast.error("Please select at least one tag");
      setTimeout(() => setShakeTags(false), 500);
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
      alert("Failed to save product. Image upload might have failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-zinc-900" onClick={!loading ? onClose : undefined}>
        <div 
          className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 p-5 sm:p-6 pb-4 sm:pb-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-xl font-bold">{product ? "Edit Product" : "Add Product"}</h2>
            <button onClick={onClose} disabled={loading} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 disabled:opacity-50 transition-colors">
              <X className="size-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Product Images (Max 3)</label>
              <div className="flex flex-wrap gap-3 mb-2">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl border-2 overflow-hidden group shrink-0 shadow-sm" style={{ borderColor: i === 0 ? '#10b981' : '#e4e4e7' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                    
                    {/* Main Image Badge */}
                    {i === 0 && (
                      <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-[10px] font-bold py-0.5 text-center flex items-center justify-center gap-1">
                        <Star className="size-3 fill-white" /> Main
                      </div>
                    )}

                    {/* Desktop Hover Overlay (Delete) */}
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>

                    {/* Move Left/Right Controls */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-sm flex items-center justify-between px-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => moveImage(i, 'left')}
                        disabled={i === 0}
                        className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button 
                        onClick={() => moveImage(i, 'right')}
                        disabled={i === images.length - 1}
                        className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {images.length < 3 && (
                  <div 
                    className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center cursor-pointer hover:bg-zinc-100 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="size-5 text-zinc-400" />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Product Name</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                placeholder="Cool T-Shirt"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none h-24"
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
                    <button
                      key={tag}
                      type="button"
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
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected 
                          ? "bg-zinc-900 text-white shadow-sm scale-105" 
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Price (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                <input 
                  type="number"
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  className="w-full pl-7 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Sales Channel Tabs */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden p-1">
              <div className="flex bg-zinc-200/50 p-1 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setIsWhatsapp(true)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${isWhatsapp ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                  WhatsApp Sale
                </button>
                <button
                  type="button"
                  onClick={() => setIsWhatsapp(false)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${!isWhatsapp ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                  Affiliate Link
                </button>
              </div>

              <div className="px-3 pb-3">
                {isWhatsapp ? (
                  <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700">WhatsApp Number</label>
                    <input 
                      value={whatsappNumber} 
                      onChange={e => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                      placeholder="+1234567890"
                      disabled={loading}
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Include country code (e.g. +1 for US, +91 for India)</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-700">Platform</label>
                      <select 
                        value={affiliatePlatform}
                        onChange={e => setAffiliatePlatform(e.target.value)}
                        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                        disabled={loading}
                      >
                        {AFFILIATE_PLATFORMS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-700">Affiliate Link</label>
                      <input 
                        value={link} 
                        onChange={e => setLink(e.target.value)}
                        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        placeholder="https://amazon.com/..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="p-5 sm:p-6 pt-4 shrink-0 flex justify-end gap-3 border-t border-zinc-100">
            <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={!name || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Save Product
            </button>
          </div>
        </div>
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
