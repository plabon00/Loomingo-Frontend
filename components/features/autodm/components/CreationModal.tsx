import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  X,
  ChevronLeft,
  Image as ImageIcon,
  Trash2,
  Heart,
  MessageCircle,
  ExternalLink,
  Plus,
  Lock,
  Type,
  CopyPlus,
  Upload,
  Eye,
  Loader2,
  Globe,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormData } from "../types";

// ————— Theme tokens —————
const INK = "#1d1d1f";
const PRIMARY = "#0066cc";
const PAPER = "#f5f5f7";

const uniformButtonInputClass =
  "w-full h-11 px-4 text-sm bg-white border border-[var(--apple-hairline)] rounded-[20px] font-semibold !text-[var(--apple-ink)] transition-all focus-visible:ring-1 focus-visible:ring-[var(--apple-blue)]/30 shadow-sm !placeholder-zinc-400 placeholder:font-normal text-center hover:border-[var(--apple-blue)]/35 cursor-pointer focus:bg-white";

const uniformTextAreaClass =
  "w-full text-sm border border-[var(--apple-hairline)] rounded-2xl p-4 bg-white focus:ring-1 focus:ring-[var(--apple-blue)]/30 outline-none min-h-[90px] !text-[var(--apple-ink)] !placeholder-zinc-400 shadow-sm transition-all";

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalStep: number;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
  isSubmitting: boolean;
  availableMedia: any[];
  isLoadingMedia: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSelectMedia: (id: string) => void;
  selectedMediaData: any;
  setIsPreviewOpen: (isOpen: boolean) => void;
  handleSubmit: () => void;
}

export function CreationModal({
  isOpen,
  onClose,
  modalStep,
  setModalStep,
  isEditing,
  isSubmitting,
  availableMedia,
  isLoadingMedia,
  formData,
  setFormData,
  handleSelectMedia,
  selectedMediaData,
  setIsPreviewOpen,
  handleSubmit
}: CreationModalProps) {
  
  const repliesContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (formData.replyPublicly && repliesContainerRef.current) {
      gsap.fromTo(
        ".gsap-reply-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [formData.replyPublicly, formData.commentReplies.length]);

  if (!isOpen) return null;

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newKeyword = formData.keywordInput.trim().toLowerCase();
      if (newKeyword && !formData.triggerKeywords.includes(newKeyword)) {
        setFormData((prev) => ({
          ...prev,
          triggerKeywords: [...prev.triggerKeywords, newKeyword],
          keywordInput: "",
        }));
      }
    }
  };

  const removeKeyword = (kwToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      triggerKeywords: prev.triggerKeywords.filter((kw) => kw !== kwToRemove),
    }));
  };

  const handleImageSelect = (elemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === elemId
          ? { ...el, imageFile: file, imageUrl: URL.createObjectURL(file) }
          : el
      ),
    }));
  };

  const addFinalButton = () => {
    if (formData.finalGoalMessage.buttons.length < 3) {
      setFormData((prev) => ({
        ...prev,
        finalGoalMessage: {
          ...prev.finalGoalMessage,
          buttons: [
            ...prev.finalGoalMessage.buttons,
            { text: "New Link", url: "" },
          ],
        },
      }));
    }
  };

  const updateFinalButton = (index: number, field: "text" | "url", value: string) => {
    setFormData((prev) => {
      const newButtons = [...prev.finalGoalMessage.buttons];
      newButtons[index] = { ...newButtons[index], [field]: value };
      return {
        ...prev,
        finalGoalMessage: { ...prev.finalGoalMessage, buttons: newButtons },
      };
    });
  };

  const removeFinalButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      finalGoalMessage: {
        ...prev.finalGoalMessage,
        buttons: prev.finalGoalMessage.buttons.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        aria-describedby={undefined}
        className="w-[95%] max-w-[420px] p-0 border-[var(--apple-hairline)] bg-white rounded-[18px] overflow-hidden flex flex-col h-[90dvh] md:aspect-[9/16] md:h-auto md:max-h-[90vh] sm:rounded-[18px] shadow-2xl [&>button:last-child]:hidden outline-none gap-0"
        style={{ backgroundColor: PAPER }}
      >
        <DialogTitle className="sr-only">Automation Setup</DialogTitle>
        
        {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--apple-hairline)] shrink-0 bg-white">
              {modalStep > 0 && !isEditing ? (
                <button
                  onClick={() => setModalStep((s) => s - 1)}
                  className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="size-5" />
                </button>
              ) : (
                <div className="w-9" />
              )}

              <div className="text-center">
                <h3 className="font-semibold text-lg" style={{ color: INK }}>
                  {modalStep === 0
                    ? "Select Post"
                    : isEditing
                      ? "Edit Automation"
                      : "Setup Automation"}
                </h3>
                {modalStep > 0 && !isEditing && (
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Step {modalStep} of 3
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500"
                disabled={isSubmitting}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {/* SCREEN 0: Select Media */}
              {modalStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500 text-center mb-6">
                    Select an Instagram post or reel to automate.
                  </p>
                  {isLoadingMedia ? (
                    <div className="flex justify-center py-10 animate-pulse text-zinc-300">
                      <ImageIcon className="size-10" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {/* Universal / Any Post Card */}
                      <div
                        onClick={() => handleSelectMedia("GLOBAL")}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-sm cursor-pointer flex flex-col items-center justify-center p-2 text-center group ${formData.mediaId === "GLOBAL" ? "border-zinc-900 shadow-md scale-[1.02]" : "border-zinc-200 hover:border-zinc-300 hover:opacity-90"}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Globe className="size-5 text-zinc-800" />
                        </div>
                        <span className="text-[11px] font-bold text-zinc-900 leading-tight">Universal<br/>Rule</span>
                        <p className="text-[8px] text-zinc-500 mt-1 leading-tight px-1">Applies to all posts</p>
                      </div>

                      {availableMedia.map((media) => (
                        <div
                          key={media.id}
                          onClick={() => !media.hasActiveAutomation && handleSelectMedia(media.id)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-white shadow-sm ${
                            media.hasActiveAutomation 
                              ? "cursor-not-allowed border-zinc-200" 
                              : `cursor-pointer ${formData.mediaId === media.id ? "border-zinc-900 shadow-md scale-[1.02]" : "border-transparent hover:opacity-80"}`
                          }`}
                        >
                          {media.url ? (
                            <img
                              src={media.url}
                              alt="IG Post"
                              className={`w-full h-full object-cover ${media.hasActiveAutomation ? "opacity-30 grayscale" : ""}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className={`size-6 ${media.hasActiveAutomation ? "opacity-20" : "opacity-50"}`} />
                            </div>
                          )}
                          {media.hasActiveAutomation && (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/10 backdrop-blur-[1px]">
                              <span className="bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-center">Active<br/>Automation</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 1: Triggers & Comment */}
              {modalStep === 1 && (
                <div className="space-y-5 flex flex-col h-full">
                  {/* Selected Media Preview Card */}
                  {selectedMediaData && (
                    <div className="flex gap-4 p-4 border border-zinc-200 rounded-2xl bg-white shadow-sm mb-2">
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 relative">
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider z-10">
                          {selectedMediaData.mediaType.replace("_", " ")}
                        </div>
                        {selectedMediaData.url ? (
                          <img
                            src={selectedMediaData.url}
                            alt="Selected"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="size-5 opacity-40 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <p
                          className="text-xs text-zinc-500 line-clamp-2 mb-2 font-medium"
                          title={selectedMediaData.caption}
                        >
                          {selectedMediaData.caption || "No caption available"}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 mb-3 mt-auto">
                          <span className="flex items-center gap-1.5">
                            <Heart className="size-3.5 text-zinc-400" />{" "}
                            {selectedMediaData.likeCount}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageCircle className="size-3.5 text-zinc-400" />{" "}
                            {selectedMediaData.commentsCount}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] px-3 w-fit bg-zinc-50 border-zinc-200 text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                          onClick={() =>
                            window.open(selectedMediaData.permalink, "_blank")
                          }
                        >
                          <ExternalLink className="size-3 mr-1.5" /> View on IG
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Trigger Mode */}
                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                          <Zap className="size-3.5 text-zinc-500" /> Reply to ANY comment
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          No keyword required — every comment on this post triggers the DM.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            isTriggerless: !formData.isTriggerless,
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-colors relative shadow-inner shrink-0 ${formData.isTriggerless ? "bg-zinc-900" : "bg-zinc-200"}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.isTriggerless ? "translate-x-6" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>

                    {/* Keywords are irrelevant in triggerless mode — hide the input */}
                    {!formData.isTriggerless && (
                      <div className="pt-4 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="text-sm font-semibold text-zinc-900 mb-1 block">
                          Trigger Keywords
                        </label>
                        <p className="text-xs text-zinc-500 mb-4">
                          Pro Tip: Emojis work perfectly! Users don't need to type the exact word—if they include your emoji anywhere in their comment, we'll catch it.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.triggerKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1 rounded-full text-xs flex items-center font-semibold shadow-sm"
                            >
                              {kw}{" "}
                              <X
                                className="size-3 ml-2 cursor-pointer hover:text-zinc-900"
                                onClick={() => removeKeyword(kw)}
                              />
                            </span>
                          ))}
                        </div>
                        <Input
                          value={formData.keywordInput}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              keywordInput: e.target.value,
                            })
                          }
                          onKeyDown={handleAddKeyword}
                          placeholder="Type a keyword or emoji (e.g. 'Link', 🎁, 🙌) and press Enter"
                          /* FIXED VISIBILITY: Added !text-zinc-900 and placeholder:text-zinc-500 */
                          className="!text-zinc-900 placeholder:text-zinc-500 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Auto-Reply Comment Section */}
                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900">Reply to comment publicly?</h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          Automatically reply in the comment section.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            replyPublicly: !formData.replyPublicly,
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${formData.replyPublicly ? "bg-zinc-900" : "bg-zinc-200"}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.replyPublicly ? "translate-x-6" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>

                    {formData.replyPublicly && (
                      <div className="animate-in fade-in slide-in-from-top-2 pt-3 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-zinc-900 block">
                            What to reply
                          </label>
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {formData.commentReplies.length}/5
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-4">
                          Add multiple replies! We'll cycle through them randomly so Instagram doesn't flag you for spam.
                        </p>
                        
                        <div className="space-y-3" ref={repliesContainerRef}>
                          {formData.commentReplies.map((reply, idx) => (
                            <div key={idx} className="gsap-reply-item relative group">
                              <textarea
                                className={uniformTextAreaClass}
                                value={reply}
                                onChange={(e) => {
                                  const newReplies = [...formData.commentReplies];
                                  newReplies[idx] = e.target.value;
                                  setFormData({ ...formData, commentReplies: newReplies });
                                }}
                                placeholder="Type your reply here..."
                              />
                              {formData.commentReplies.length > 1 && (
                                <button
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      commentReplies: formData.commentReplies.filter((_, i) => i !== idx)
                                    });
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-white border border-zinc-200 rounded-md text-zinc-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {formData.commentReplies.length < 5 && (
                          <Button
                            variant="outline"
                            className="w-full border-dashed border-2 border-zinc-200 text-zinc-700 font-medium mt-3 h-11 text-sm rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                commentReplies: [...formData.commentReplies, ""]
                              });
                            }}
                          >
                            <Plus className="mr-2 size-4" /> Add Another Variation
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              
              {/* SCREEN 2: Initial Message & Follow Gate */}
              {modalStep === 2 && (
                <div className="space-y-5">
                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-sm font-semibold text-zinc-900 mb-3 block">
                        Opening DM Text
                      </label>
                      <textarea
                        className={uniformTextAreaClass}
                        value={formData.openingMessage.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingMessage: {
                              ...formData.openingMessage,
                              text: e.target.value,
                            },
                          })
                        }
                        placeholder="Hey there! Ready to get started?"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <label className="text-[10px] font-bold block text-zinc-400 uppercase tracking-widest mt-3">
                        Quick Reply Button
                      </label>
                      <Input
                        className={uniformButtonInputClass}
                        value={formData.openingMessage.button.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingMessage: {
                              ...formData.openingMessage,
                              button: {
                                ...formData.openingMessage.button,
                                text: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="Button Text"
                      />
                    </div>
                  </div>

                  {/* Require Follow up to Step 2 as requested */}
                  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm mt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">Require Follow?</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        User must follow you to get the final link.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          requireFollow: !formData.requireFollow,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${formData.requireFollow ? "bg-zinc-900" : "bg-zinc-200"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${formData.requireFollow ? "translate-x-6" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>

                  {/* Ask Follow Form (Appears immediately if Yes) */}
                  {formData.requireFollow && (
                    <div className="p-5 border border-zinc-200 bg-white rounded-2xl space-y-5 animate-in slide-in-from-top-2 fade-in duration-200 shadow-sm">
                      <div>
                        <label className="text-sm font-semibold mb-3 flex items-center text-zinc-900">
                          Follow Request Message
                        </label>
                        <textarea
                          className={uniformTextAreaClass}
                          value={formData.askFollowMessage.text}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              askFollowMessage: {
                                ...formData.askFollowMessage,
                                text: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3 pt-3 border-t border-zinc-100">
                        <Input
                          value={
                            formData.askFollowMessage.buttons[0]?.text || ""
                          }
                          onChange={(e) => {
                            const newBtns = [
                              ...formData.askFollowMessage.buttons,
                            ];
                            if (!newBtns[0])
                              newBtns[0] = { text: "", url: "" };
                            newBtns[0].text = e.target.value;
                            setFormData({
                              ...formData,
                              askFollowMessage: {
                                ...formData.askFollowMessage,
                                buttons: newBtns,
                              },
                            });
                          }}
                          className={uniformButtonInputClass}
                          placeholder="Button 1 (e.g. I Followed!)"
                        />
                        <div className="relative">
                          <div
                            className={`${uniformButtonInputClass} flex items-center justify-center bg-zinc-50 border-dashed text-zinc-400 select-none cursor-not-allowed hover:bg-zinc-50`}
                          >
                            <Lock className="size-3 mr-2" /> Visit Profile
                            (Auto-Linked)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 3: Final Goal / Link */}
              {modalStep === 3 && (
                <div className="space-y-5">
                  
                  {/* Template Type Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-900 block">
                      Final Delivery Template
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            templateType: "TEXT_BUTTON",
                          })
                        }
                        className={`p-4 border-2 rounded-2xl text-left transition-all ${
                          formData.templateType === "TEXT_BUTTON"
                            ? "border-zinc-900 bg-zinc-50 shadow-md"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <Type className="size-5 mb-2 text-zinc-700" />
                        <p className="text-sm font-semibold text-zinc-900">
                          Text + Link Buttons
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Simple text with up to 3 links
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            templateType: "BANNER_BUTTON",
                          })
                        }
                        className={`p-4 border-2 rounded-2xl text-left transition-all ${
                          formData.templateType === "BANNER_BUTTON"
                            ? "border-zinc-900 bg-zinc-50 shadow-md"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <ImageIcon className="size-5 mb-2 text-zinc-700" />
                        <p className="text-sm font-semibold text-zinc-900">
                          Card Carousel
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Image cards with buttons
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL FINAL MESSAGE TEXT: ONLY SHOWS FOR TEXT_BUTTON */}
                  {formData.templateType === "TEXT_BUTTON" && (
                    <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-5 animate-in fade-in duration-200">
                      <div>
                        <label className="text-sm font-semibold text-zinc-900 mb-3 block">
                          Final Message Text
                        </label>
                        <p className="text-xs text-zinc-500 mb-3">Which type of response do you want for your audience?</p>
                        <textarea
                          className={uniformTextAreaClass}
                          value={formData.finalGoalMessage.text}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              finalGoalMessage: {
                                ...formData.finalGoalMessage,
                                text: e.target.value,
                              },
                            })
                          }
                          placeholder="Here is your requested content!"
                        />
                      </div>

                      <div className="space-y-3 pt-2 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <label className="text-[10px] font-bold block text-zinc-400 uppercase tracking-widest">
                            Attached Links
                          </label>
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {formData.finalGoalMessage.buttons.length}/3
                          </span>
                        </div>

                        {formData.finalGoalMessage.buttons.map((btn, idx) => (
                          <div
                            key={idx}
                            className="relative p-4 border border-zinc-200 bg-zinc-50/50 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between pb-1">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Button {idx + 1}
                              </span>
                              <button
                                onClick={() => removeFinalButton(idx)}
                                className="text-zinc-400 hover:text-red-600 p-1 bg-white border border-zinc-200 rounded-md transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <Input
                              className={uniformButtonInputClass}
                              placeholder="Label (e.g. Download Now)"
                              value={btn.text}
                              onChange={(e) =>
                                updateFinalButton(idx, "text", e.target.value)
                              }
                            />

                            <Input
                              className="text-sm bg-white border border-zinc-200 rounded-xl h-11 focus-visible:ring-zinc-300 px-4 text-zinc-900 placeholder:text-zinc-400 shadow-sm"
                              placeholder="🔗 URL (https://...)"
                              value={btn.url}
                              onChange={(e) =>
                                updateFinalButton(idx, "url", e.target.value)
                              }
                            />
                          </div>
                        ))}

                        {formData.finalGoalMessage.buttons.length < 3 && (
                          <Button
                            variant="outline"
                            className="w-full border-dashed border-2 border-zinc-200 text-zinc-700 font-medium mt-3 h-11 text-sm rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                            onClick={addFinalButton}
                          >
                            <Plus className="mr-2 size-4" /> Add Another Link
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CAROUSEL / BANNER_BUTTON Fields */}
                  {formData.templateType === "BANNER_BUTTON" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Horizontal Scroll Area for Elements */}
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                        {formData.elements.map((elem, eIdx) => (
                          <div key={elem.id} className="min-w-[320px] max-w-[320px] shrink-0 border border-zinc-200 bg-white rounded-3xl p-5 shadow-sm snap-center">
                            
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card {eIdx + 1}</span>
                              {formData.elements.length > 1 && (
                                <button
                                  onClick={() => setFormData(prev => ({ ...prev, elements: prev.elements.filter((_, i) => i !== eIdx) }))}
                                  className="p-1 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-full transition-colors"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>

                            {/* Image Upload */}
                            <div className="mb-4">
                              {elem.imageUrl ? (
                                <div className="relative rounded-xl overflow-hidden border border-zinc-200">
                                  <img src={elem.imageUrl} alt="Banner" className="w-full h-32 object-cover" />
                                  <button
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      elements: prev.elements.map((el, i) => i === eIdx ? { ...el, imageUrl: "", imageFile: null } : el)
                                    }))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all">
                                  <Upload className="size-6 text-zinc-300 mb-2" />
                                  <span className="text-xs text-zinc-500 font-medium">Upload Image</span>
                                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleImageSelect(elem.id)} />
                                </label>
                              )}
                            </div>

                            {/* Title & Subtitle */}
                            <div className="space-y-3 mb-5">
                              <div>
                                <Input
                                  /* FIXED VISIBILITY: Added !text-zinc-900 and placeholder:text-zinc-500 */
                                  className="!text-zinc-900 placeholder:text-zinc-500 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl text-sm h-10 font-semibold"
                                  value={elem.title}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 80)
                                      setFormData(prev => ({
                                        ...prev,
                                        elements: prev.elements.map((el, i) => i === eIdx ? { ...el, title: e.target.value } : el)
                                      }));
                                  }}
                                  placeholder="Title (Max 80)"
                                  maxLength={80}
                                />
                              </div>
                              <div>
                                <Input
                                  /* FIXED VISIBILITY: Added !text-zinc-900 and placeholder:text-zinc-500 */
                                  className="!text-zinc-900 placeholder:text-zinc-500 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl text-xs h-10"
                                  value={elem.subtitle}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 80)
                                      setFormData(prev => ({
                                        ...prev,
                                        elements: prev.elements.map((el, i) => i === eIdx ? { ...el, subtitle: e.target.value } : el)
                                      }));
                                  }}
                                  placeholder="Subtitle (Max 80)"
                                  maxLength={80}
                                />
                              </div>
                            </div>

                            {/* Buttons Builder (Max 2 for generic) */}
                            <div className="space-y-3 pt-3 border-t border-zinc-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Buttons</span>
                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{elem.buttons.length}/2</span>
                              </div>
                              
                              {elem.buttons.map((btn, bIdx) => (
                                <div key={bIdx} className="space-y-2 relative group">
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={btn.type}
                                      onChange={(e) => {
                                        const newType = e.target.value as "web_url" | "postback";
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, type: newType } : b)
                                          } : el)
                                        }));
                                      }}
                                      className="text-[10px] font-bold text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 cursor-pointer outline-none"
                                    >
                                      <option value="web_url">🔗 Link</option>
                                      <option value="postback">⚡ Action</option>
                                    </select>
                                    
                                    <Input
                                      className={uniformButtonInputClass}
                                      placeholder="Button Text"
                                      value={btn.title}
                                      onChange={(e) => {
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, title: e.target.value } : b)
                                          } : el)
                                        }));
                                      }}
                                    />
                                    
                                    {elem.buttons.length > 1 && (
                                      <button
                                        onClick={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            elements: prev.elements.map((el, i) => i === eIdx ? {
                                              ...el, buttons: el.buttons.filter((_, bi) => bi !== bIdx)
                                            } : el)
                                          }));
                                        }}
                                        className="text-zinc-400 hover:text-red-500 p-1.5 shrink-0 transition-colors"
                                      >
                                        <Trash2 className="size-4" />
                                      </button>
                                    )}
                                  </div>
                                  
                                  {btn.type === "web_url" && (
                                    <Input
                                      className="text-xs bg-zinc-50 border-zinc-200 rounded-xl h-9 px-3 w-full"
                                      placeholder="https://..."
                                      value={btn.url}
                                      onChange={(e) => {
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, url: e.target.value } : b)
                                          } : el)
                                        }));
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                              
                              {elem.buttons.length < 2 && (
                                <button
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      elements: prev.elements.map((el, i) => i === eIdx ? {
                                        ...el, buttons: [...el.buttons, { type: "postback", title: "Action", url: "", payload: "" }]
                                      } : el)
                                    }));
                                  }}
                                  className="w-full mt-2 text-xs font-semibold text-zinc-600 bg-zinc-50 border border-zinc-200 border-dashed rounded-xl py-2 hover:bg-zinc-100 transition-colors"
                                >
                                  + Add Button
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Card Button */}
                        {formData.elements.length < 10 && (
                          <div 
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                elements: [...prev.elements, {
                                  id: `elem_${Date.now()}`,
                                  imageUrl: "", imageFile: null, title: "", subtitle: "",
                                  buttons: [{ type: "postback", title: "Button", url: "", payload: "" }]
                                }]
                              }));
                            }}
                            className="min-w-[80px] shrink-0 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all text-zinc-400 group"
                          >
                            <CopyPlus className="size-6 group-hover:scale-110 transition-transform mb-2" />
                            <span className="text-[10px] font-bold uppercase">Add Card</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Explicit Back & Next Footer Navigation */}
            {modalStep > 0 && (
              <div className="p-4 border-t border-[var(--apple-hairline)] bg-white shrink-0 flex gap-2 rounded-b-[2rem]">
                {(!isEditing || modalStep > 1) && (
                  <Button
                    variant="outline"
                    onClick={() => setModalStep((s) => s - 1)}
                    className="w-1/4 h-11 rounded-xl text-sm font-semibold border-[var(--apple-hairline)] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 px-0 transition-colors"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}

                {/* --- PREVIEW BUTTON ADDED FOR STEP 3 --- */}
                {modalStep === 3 && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-1/3 h-11 rounded-xl text-sm font-semibold transition-colors px-0 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    disabled={isSubmitting}
                  >
                    <Eye className="mr-1.5 size-4" /> Preview
                  </Button>
                )}

                <Button
                  onClick={() =>
                    modalStep === 3
                      ? handleSubmit()
                      : setModalStep((s) => s + 1)
                  }
                  className="flex-1 h-11 rounded-xl text-sm font-semibold flex items-center justify-center bg-zinc-900 text-white transition-all hover:bg-zinc-800 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                    </>
                  ) : modalStep === 3 ? (
                    isEditing ? "Update Auto-DM" : "Start Auto-DM"
                  ) : (
                    "Next Step"
                  )}
                </Button>
              </div>
            )}
      </DialogContent>
    </Dialog>
  );
}
