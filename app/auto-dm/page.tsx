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
  Settings, // 👈 ADDED SETTINGS ICON
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AutomationMediaCard from "@/components/ui/automation-card";
import BgImage from "../../assets/auto-dm-background.png";
import { auth } from "@/lib/firebase";
import { InstagramSettingsModal } from "@/components/instagram-settings-modal";

// 👈 IMPORT YOUR NEW LAYOUT COMPONENTS HERE
import {
  MobileNavbar,
  BottomDock,
  DesktopSidebar,
} from "@/components/AppNavigation";
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
const defaultFormData = {
  mediaId: "",
  triggerKeywords: [] as string[],
  keywordInput: "",
  commentText: "Thanks for commenting! Check your DMs 🚀",
  requireFollow: false,

  openingMessage: {
    text: "Hey! Here is the link you asked for 👇",
    button: { text: "Get Access", url: "" },
  },

  askFollowMessage: {
    text: "Before I send the link, please follow our page! It helps us a lot. 🙏",
    buttons: [{ text: "I Followed!", url: "" }],
  },

  finalGoalMessage: {
    text: "Awesome, thanks for following! Here is your exclusive content.",
    buttons: [{ text: "Download Guide", url: "" }],
  },
};

export default function AutoDMHeader() {
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

  const [isEditing, setIsEditing] = useState(false);

  const [filterTab, setFilterTab] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [formData, setFormData] = useState(defaultFormData);

  const loadAutomations = async (userToken: string, businessId: string) => {
    setIsLoadingAutomations(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/auto-dm/automations/dashboard/${businessId}`,
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
    "w-full h-10 pl-9 pr-3 text-sm bg-primary/5 border-2 border-dotted border-primary/40 rounded-xl text-center font-semibold text-primary transition-all focus-visible:ring-1 focus-visible:ring-primary/50 shadow-sm";

  // --- HANDLERS ---
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
        `http://localhost:8080/api/v1/getAll/my_media/${activeInstagramId}`,
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
        `http://localhost:8080/api/v1/automation/rule/${automation.id || automation.mediaId}`,
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

        setFormData({
          mediaId: automation.id || automation.mediaId,
          triggerKeywords: ruleData.triggerKeywords || [],
          keywordInput: "",
          commentText: ruleData.commentText || "",
          requireFollow: ruleData.requireFollow || false,
          openingMessage: {
            text: ruleData.openingMessage?.text || "",
            button: {
              text: ruleData.openingMessage?.button?.title || "",
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
        `http://localhost:8080/api/v1/automation/delete/rule/${mediaId}`,
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
        `http://localhost:8080/api/v1/automation/toggle/rule/${mediaId}`,
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

      const payload = {
        media: {
          mediaId: safeMediaId,
          isActive: true,
          caption: truncatedCaption,
          thumbnailUrl: selectedMediaData.url || "",
          businessIgUserId: activeInstagramId,
        },
        triggerKeywords: formData.triggerKeywords,
        commentText: formData.commentText || "",
        requireFollow: Boolean(formData.requireFollow),

        openingMessage: {
          text: formData.openingMessage.text || "",
          button: { title: formData.openingMessage.button.text || "" },
        },
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
        finalGoalMessage: {
          text: formData.finalGoalMessage.text || "",
          buttons: formData.finalGoalMessage.buttons.map((b) => ({
            type: "URL",
            title: b.text || "",
            url: b.url || "",
          })),
        },
      };

      const url = isEditing
        ? `http://localhost:8080/api/v1/automation/update/rule/${safeMediaId}`
        : "http://localhost:8080/api/v1/automation/new/rule";

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
    // 👈 ADDED pt-14 and md:pl-64 to accommodate the new fixed layout components
    <div className="w-full relative bg-background min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64">
      {/* 👈 INJECT THE LAYOUT COMPONENTS */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      <InstagramSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />

      {/* BACKGROUND HEADER UI */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat pb-28 pt-6 px-4 lg:px-8 overflow-hidden max-md:hidden"
        style={{ backgroundImage: `url(${BgImage.src})` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="hidden md:flex items-center justify-end w-full gap-4">
            <Field
              orientation="horizontal"
              className="flex items-center gap-2 w-[350px]"
            >
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/40 h-10"
              />
              <Button variant="secondary" className="h-10">
                <Search className="mr-2 size-4" />
                Search
              </Button>
            </Field>

            {/* 👈 UPDATED: Settings Button for Desktop */}
            <Button
              onClick={() => setIsSettingsModalOpen(true)}
              variant="secondary"
              className="h-10 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm px-4"
            >
              <Settings className="mr-2 size-4" /> Settings
            </Button>

            <Button
              onClick={handleOpenModal}
              className="rounded-full bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 shadow-md h-10 px-5 text-sm"
            >
              <Plus className="mr-2 size-4" /> Create Automation
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 mb-6 text-center text-white">
  {/* 👈 HIDDEN ON MOBILE: We only show this big title on desktop now */}
  <h1 className="text-3xl md:text-5xl font-semibold mb-2 tracking-wide hidden md:block">
    Auto-DM
  </h1>
  {/* 👈 ADDED SUBTITLE */}
  <p className="text-sm md:text-base text-white/80 font-medium max-w-xl hidden md:block">
    Automate your DMs, capture leads, and grow your audience effortlessly.
  </p>
</div>
        </div>
      </div>

      {/* STATS & CARDS UI */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4 md:-mt-14 relative z-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Total DM Sent
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {stats.totalDmsSent}
              </span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="size-4 md:size-5 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Followers Gained
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {stats.totalFollowersGained}
              </span>
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="size-4 md:size-5 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Active Automations
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {stats.activeAutomationsCount}
              </span>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Zap className="size-4 md:size-5 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* 👈 UPDATED: Mobile Actions (Smaller, Pop Color, Settings on Right) */}
        <div className="mt-4 flex gap-2 md:hidden w-full items-center">
          <Button
            onClick={handleOpenModal}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="mr-1.5 size-3.5" /> Create Automation
          </Button>

            {/* 👈 UPDATED: Mobile Settings Button */}
          <Button
            onClick={() => setIsSettingsModalOpen(true)}
            variant="outline"
            size="icon"
            className="rounded-xl h-9 w-9 bg-background border-border shrink-0"
          >
            <Settings className="size-4 text-muted-foreground" />
          </Button>
        </div>

        {/* --- AUTOMATIONS GRID SECTION WITH TABS --- */}
        <div className="mt-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Automations
              <span className="text-muted-foreground text-lg font-medium">
                ({automations.length})
              </span>
            </h2>

            <div className="flex items-center bg-muted/50 p-1 rounded-lg w-fit border shadow-sm">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${filterTab === "all" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("active")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${filterTab === "active" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterTab("inactive")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${filterTab === "inactive" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
              >
                Not Active
              </button>
            </div>
          </div>

          {isLoadingAutomations ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2">
                  <Zap className="size-8 opacity-20" />
                  <p className="text-sm">
                    No automations found in this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- 9:16 CREATION MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border shadow-2xl rounded-3xl overflow-hidden relative flex flex-col w-full max-w-[400px] aspect-[9/16] max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              {modalStep > 0 && !isEditing ? (
                <button
                  onClick={() => setModalStep((s) => s - 1)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="size-5" />
                </button>
              ) : (
                <div className="w-9" />
              )}

              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {modalStep === 0
                    ? "Select Post"
                    : isEditing
                      ? "Edit Automation"
                      : "Setup Automation"}
                </h3>
                {modalStep > 0 && !isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Step {modalStep} of 3
                  </p>
                )}
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                disabled={isSubmitting}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* SCREEN 0: Select Media */}
              {modalStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Select an Instagram post or reel to automate.
                  </p>
                  {isLoadingMedia ? (
                    <div className="flex justify-center py-10 animate-pulse text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableMedia.map((media) => (
                        <div
                          key={media.id}
                          onClick={() => handleSelectMedia(media.id)}
                          className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all bg-muted ${formData.mediaId === media.id ? "border-primary" : "border-transparent hover:opacity-80"}`}
                        >
                          {media.url ? (
                            <img
                              src={media.url}
                              alt="IG Post"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                    <div className="flex gap-4 p-3 border rounded-xl bg-muted/20 items-start shadow-sm mb-2">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted relative">
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm font-semibold uppercase tracking-wider z-10">
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
                            <ImageIcon className="size-5 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <p
                          className="text-xs text-muted-foreground line-clamp-2 mb-2"
                          title={selectedMediaData.caption}
                        >
                          {selectedMediaData.caption || "No caption available"}
                        </p>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 mt-auto">
                          <span className="flex items-center gap-1">
                            <Heart className="size-3.5" />{" "}
                            {selectedMediaData.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="size-3.5" />{" "}
                            {selectedMediaData.commentsCount}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] px-2 w-fit bg-background"
                          onClick={() =>
                            window.open(selectedMediaData.permalink, "_blank")
                          }
                        >
                          <ExternalLink className="size-3 mr-1" /> View Link
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Trigger Keywords */}
                  <div className="p-4 border-2 border-dotted border-border/70 rounded-xl bg-background/50 space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
                        Trigger Keywords
                      </label>
                      <p className="text-[11px] text-muted-foreground mb-3">
                        Type a word and press Enter.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.triggerKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center font-medium"
                          >
                            {kw}{" "}
                            <X
                              className="size-3 ml-2 cursor-pointer"
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
                      />
                    </div>
                  </div>

                  {/* Auto-Reply Comment */}
                  <div className="p-4 border-2 border-dotted border-border/70 rounded-xl bg-background/50 space-y-3">
                    <label className="text-sm font-semibold block">
                      Auto-Reply Comment
                    </label>
                    <textarea
                      className="w-full text-sm border rounded-xl p-3 bg-background focus:ring-1 outline-none min-h-[80px]"
                      value={formData.commentText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commentText: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* SCREEN 2: Initial Message & Follow Gate */}
              {modalStep === 2 && (
                <div className="space-y-5">
                  {/* Opening DM Text */}
                  <div className="p-4 border-2 border-dotted border-border/70 rounded-xl bg-background/50 space-y-5">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Opening DM Text
                      </label>
                      <textarea
                        className="w-full text-sm border rounded-xl p-3 bg-background focus:ring-1 outline-none min-h-[80px]"
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
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold block text-muted-foreground uppercase tracking-wider">
                        Attached Button
                      </label>
                      <div className="relative group">
                        <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-primary/60 group-focus-within:text-primary transition-colors" />
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
                  </div>

                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl mt-4 border border-border/50">
                    <div>
                      <h4 className="text-sm font-semibold">Require Follow?</h4>
                      <p className="text-xs text-muted-foreground">
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
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.requireFollow ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.requireFollow ? "translate-x-6" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>

                  {/* Ask Follow Form */}
                  {formData.requireFollow && (
                    <div className="p-4 border-2 border-dotted border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/10 rounded-xl space-y-5 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div>
                        <label className="text-sm font-semibold mb-2 flex items-center text-amber-700 dark:text-amber-500">
                          <Zap className="size-4 mr-2" /> Follow Request Message
                        </label>
                        <textarea
                          className="w-full text-sm border-amber-200 rounded-xl p-3 bg-white dark:bg-slate-900 focus:ring-1 outline-none min-h-[70px]"
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

                      <div className="space-y-2 pt-1">
                        {/* 🚀 ONLY ONE EDITABLE BUTTON NOW */}
                        <div className="relative group">
                          <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-primary/60 group-focus-within:text-primary transition-colors" />
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
                        </div>

                        {/* 🚀 LOCKED PREVIEW FOR THE AUTO-GENERATED URL BUTTON */}
                        <div className="relative">
                          <div
                            className={`${uniformButtonInputClass} flex items-center justify-center bg-background/50 border-dashed border-border/60 text-muted-foreground select-none cursor-not-allowed opacity-70`}
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
                  {/* Final Message */}
                  <div className="p-4 border-2 border-dotted border-border/70 rounded-xl bg-background/50 space-y-5">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Final Message (Delivery)
                      </label>
                      <textarea
                        className="w-full text-sm border rounded-xl p-3 bg-background focus:ring-1 outline-none min-h-[90px]"
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
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold block text-muted-foreground uppercase tracking-wider">
                          Attached Links
                        </label>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {formData.finalGoalMessage.buttons.length}/3
                        </span>
                      </div>

                      {formData.finalGoalMessage.buttons.map((btn, idx) => (
                        <div
                          key={idx}
                          className="relative p-3 border border-border/60 bg-muted/10 rounded-xl space-y-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between pb-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Button {idx + 1}
                            </span>
                            <button
                              onClick={() => removeFinalButton(idx)}
                              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>

                          <div className="relative group">
                            <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-primary/60 group-focus-within:text-primary transition-colors" />
                            <Input
                              className={uniformButtonInputClass}
                              placeholder="Label (e.g. Download Now)"
                              value={btn.text}
                              onChange={(e) =>
                                updateFinalButton(idx, "text", e.target.value)
                              }
                            />
                          </div>

                          <Input
                            className="text-sm bg-background border-dashed h-9 focus-visible:ring-1"
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
                          className="w-full border-dashed border-2 text-muted-foreground mt-2 h-10 text-sm rounded-xl hover:bg-muted/50 transition-colors"
                          onClick={addFinalButton}
                        >
                          <Plus className="mr-2 size-4" /> Add Another Button
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explicit Back & Next Footer Navigation */}
            {modalStep > 0 && (
              <div className="p-4 border-t bg-background shrink-0 flex gap-3 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
                {/* Hide Back button in Edit Mode if on Step 1, since we skip Step 0 */}
                {(!isEditing || modalStep > 1) && (
                  <Button
                    variant="outline"
                    onClick={() => setModalStep((s) => s - 1)}
                    className="w-1/3 h-10 rounded-xl text-sm font-semibold border-border/50 text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}

                <Button
                  onClick={() =>
                    modalStep === 3
                      ? handleSubmit()
                      : setModalStep((s) => s + 1)
                  }
                  className="flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                    </>
                  ) : modalStep === 3 ? (
                    isEditing ? (
                      "Update Automation"
                    ) : (
                      "Start Automation"
                    )
                  ) : (
                    "Next Step"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
