"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Pause, 
  Play, 
  MessageCircle, 
  UserPlus,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PRIMARY = "#5742f5";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="relative flex flex-col bg-white border border-[#e6e1d6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#5742f5]/30 transition-all h-full group">
        
        {/* Top Image Section */}
        <div className="relative h-28 sm:h-32 w-full bg-[#f6f4ef] shrink-0 border-b border-[#e6e1d6]">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt="Automation Media" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#f6f4ef] text-zinc-400 text-[10px] uppercase font-semibold">
              No Image
            </div>
          )}
          
          {/* 3-Dot Options Button via DropdownMenu */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 bg-white/90 backdrop-blur-md text-zinc-700 rounded-lg shadow-sm hover:bg-white hover:text-[#5742f5] transition-all outline-none">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-[#e6e1d6] bg-white">
                <DropdownMenuItem onClick={onEdit} className="focus:bg-[#f2f0ff] font-medium py-2.5 cursor-pointer rounded-lg text-[#19152b]">
                  <Pencil className="w-4 h-4 mr-2.5 text-[#5742f5]" />
                  Edit Automation
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onToggle} className="focus:bg-zinc-100 font-medium py-2.5 cursor-pointer rounded-lg text-zinc-700">
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2.5 text-amber-500" />
                      Pause Automation
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2.5 text-emerald-500" />
                      Resume Automation
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5 bg-[#e6e1d6]" />
                
                <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="text-red-600 focus:bg-red-50 font-medium py-2.5 cursor-pointer rounded-lg">
                  <Trash2 className="size-4 mr-2.5" />
                  Delete completely
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active/Paused Status Badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm text-[#19152b] flex items-center gap-1.5 z-10">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#5742f5]' : 'bg-zinc-400'}`} />
            {isActive ? 'Active' : 'Paused'}
          </div>
        </div>
        
        {/* Bottom Content Section */}
        <div className="p-3.5 flex flex-col flex-1 bg-white">
          <p className="text-xs text-zinc-600 line-clamp-2 mb-3 flex-1 font-medium leading-snug">
            {caption || "No caption provided"}
          </p>
          
          {/* Trigger Keywords */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {triggerKeyword.map((kw, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-[#f2f0ff] text-[#5742f5] text-[9px] rounded-md font-bold tracking-wide border border-[#5742f5]/10"
              >
                {kw}
              </span>
            ))}
          </div>
          
          {/* Analytics Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e6e1d6]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <MessageCircle className="w-3 h-3 text-[#5742f5]"/> DMs
              </span>
              <span className="text-sm font-bold text-[#19152b]">{dmsSent}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <UserPlus className="w-3 h-3 text-[#5742f5]"/> Follows
              </span>
              <span className="text-sm font-bold text-[#19152b]">{followersGained}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md p-6 rounded-[2rem] border border-[#e6e1d6] shadow-xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2 border border-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#19152b] text-center">Delete Automation?</DialogTitle>
            <DialogDescription className="text-zinc-500 text-center mt-2 font-medium">
              Are you sure you want to delete this automation? This action cannot be undone and will stop all associated bot replies.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full sm:justify-center flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 rounded-xl h-11 font-semibold border-[#e6e1d6] text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete();
              }}
              className="flex-1 rounded-xl h-11 font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}