"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  UserPlus, 
  Send, 
  Image as ImageIcon, 
  Film,
  Hash,
  Play,
  Pause
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export interface AutomationCardProps {
  id: string;
  thumbnailUrl?: string;
  caption?: string;
  username?: string;
  mediaType?: "POST" | "REEL" | "CAROUSEL_ALBUM" | string; 
  isActive?: boolean;
  followersGained?: number | string;
  dmsSent?: number | string;
  triggerKeywords?: string[]; 
  triggerKeyword?: string[]; 
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void; 
}

export default function AutomationMediaCard({
  id,
  thumbnailUrl = "",
  caption = "No caption available",
  username = "Unknown Account",
  mediaType = "POST",
  isActive = false,
  followersGained = 0,
  dmsSent = 0,
  triggerKeywords,
  triggerKeyword,
  className,
  onEdit,
  onDelete,
  onToggle,
}: AutomationCardProps) {
  const [showActions, setShowActions] = useState(false);

  const safeKeywords = triggerKeywords || triggerKeyword || [];

  const handleMouseLeave = () => {
    if (showActions) setShowActions(false);
  };

  const truncateCaption = (text: string) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= 10) return text;
    return words.slice(0, 10).join(" ") + " ...";
  };

  return (
    <Card 
      className={cn("p-4 relative shadow-sm border-border/50 w-full transition-all hover:shadow-md", className)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-4">
        
        {/* --- LEFT: Thumbnail Preview --- */}
        <div className="w-[72px] aspect-[4/5] shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50 relative">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt="Media thumbnail" 
              className={`w-full h-full object-cover transition-all ${!isActive ? 'opacity-50 grayscale-[50%]' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
              <ImageIcon className="size-6" />
            </div>
          )}

          {/* Tiny Active Indicator in the corner of the thumbnail */}
          <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-white/10">
             <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500 shadow-[0_0_3px_#22c55e]" : "bg-slate-400"}`} />
             <span className="text-[7px] font-bold uppercase tracking-wider text-white">
               {isActive ? "ON" : "OFF"}
             </span>
          </div>
        </div>

        {/* --- RIGHT: Content & Stats --- */}
        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
          
          <div className="flex flex-col">
            {/* Header Row: Caption & 3-Dot Menu */}
            <div className="flex items-start justify-between relative">
              <div className="flex flex-col flex-1 min-w-0 pr-2">
                 {/* 1. TOP: Caption (Forced to 1 line with 'truncate block') */}
                 <span className="font-semibold text-sm tracking-tight truncate block w-full text-foreground" title={caption}>
                   {truncateCaption(caption)}
                 </span>
                 {/* 2. UNDER CAPTION: Username */}
                 <span className="font-medium text-[11px] text-muted-foreground truncate w-full mt-0.5">
                    @{username}
                 </span>
              </div>

              {/* 3-Dot Actions Menu */}
              <div className="relative -mt-1 -mr-2 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreVertical className="size-4" />
                </Button>

                {/* Action Dropdown */}
                {showActions && (
                  <div className="absolute top-full right-0 mt-1 z-10 animate-in fade-in zoom-in-95 duration-100 shadow-xl rounded-md border border-border bg-background w-40">
                    <ButtonGroup className="flex flex-col items-stretch divide-y divide-border">
                      <Button 
                        variant="ghost" 
                        className="h-9 px-3 w-full justify-start rounded-none hover:bg-muted text-xs"
                        onClick={() => {
                          setShowActions(false);
                          onToggle && onToggle();
                        }}
                      >
                        {isActive ? (
                          <><Pause className="size-3.5 mr-2 text-amber-500" /> Disable</>
                        ) : (
                          <><Play className="size-3.5 mr-2 text-green-500" /> Enable</>
                        )}
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="h-9 px-3 w-full justify-start rounded-none hover:bg-muted text-xs"
                        onClick={() => {
                          setShowActions(false);
                          onEdit && onEdit();
                        }}
                      >
                        <Pencil className="size-3.5 mr-2" /> Edit Rule
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="h-9 px-3 w-full justify-start rounded-none hover:bg-destructive/10 hover:text-destructive text-destructive/80 text-xs font-medium"
                        onClick={() => {
                          setShowActions(false);
                          onDelete && onDelete();
                        }}
                      >
                        <Trash2 className="size-3.5 mr-2" /> Delete
                      </Button>
                    </ButtonGroup>
                  </div>
                )}
              </div>
            </div>

            {/* 3. UNDER USERNAME: Keyword Trigger Badges */}
            <div className="flex flex-wrap gap-1 mt-2">
              {safeKeywords && safeKeywords.length > 0 ? (
                safeKeywords.slice(0, 3).map((kw, idx) => (
                  <span key={idx} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium flex items-center">
                    <Hash className="size-2.5 mr-0.5" />{kw}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground italic mt-1">No triggers set</span>
              )}
              {safeKeywords && safeKeywords.length > 3 && (
                 <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">+{safeKeywords.length - 3}</span>
              )}
            </div>
          </div>

          {/* 4. BOTTOM ROW: Media Type & Stats (Resized to be smaller) */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
            
            <div className="flex items-center gap-2">
               {/* Media Type Badge (Smaller text, smaller icon, tighter padding) */}
               <div className="flex items-center gap-1 text-[9px] font-bold bg-muted/50 border border-border/50 px-1.5 py-0.5 rounded shrink-0 uppercase text-muted-foreground">
                 {mediaType === "REEL" || mediaType === "VIDEO" ? <Film className="size-2.5" /> : <ImageIcon className="size-2.5" />}
                 {mediaType.replace("_", " ")}
               </div>
            </div>

            {/* Stats (Smaller text, smaller icons, tighter gap) */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-sm text-foreground/90" title="Total Automations Sent">
                <Send className="size-3 text-blue-500" />
                <span className="font-bold">{dmsSent.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground/90" title="Followers Gained">
                <UserPlus className="size-3 text-green-500" />
                <span className="font-bold">{followersGained.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Card>
  );
}