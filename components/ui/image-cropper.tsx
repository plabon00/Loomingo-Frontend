"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { Loader2 } from "lucide-react";

export function ImageCropper({
  imageSrc,
  aspectRatio,
  hasNext,
  onCropComplete,
  onCancel,
}: {
  imageSrc: string;
  aspectRatio: number; // e.g. 16/9 for banner, 1 for square product
  hasNext?: boolean;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800">
        
        {/* Crop Area */}
        <div className="relative w-full h-[50vh] min-h-[300px] bg-zinc-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            showGrid={true}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-zinc-950 text-white flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-2 bg-zinc-800 rounded-lg appearance-none"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {hasNext ? "Crop & Next" : "Crop & Apply"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
