import { ChevronLeft, Image as ImageIcon, MessageCircle } from "lucide-react";
import { FormData } from "../types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  selectedMediaData: any; // Or specific media type if defined
}

export function PreviewModal({
  isOpen,
  onClose,
  formData,
  selectedMediaData,
}: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[370px] overflow-hidden flex flex-col border-[6px] border-zinc-900 h-[750px] max-h-[95vh] relative animate-in zoom-in-95 duration-200">
        
        {/* Header Fake Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-900 rounded-b-3xl z-10" />

        {/* Header */}
        <div className="bg-white px-4 py-4 pt-8 border-b border-zinc-100 flex items-center gap-3 shrink-0">
          <button onClick={onClose}>
            <ChevronLeft className="size-6 text-zinc-900" />
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-zinc-200">
            {selectedMediaData?.url ? (
              <img src={selectedMediaData.url} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-full h-full p-2 text-zinc-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 truncate">Your Account</p>
            <p className="text-[10px] text-zinc-500">Instagram</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 flex flex-col">
          
          {/* Comment Preview Section */}
          <div className="bg-white p-4 mb-3 border-b border-zinc-200 shadow-sm shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="size-4 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Post Comment Flow</span>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0" />
              <p className="text-sm text-zinc-700 leading-tight">
                <span className="font-bold text-zinc-900 mr-1">customer</span>
                This is awesome! <span className="text-blue-500">{formData.triggerKeywords[0] || "Link"}</span> please!
              </p>
            </div>
            {formData.replyPublicly && (
              <div className="flex gap-3 ml-11 mt-1">
                <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0 overflow-hidden">
                   {selectedMediaData?.url && <img src={selectedMediaData.url} className="w-full h-full object-cover"/>}
                </div>
                <p className="text-sm text-zinc-700 leading-tight">
                  <span className="font-bold text-zinc-900 mr-1">your_account</span>
                  {formData.commentText}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 space-y-4 flex-1">
            <div className="text-center text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Direct Messages
            </div>

            {/* User Trigger Simulation (Optional context) */}
            <div className="flex justify-end">
              <div className="bg-zinc-200 text-zinc-900 px-4 py-2.5 rounded-[20px] text-sm max-w-[75%] rounded-tr-sm">
                {formData.triggerKeywords[0] || "Link"}
              </div>
            </div>

            {/* Bot Opening Message */}
            <div className="flex justify-start">
              <div className="bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] shadow-sm">
                <p className="whitespace-pre-wrap leading-relaxed">{formData.openingMessage.text}</p>
                <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-center">
                  <span className="text-blue-500 font-bold text-sm text-center w-full block">
                    {formData.openingMessage.button.text || "Button"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bot Follow Request */}
            {formData.requireFollow && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] shadow-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{formData.askFollowMessage.text}</p>
                  <div className="mt-3 pt-3 border-t border-zinc-100 space-y-3">
                    <span className="text-blue-500 font-bold text-sm block text-center w-full">
                      {formData.askFollowMessage.buttons[0]?.text || "I Followed!"}
                    </span>
                    <div className="border-t border-zinc-100 pt-3">
                      <span className="text-zinc-500 font-bold text-sm block text-center w-full">
                        Visit Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Final Goal Message */}
            {formData.templateType === "TEXT_BUTTON" ? (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] shadow-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{formData.finalGoalMessage.text}</p>
                  {formData.finalGoalMessage.buttons.map((b, i) => (
                    <div key={i} className="mt-3 pt-3 border-t border-zinc-100">
                      <span className="text-blue-500 font-bold text-sm block text-center w-full">
                        {b.text || `Link ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
                {formData.elements.map((el, i) => (
                  <div key={el.id} className="min-w-[240px] max-w-[240px] bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm shrink-0 snap-center">
                    {el.imageUrl ? (
                      <img src={el.imageUrl} className="w-full h-32 object-cover border-b border-zinc-100" />
                    ) : (
                      <div className="w-full h-32 bg-zinc-100 flex items-center justify-center border-b border-zinc-100">
                        <ImageIcon className="size-6 text-zinc-300" />
                      </div>
                    )}
                    <div className="p-3 text-center">
                      <p className="font-bold text-sm text-zinc-900 truncate">{el.title || "Card Title"}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{el.subtitle || "Card Subtitle"}</p>
                    </div>
                    <div className="flex flex-col">
                      {el.buttons.map((b, bi) => (
                        <div key={bi} className="border-t border-zinc-100 py-2.5">
                          <span className="text-sm font-bold text-blue-500 block text-center w-full">
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
        <div className="bg-white p-3 border-t border-zinc-200 shrink-0 mb-2">
          <div className="bg-zinc-100 rounded-full h-11 flex items-center px-4 text-sm text-zinc-400">
            Message...
          </div>
        </div>
      </div>
    </div>
  );
}
