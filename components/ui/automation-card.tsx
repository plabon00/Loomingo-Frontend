"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  X, 
  Pencil, 
  Trash2, 
  Pause, 
  Play, 
  MessageCircle, 
  UserPlus 
} from "lucide-react";

type AutomationMediaCardProps = {
  id: string;
  thumbnailUrl: string;
  caption: string;
  username: string;
  isActive: boolean;
  followersGained: number;
  dmsSent: number;
  mediaType: string;
  triggerKeyword: string[];
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
};

export default function AutomationMediaCard({
  thumbnailUrl,
  caption,
  isActive,
  followersGained,
  dmsSent,
  triggerKeyword,
  onEdit,
  onDelete,
  onToggle,
}: AutomationMediaCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="relative flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
      
      {/* Top Image Section - Highly Compacted */}
      <div className="relative h-28 sm:h-32 w-full bg-zinc-100 shrink-0">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt="Automation Media" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300 text-[10px] uppercase font-semibold">
            No Image
          </div>
        )}
        
        {/* 3-Dot Options Button */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={() => setShowOverlay(true)} 
            className="p-1 bg-white/90 backdrop-blur-md text-zinc-900 rounded shadow-sm hover:bg-white transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Active/Paused Status Badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded shadow-sm text-zinc-900 flex items-center gap-1 z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-zinc-400'}`} />
          {isActive ? 'Active' : 'Paused'}
        </div>
      </div>
      
      {/* Bottom Content Section - Tight Padding */}
      <div className="p-3 flex flex-col flex-1 bg-white">
        <p className="text-[10px] sm:text-[11px] text-zinc-600 line-clamp-2 mb-2 flex-1 font-medium leading-snug">
          {caption || "No caption provided"}
        </p>
        
        {/* Trigger Keywords */}
        <div className="flex gap-1 flex-wrap mb-2">
          {triggerKeyword.map((kw, idx) => (
            <span 
              key={idx} 
              className="px-1.5 py-0.5 bg-zinc-100 text-zinc-700 text-[8px] sm:text-[9px] rounded font-semibold tracking-wide"
            >
              {kw}
            </span>
          ))}
        </div>
        
        {/* Analytics Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] text-zinc-400 font-semibold flex items-center gap-1 mb-0.5 uppercase tracking-wider">
              <MessageCircle className="w-2.5 h-2.5"/> DMs
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-900">{dmsSent}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] text-zinc-400 font-semibold flex items-center gap-1 mb-0.5 uppercase tracking-wider">
              <UserPlus className="w-2.5 h-2.5"/> Follows
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-900">{followersGained}</span>
          </div>
        </div>
      </div>

      {/* --- SEMI-TRANSPARENT ACTION OVERLAY --- */}
      {showOverlay && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button 
            onClick={() => setShowOverlay(false)} 
            className="absolute top-2 right-2 p-1 bg-white border border-zinc-200 shadow-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Action Buttons - Extra Compact */}
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            
            {/* Edit Button */}
            <button 
              onClick={() => { onEdit(); setShowOverlay(false); }} 
              className="flex flex-col items-center gap-1 group outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100 group-hover:border-transparent">
                <Pencil className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-wide">Edit</span>
            </button>

            {/* Pause / Resume Button */}
            <button 
              onClick={() => { onToggle(); setShowOverlay(false); }} 
              className="flex flex-col items-center gap-1 group outline-none"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
                isActive 
                  ? 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-500 group-hover:text-white group-hover:border-transparent' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent'
              }`}>
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </div>
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-wide">
                {isActive ? 'Pause' : 'Play'}
              </span>
            </button>

            {/* Delete Button */}
            <button 
              onClick={() => { onDelete(); setShowOverlay(false); }} 
              className="flex flex-col items-center gap-1 group outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm border border-red-100 group-hover:border-transparent">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-wide">Del</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}