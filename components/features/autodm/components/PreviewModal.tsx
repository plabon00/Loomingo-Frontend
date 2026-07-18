import { useRef, useState, useEffect } from "react";
import { ChevronLeft, Image as ImageIcon, MessageCircle } from "lucide-react";
import { FormData } from "../types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ————— Theme tokens —————
const PRIMARY = "#5742f5";
const INK = "#152436";
const PAPER = "#f6f4ef";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  selectedMediaData: any;
}

export function PreviewModal({
  isOpen,
  onClose,
  formData,
  selectedMediaData,
}: PreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && containerRef.current) {
      // Stagger animate chat bubbles
      gsap.fromTo(
        ".chat-bubble-anim",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="p-0 border-none bg-transparent shadow-none w-[95%] max-w-[370px] [&>button:last-child]:hidden outline-none flex justify-center h-[100dvh] md:h-auto items-center"
      >
        <DialogTitle className="sr-only">Live Preview</DialogTitle>
        
        <div
          ref={containerRef}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full overflow-hidden flex flex-col border-[6px] aspect-[9/19.5] max-h-[85vh] sm:max-h-[90vh] relative"
          style={{ borderColor: INK }}
        >
          {/* Header Fake Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 rounded-b-[20px] z-10" style={{ backgroundColor: INK }} />

          {/* Header */}
          <div className="bg-white px-4 py-4 pt-10 border-b border-[#e6e1d6] flex items-center gap-3 shrink-0">
            <button onClick={onClose} className="p-1 -ml-1 rounded-full hover:bg-zinc-100 transition-colors">
              <ChevronLeft className="size-6" style={{ color: INK }} />
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-[#e6e1d6] shadow-sm">
              {selectedMediaData?.url ? (
                <img src={selectedMediaData.url} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-full h-full p-2 text-zinc-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: INK }}>Your Account</p>
              <p className="text-[10px] font-medium text-zinc-500">Instagram</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar" style={{ backgroundColor: PAPER }}>
            
            {/* Comment Preview Section */}
            <div className="bg-white p-4 mb-3 border-b border-[#e6e1d6] shadow-sm shrink-0 chat-bubble-anim">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="size-4 text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Post Comment Flow</span>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-[#e6e1d6] shrink-0" />
                <p className="text-sm text-zinc-600 leading-tight">
                  <span className="font-bold mr-1.5" style={{ color: INK }}>customer</span>
                  This is awesome! <span className="font-medium" style={{ color: PRIMARY }}>{formData.triggerKeywords[0] || "Link"}</span> please!
                </p>
              </div>
              {formData.replyPublicly && (
                <div className="flex gap-3 ml-11 mt-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 border border-[#e6e1d6] shrink-0 overflow-hidden shadow-sm">
                    {selectedMediaData?.url && <img src={selectedMediaData.url} className="w-full h-full object-cover"/>}
                  </div>
                  <p className="text-sm text-zinc-600 leading-tight">
                    <span className="font-bold mr-1.5" style={{ color: INK }}>your_account</span>
                    {formData.commentReplies && formData.commentReplies.length > 0 
                      ? formData.commentReplies[0] 
                      : "Check your DMs!"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 space-y-4 flex-1">
              <div className="text-center text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-4 chat-bubble-anim">
                Direct Messages
              </div>

              {/* User Trigger Simulation */}
              <div className="flex justify-end chat-bubble-anim">
                <div className="bg-[#e6e1d6]/50 text-[#152436] px-4 py-2.5 rounded-[20px] rounded-tr-sm text-[15px] max-w-[75%] shadow-sm">
                  {formData.triggerKeywords[0] || "Link"}
                </div>
              </div>

              {/* Bot Opening Message */}
              <div className="flex justify-start chat-bubble-anim">
                <div className="bg-white border border-[#e6e1d6] px-4 py-3 rounded-2xl rounded-tl-sm text-[15px] max-w-[85%] shadow-sm" style={{ color: INK }}>
                  <p className="whitespace-pre-wrap leading-relaxed">{formData.openingMessage.text}</p>
                  <div className="mt-3 pt-3 border-t border-[#e6e1d6] flex justify-center">
                    <span className="font-semibold text-sm text-center w-full block" style={{ color: PRIMARY }}>
                      {formData.openingMessage.button.text || "Button"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bot Follow Request */}
              {formData.requireFollow && (
                <div className="flex justify-start chat-bubble-anim">
                  <div className="bg-white border border-[#e6e1d6] px-4 py-3 rounded-2xl rounded-tl-sm text-[15px] max-w-[85%] shadow-sm" style={{ color: INK }}>
                    <p className="whitespace-pre-wrap leading-relaxed">{formData.askFollowMessage.text}</p>
                    <div className="mt-3 pt-3 border-t border-[#e6e1d6] space-y-3">
                      <span className="font-semibold text-sm block text-center w-full" style={{ color: PRIMARY }}>
                        {formData.askFollowMessage.buttons[0]?.text || "I Followed!"}
                      </span>
                      <div className="border-t border-[#e6e1d6] pt-3">
                        <span className="text-zinc-500 font-semibold text-sm block text-center w-full">
                          Visit Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bot Final Goal Message */}
              {formData.templateType === "TEXT_BUTTON" ? (
                <div className="flex justify-start chat-bubble-anim">
                  <div className="bg-white border border-[#e6e1d6] px-4 py-3 rounded-2xl rounded-tl-sm text-[15px] max-w-[85%] shadow-sm" style={{ color: INK }}>
                    <p className="whitespace-pre-wrap leading-relaxed">{formData.finalGoalMessage.text}</p>
                    {formData.finalGoalMessage.buttons.map((b, i) => (
                      <div key={i} className="mt-3 pt-3 border-t border-[#e6e1d6]">
                        <span className="font-semibold text-sm block text-center w-full" style={{ color: PRIMARY }}>
                          {b.text || `Link ${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory chat-bubble-anim">
                  {formData.elements.map((el, i) => (
                    <div key={el.id} className="min-w-[240px] max-w-[240px] bg-white border border-[#e6e1d6] rounded-2xl overflow-hidden shadow-sm shrink-0 snap-center">
                      {el.imageUrl ? (
                        <img src={el.imageUrl} className="w-full h-32 object-cover border-b border-[#e6e1d6]" />
                      ) : (
                        <div className="w-full h-32 bg-[#f6f4ef] flex items-center justify-center border-b border-[#e6e1d6]">
                          <ImageIcon className="size-6 text-zinc-300" />
                        </div>
                      )}
                      <div className="p-3 text-center">
                        <p className="font-bold text-sm truncate" style={{ color: INK }}>{el.title || "Card Title"}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{el.subtitle || "Card Subtitle"}</p>
                      </div>
                      <div className="flex flex-col">
                        {el.buttons.map((b, bi) => (
                          <div key={bi} className="border-t border-[#e6e1d6] py-2.5">
                            <span className="text-sm font-semibold block text-center w-full" style={{ color: PRIMARY }}>
                              {b.title || "Button"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area (Visual Only) */}
          <div className="bg-white p-3 border-t border-[#e6e1d6] shrink-0">
            <div className="bg-[#f6f4ef] border border-[#e6e1d6] rounded-full h-11 flex items-center px-4 text-sm text-zinc-400 font-medium">
              Message...
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
