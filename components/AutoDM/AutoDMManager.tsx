"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Play,
  BookOpen,
  Send,
  UserPlus,
  Zap,
  Search,
  X,
  ChevronLeft,
  Image as ImageIcon,
  Trash2,
  Heart,
  MessageCircle,
  ExternalLink,
  Pencil,
  Loader2,
  Lock,
  Settings,
  Upload,
  Type,
  CopyPlus,
  Eye // Imported Eye icon for the preview button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AutomationMediaCard from "@/components/ui/automation-card";
import { auth } from "@/lib/firebase";
import { InstagramSettingsModal } from "@/components/instagram-settings-modal";

type AutomationStatsDTO = {
  totalDmsSent: number;
  totalFollowersGained: number;
  activeAutomationsCount: number;
};

type AutomationCardDTO = {
  id: string;
  thumbnailUrl: string;
  caption: string;
  username: string;
  triggerKeyword: string[];
  isActive: boolean;
  mediaType?: string;
  followersGained: number;
  dmsSent: number;
};

type CarouselElement = {
  id: string;
  imageUrl: string;
  imageFile: File | null;
  title: string;
  subtitle: string;
  buttons: Array<{ type: "web_url" | "postback"; title: string; url: string; payload: string }>;
};

const defaultFormData = {
  mediaId: "",
  triggerKeywords: [] as string[],
  keywordInput: "",
  
  replyPublicly: true,
  commentText: "Thanks for commenting! Check your DMs 🚀",
  
  templateType: "TEXT_BUTTON" as "TEXT_BUTTON" | "BANNER_BUTTON",
  
  // Array of elements for the Generic Template Carousel
  elements: [
    {
      id: "elem_1",
      imageUrl: "",
      imageFile: null,
      title: "",
      subtitle: "",
      buttons: [
        { type: "web_url" as const, title: "Visit Link", url: "", payload: "" },
      ],
    }
  ] as CarouselElement[],

  openingMessage: {
    text: "Hey! Here is the link you asked for 👇",
    button: { text: "Get Access", url: "" },
  },

  requireFollow: false,
  askFollowMessage: {
    text: "Before I send the link, please follow our page! It helps us a lot. 🙏",
    buttons: [{ text: "I Followed!", url: "" }],
  },

  finalGoalMessage: {
    text: "Awesome, thanks for following! Here is your exclusive content.",
    buttons: [{ text: "Download Guide", url: "" }],
  },
};

export default function AutoDMManager() {
  const [stats, setStats] = useState({
    totalDmsSent: 0,
    totalFollowersGained: 0,
    activeAutomationsCount: 0,
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [automations, setAutomations] = useState<AutomationCardDTO[]>([]);
  const [isLoadingAutomations, setIsLoadingAutomations] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [availableMedia, setAvailableMedia] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Added Preview State

  const [isEditing, setIsEditing] = useState(false);

  const [filterTab, setFilterTab] = useState<"all" | "active" | "inactive">("all");
  const [formData, setFormData] = useState(defaultFormData);

  const loadAutomations = async (userToken: string, businessId: string) => {
    setIsLoadingAutomations(true);
    try {
      const response = await fetch(
        `/api/auto-dm/automations/dashboard/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        const automationList = data.automations || [];

        setAutomations(automationList);

        const activeCount = automationList.filter(
          (automation: AutomationCardDTO) => automation.isActive,
        ).length;

        setStats({
          totalDmsSent: data.stats?.totalDmsSent || 0,
          totalFollowersGained: data.stats?.totalFollowersGained || 0,
          activeAutomationsCount: activeCount,
        });
      }
    } catch (error) {
      console.error("Network error fetching automations:", error);
    } finally {
      setIsLoadingAutomations(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const activeInstagramId = localStorage.getItem("activeInstagramId");

        if (activeInstagramId) {
          loadAutomations(token, activeInstagramId);
        } else {
          setIsLoadingAutomations(false);
        }
      } else {
        setIsLoadingAutomations(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const selectedMediaData = availableMedia.find(
    (m) => m.id === formData.mediaId,
  );

  const filteredAutomations = automations.filter((auto) => {
    if (filterTab === "active") return auto.isActive === true;
    if (filterTab === "inactive") return auto.isActive === false;
    return true;
  });

  const uniformButtonInputClass =
    "w-full h-11 px-4 text-sm bg-zinc-100/80 border border-zinc-200 rounded-[20px] font-semibold !text-black transition-all focus-visible:ring-1 focus-visible:ring-zinc-300 shadow-sm !placeholder-zinc-500 placeholder:font-normal text-center hover:bg-zinc-200/50 cursor-pointer focus:bg-white";

  const uniformTextAreaClass = 
    "w-full text-sm border border-zinc-200 rounded-2xl p-4 bg-white focus:ring-1 focus:ring-zinc-300 outline-none min-h-[90px] !text-black !placeholder-zinc-500 shadow-sm transition-all";

  // --- HANDLERS ---
  const uploadToImgbb = async (file: File): Promise<string> => {
    try {
      const apiKey = "180243595d24120bf44f95066ee4384a";
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      return data.data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleImageSelect = (elemId: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }
    
    setFormData(prev => ({
        ...prev,
        elements: prev.elements.map(el => el.id === elemId ? { ...el, imageFile: file, imageUrl: URL.createObjectURL(file) } : el)
    }));
  };

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setModalStep(0);
    setIsEditing(false);
    setFormData(defaultFormData);
    setIsLoadingMedia(true);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const activeInstagramId = localStorage.getItem("activeInstagramId");
      if (!activeInstagramId) return;

      const response = await fetch(
        `/api/v1/getAll/my_media/${activeInstagramId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        let rawMediaArray: any[] = Array.isArray(data)
          ? data
          : (Object.values(data).find((val) => Array.isArray(val)) as any[]) ||
            [];

        const mappedMedia = rawMediaArray.map((item: any, index: number) => {
          const autoFoundUrl = Object.values(item).find(
            (val) =>
              typeof val === "string" &&
              (val.startsWith("http://") || val.startsWith("https://")),
          );
          return {
            id: item.id || item.mediaId || item.igId || `fallback-id-${index}`,
            url:
              autoFoundUrl ||
              item.thumbnailUrl ||
              item.mediaUrl ||
              item.imageUrl ||
              item.url ||
              null,
            permalink: item.permalink || item.mediaUrl || autoFoundUrl || "#",
            caption: item.caption || "",
            likeCount: item.likeCount || item.like_count || 0,
            commentsCount: item.commentsCount || item.comments_count || 0,
            mediaType: item.mediaType || item.media_type || "POST",
          };
        });
        setAvailableMedia(mappedMedia);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPreviewOpen(false);
    setFormData(defaultFormData);
    setModalStep(0);
    setIsEditing(false);
  };

  const handleSelectMedia = (id: string) => {
    setFormData((prev) => ({ ...prev, mediaId: id }));
    setModalStep(1);
  };

  const handleEdit = async (automation: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(
        `/api/v1/automation/rule/${automation.id || automation.mediaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const ruleData = await response.json();

        setAvailableMedia([
          {
            id: automation.id || automation.mediaId,
            url: automation.thumbnailUrl,
            caption: automation.caption,
            mediaType: "POST",
            permalink: "#",
            likeCount: 0,
            commentsCount: 0,
          },
        ]);

        const hasBanner = ruleData.finalGoalMessage?.templateType === "BANNER_BUTTON";
        let loadedElements: CarouselElement[] = [];
        
        if (hasBanner && ruleData.finalGoalMessage?.elements?.length > 0) {
           loadedElements = ruleData.finalGoalMessage.elements.map((e: any, idx: number) => ({
              id: `elem_${idx}`,
              imageUrl: e.imageUrl || "",
              imageFile: null,
              title: e.title || "",
              subtitle: e.subtitle || "",
              buttons: e.buttons?.map((b: any) => ({
                 type: b.type || "postback",
                 title: b.title || "",
                 url: b.url || "",
                 payload: ""
              })) || []
           }));
        } else {
           loadedElements = defaultFormData.elements;
        }

        setFormData({
          mediaId: automation.id || automation.mediaId,
          triggerKeywords: ruleData.triggerKeywords || [],
          keywordInput: "",
          
          replyPublicly: ruleData.commentText ? true : false,
          commentText: ruleData.commentText || "Thanks for commenting! Check your DMs 🚀",
          
          requireFollow: ruleData.requireFollow || false,
          
          templateType: hasBanner ? "BANNER_BUTTON" : "TEXT_BUTTON",
          elements: loadedElements,

          openingMessage: {
            text: ruleData.openingMessage?.text || "Hey there! Ready to get started?",
            button: {
              text: ruleData.openingMessage?.buttons?.[0]?.title || ruleData.openingMessage?.button?.title || "Start Chatting",
              url: "",
            },
          },
          askFollowMessage: {
            text: ruleData.askFollowMessage?.text || "",
            buttons:
              ruleData.askFollowMessage?.buttons?.length > 0
                ? [
                    {
                      text:
                        ruleData.askFollowMessage.buttons[0].title ||
                        "I Followed!",
                      url: "",
                    },
                  ]
                : [{ text: "I Followed!", url: "" }],
          },
          finalGoalMessage: {
            text: ruleData.finalGoalMessage?.text || "",
            buttons:
              ruleData.finalGoalMessage?.buttons?.map((b: any) => ({
                text: b.title || "",
                url: b.url || "",
              })) || [],
          },
        });

        setIsEditing(true);
        setModalStep(1);
        setIsModalOpen(true);
      } else {
        alert("Failed to load automation details for editing.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this automation rule?"))
      return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(
        `/api/v1/automation/delete/rule/${mediaId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const activeInstagramId = localStorage.getItem("activeInstagramId");
        if (activeInstagramId) loadAutomations(token, activeInstagramId);
      } else {
        alert("Failed to delete automation.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (mediaId: string, currentStatus: boolean) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        const autoId = auto.id;
        if (autoId === mediaId) {
          return { ...auto, isActive: !currentStatus };
        }
        return auto;
      }),
    );

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const response = await fetch(
        `/api/v1/automation/toggle/rule/${mediaId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Backend failed to toggle");
      }
    } catch (error) {
      console.error("Toggle failed", error);
      setAutomations((prev) =>
        prev.map((auto) => {
          const autoId = auto.id;

          if (autoId === mediaId) {
            return { ...auto, isActive: currentStatus };
          }

          return auto;
        }),
      );
      alert("Failed to toggle automation status. Please try again.");
    }
  };

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

  const updateFinalButton = (
    index: number,
    field: "text" | "url",
    value: string,
  ) => {
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

  const handleSubmit = async () => {
    if (formData.triggerKeywords.length === 0) {
      alert("Please add at least one trigger keyword.");
      return;
    }

    if (!selectedMediaData || !selectedMediaData.id) {
      alert("Error: No media selected. Please go back and select a post.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const activeInstagramId = localStorage.getItem("activeInstagramId") || "";
      const safeMediaId = String(selectedMediaData.id || "");

      const rawCaption = selectedMediaData.caption || "";
      const truncatedCaption = rawCaption.split(/\s+/).slice(0, 30).join(" ");

      let finalElements: any[] = [];
      if (formData.templateType === "BANNER_BUTTON") {
         for (const el of formData.elements) {
            let url = el.imageUrl;
            if (el.imageFile && url.startsWith("blob:")) {
               try {
                  url = await uploadToImgbb(el.imageFile);
               } catch (error) {
                  console.error(error);
                  alert("Failed to upload image. Please check your internet connection and try again.");
                  setIsSubmitting(false);
                  return;
               }
            }
            finalElements.push({
               imageUrl: url,
               title: el.title,
               subtitle: el.subtitle,
               buttons: el.buttons.map(b => ({
                  type: b.type,
                  title: b.title,
                  url: b.type === "web_url" ? b.url : "",
                  payload: b.type === "postback" ? `${safeMediaId}_FINAL_${Date.now()}_${Math.random()}` : ""
               }))
            });
         }
      }

      const openingMessagePayload = {
          text: formData.openingMessage.text || "",
          buttons: [
            {
               type: "postback",
               title: formData.openingMessage.button.text || "",
               payload: `${safeMediaId}_OPENING_${Date.now()}`
            }
          ]
      };

      const finalGoalMessagePayload = formData.templateType === "BANNER_BUTTON" 
        ? {
            templateType: "BANNER_BUTTON",
            text: formData.finalGoalMessage.text || "",
            elements: finalElements
          }
        : {
            templateType: "TEXT_BUTTON",
            text: formData.finalGoalMessage.text || "",
            buttons: formData.finalGoalMessage.buttons.map((b) => ({
              type: "URL",
              title: b.text || "",
              url: b.url || "",
            })),
          };

      const payload = {
        media: {
          mediaId: safeMediaId,
          isActive: true,
          caption: truncatedCaption,
          thumbnailUrl: selectedMediaData.url || "",
          businessIgUserId: activeInstagramId,
        },
        triggerKeywords: formData.triggerKeywords,
        commentText: formData.replyPublicly ? (formData.commentText || "") : "",
        requireFollow: Boolean(formData.requireFollow),

        openingMessage: openingMessagePayload,
        askFollowMessage: {
          text: formData.askFollowMessage.text || "",
          buttons: [
            {
              type: "QUICK_REPLY",
              title:
                formData.askFollowMessage.buttons[0]?.text || "I Followed!",
              url: "",
            },
            {
              type: "URL",
              title: "Visit Profile",
              url: "auto-generated",
            },
          ],
        },
        finalGoalMessage: finalGoalMessagePayload,
      };

      const url = isEditing
        ? `/api/v1/automation/update/rule/${safeMediaId}`
        : `/api/v1/automation/new/rule`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        handleCloseModal();
        loadAutomations(token, activeInstagramId);
      } else {
        const errorText = await response.text();
        alert(`Failed to save automation: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <InstagramSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />

      {/* BRAND CONSISTENT HEADER UI */}
      <div className="relative w-full bg-white border-b border-zinc-200 pb-24 pt-8 px-4 lg:px-8 overflow-hidden max-md:hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500 rounded-full opacity-[0.05] blur-[120px] pointer-events-none z-0"
          aria-hidden="true"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
          <div className="hidden md:flex items-center justify-end w-full gap-4">
            <Field
              orientation="horizontal"
              className="flex items-center gap-2 w-[350px]"
            >
              <Input
                type="search"
                placeholder="Search automations..."
                className="w-full bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-300 h-10 rounded-full px-4 shadow-sm"
              />
            </Field>

            <Button
              onClick={() => setIsSettingsModalOpen(true)}
              variant="outline"
              className="h-10 rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 px-5 shadow-sm transition-colors"
            >
              <Settings className="mr-2 size-4" /> Settings
            </Button>

            <Button
              onClick={handleOpenModal}
              className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md h-10 px-6 text-sm font-medium transition-colors"
            >
              <Plus className="mr-2 size-4" /> Create Automation
            </Button>
          </div>

          <div className="flex flex-col items-start justify-center mt-12 mb-4 text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-900 text-sm font-medium mb-4 shadow-sm">
              Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-zinc-900 mb-3 tracking-tight hidden md:block">
              Auto-DM <span className="text-red-600 italic font-serif tracking-tight">automations</span>
            </h1>
            <p className="text-sm md:text-lg text-zinc-500 font-normal max-w-xl hidden md:block">
              Automate your DMs, capture leads, and grow your audience effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* STATS & CARDS UI */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4 md:-mt-12 relative z-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Total DM Sent
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.totalDmsSent}
              </span>
              <div className="p-3 bg-zinc-100 rounded-xl">
                <Send className="size-5 md:size-6 text-zinc-700" />
              </div>
            </div>
          </Card>
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Followers Gained
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.totalFollowersGained}
              </span>
              <div className="p-3 bg-zinc-100 rounded-xl">
                <UserPlus className="size-5 md:size-6 text-zinc-700" />
              </div>
            </div>
          </Card>
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between col-span-2 md:col-span-1 transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Active Automations
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.activeAutomationsCount}
              </span>
              <div className="p-3 bg-red-50 rounded-xl">
                <Zap className="size-5 md:size-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile Actions */}
        <div className="mt-6 flex gap-3 md:hidden w-full items-center">
          <Button
            onClick={handleOpenModal}
            className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white h-11 px-4 text-sm font-semibold shadow-md transition-colors"
          >
            <Plus className="mr-1.5 size-4" /> Create Automation
          </Button>

          <Button
            onClick={() => setIsSettingsModalOpen(true)}
            variant="outline"
            size="icon"
            className="rounded-xl h-11 w-11 bg-white border border-zinc-200 text-zinc-900 shadow-sm shrink-0"
          >
            <Settings className="size-5" />
          </Button>
        </div>

        {/* --- AUTOMATIONS GRID SECTION WITH TABS --- */}
        <div className="mt-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-medium text-zinc-900 flex items-center gap-2">
              Your Automations
              <span className="text-zinc-400 text-xl font-normal">
                ({automations.length})
              </span>
            </h2>

            <div className="flex items-center bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-sm w-fit">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  filterTab === "all" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("active")}
                className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  filterTab === "active" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterTab("inactive")}
                className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  filterTab === "inactive" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {isLoadingAutomations ? (
            <div className="flex justify-center py-16 text-zinc-400">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAutomations.map((automation) => (
                <AutomationMediaCard
                  key={automation.id}
                  id={automation.id}
                  thumbnailUrl={automation.thumbnailUrl}
                  caption={automation.caption}
                  username={automation.username}
                  isActive={automation.isActive}
                  followersGained={automation.followersGained || 0}
                  dmsSent={automation.dmsSent || 0}
                  mediaType={automation.mediaType || "POST"}
                  triggerKeyword={automation.triggerKeyword || []}
                  onEdit={() => handleEdit(automation)}
                  onDelete={() => handleDelete(automation.id)}
                  onToggle={() =>
                    handleToggle(automation.id, automation.isActive)
                  }
                />
              ))}

              {filteredAutomations.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200 border-dashed flex flex-col items-center justify-center gap-3">
                  <Zap className="size-10 text-zinc-300" />
                  <p className="text-base font-medium text-zinc-500">
                    No automations found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- CREATION MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
          <div className="bg-zinc-50 border border-zinc-200 shadow-2xl rounded-[2rem] overflow-hidden relative flex flex-col w-full max-w-[420px] aspect-[9/16] max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 shrink-0 bg-white">
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
                <h3 className="font-semibold text-lg text-zinc-900">
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
                onClick={handleCloseModal}
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
                      {availableMedia.map((media) => (
                        <div
                          key={media.id}
                          onClick={() => handleSelectMedia(media.id)}
                          className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-white shadow-sm ${formData.mediaId === media.id ? "border-zinc-900 shadow-md scale-[1.02]" : "border-transparent hover:opacity-80"}`}
                        >
                          {media.url ? (
                            <img
                              src={media.url}
                              alt="IG Post"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className="size-6 opacity-50" />
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

                  {/* Trigger Keywords */}
                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-zinc-900 mb-1 block">
                        Trigger Keywords
                      </label>
                      <p className="text-xs text-zinc-500 mb-4">
                        Type a word and press Enter.
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
                        placeholder="e.g. GROW, GUIDE, LINK..."
                        /* FIXED VISIBILITY: Added !text-zinc-900 and placeholder:text-zinc-500 */
                        className="!text-zinc-900 placeholder:text-zinc-500 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl"
                      />
                    </div>
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
                        <label className="text-sm font-semibold text-zinc-900 block mb-3">
                          What to reply
                        </label>
                        <textarea
                          className={uniformTextAreaClass}
                          value={formData.commentText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              commentText: e.target.value,
                            })
                          }
                        />
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
              <div className="p-4 border-t border-zinc-200 bg-white shrink-0 flex gap-2 rounded-b-[2rem]">
                {(!isEditing || modalStep > 1) && (
                  <Button
                    variant="outline"
                    onClick={() => setModalStep((s) => s - 1)}
                    className="w-1/4 h-11 rounded-xl text-sm font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-0"
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
                    className="w-1/3 h-11 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors px-0"
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
                  className="flex-1 h-11 rounded-xl text-sm font-semibold flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
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
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[370px] overflow-hidden flex flex-col border-[6px] border-zinc-900 h-[750px] max-h-[95vh] relative animate-in zoom-in-95 duration-200">
            
            {/* Header Fake Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-900 rounded-b-3xl z-10" />

            {/* Header */}
            <div className="bg-white px-4 py-4 pt-8 border-b border-zinc-100 flex items-center gap-3 shrink-0">
              <button onClick={() => setIsPreviewOpen(false)}>
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
      )}
    </>
  );
}