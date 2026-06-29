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
import { InstagramSettingsModal } from "@/components/modals/instagram-settings-modal";

import { AutomationHeader } from "./components/AutomationHeader";
import { AutomationGrid } from "./components/AutomationGrid";
import { CreationModal } from "./components/CreationModal";
import { PreviewModal } from "./components/PreviewModal";
import { defaultFormData, AutomationStatsDTO, AutomationCardDTO, CarouselElement } from "./types";
import type { FormData } from "./types";


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
            "ngrok-skip-browser-warning": "true",
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
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
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
            hasActiveAutomation: item.hasActiveAutomation || false,
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
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
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
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
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
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
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
          "ngrok-skip-browser-warning": "true",
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
    <div className="min-h-screen bg-zinc-50 relative pb-20 md:pb-0">
      <AutomationHeader 
        stats={stats}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenCreationModal={handleOpenModal}
      />
      <AutomationGrid 
        automations={automations}
        filteredAutomations={filteredAutomations}
        isLoading={isLoadingAutomations}
        filterTab={filterTab}
        setFilterTab={setFilterTab}
        onOpenCreationModal={handleOpenModal}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggle}
      />
      <CreationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalStep={modalStep}
        setModalStep={setModalStep}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        availableMedia={availableMedia}
        isLoadingMedia={isLoadingMedia}
        formData={formData}
        setFormData={setFormData}
        handleSelectMedia={handleSelectMedia}
        selectedMediaData={selectedMediaData}
        setIsPreviewOpen={setIsPreviewOpen}
        handleSubmit={handleSubmit}
      />
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        selectedMediaData={selectedMediaData}
      />
      <InstagramSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
