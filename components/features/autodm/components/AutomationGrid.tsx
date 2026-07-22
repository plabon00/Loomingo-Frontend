"use client";

import { useState } from "react";
import {
  Loader2,
  Zap,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pause,
  Play,
  MessageCircle,
  UserPlus,
  MessagesSquare,
  Reply,
  MousePointerClick,
  Send,
  Info,
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
import { AutomationCardDTO } from "../types";

interface AutomationGridProps {
  automations: AutomationCardDTO[];
  filteredAutomations: AutomationCardDTO[];
  isLoading: boolean;
  filterTab: "all" | "active" | "inactive";
  setFilterTab: (tab: "all" | "active" | "inactive") => void;
  onOpenCreationModal: () => void;
  onOpenSettings: () => void;
  onEdit: (automation: AutomationCardDTO) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

// All media-level stats: label + explanation used by the legend and details modals.
// First 3 are the essential ones shown on each row.
const STAT_DEFS = [
  {
    key: "finalGoalDmsSent",
    label: "Final goal DMs",
    description: "Final goal DMs successfully delivered to commenters.",
    icon: Send,
  },
  {
    key: "commentsTriggered",
    label: "Comments triggered",
    description: "Comments that matched a trigger keyword and started this automation.",
    icon: MessageCircle,
  },
  {
    key: "followersGained",
    label: "Followers gained",
    description: "New followers earned through this automation's follow request.",
    icon: UserPlus,
  },
  {
    key: "dmsSent",
    label: "Total DMs sent",
    description: "Every DM this automation sent, including opening and follow-up messages.",
    icon: Send,
  },
  {
    key: "totalComments",
    label: "Total comments",
    description: "All comments received on this post.",
    icon: MessagesSquare,
  },
  {
    key: "commentRepliesSent",
    label: "Comments replied",
    description: "Public replies the bot posted under comments.",
    icon: Reply,
  },
  {
    key: "linkClicks",
    label: "Link clicks",
    description: "Clicks on links sent inside the DMs.",
    icon: MousePointerClick,
  },
] as const;

type StatKey = (typeof STAT_DEFS)[number]["key"];

function AutomationRow({
  automation,
  onEdit,
  onDelete,
  onToggle,
  onShowLegend,
}: {
  automation: AutomationCardDTO;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onShowLegend: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { thumbnailUrl, caption, isActive } = automation;
  const keywords = automation.triggerKeyword || [];
  const statValue = (key: StatKey) => automation[key] || 0;

  return (
    <>
      {/* Alt-surface band row — mirrors the dashboard's alternating #f5f5f7 sections */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowDetails(true)}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setShowDetails(true);
          }
        }}
        className="group flex flex-wrap items-center gap-x-4 gap-y-3 md:gap-x-6 rounded-[18px] bg-[var(--apple-surface-alt)] p-4 md:p-5 transition-all duration-[240ms] hover:bg-[#efeff1] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-blue)]"
      >
        {/* Thumbnail */}
        <div className="relative size-16 md:size-20 shrink-0 rounded-[12px] bg-white overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Automation media"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--apple-gray-2)] text-[9px] uppercase font-semibold">
              No image
            </div>
          )}
          {/* status dot pinned on thumbnail corner */}
          <span
            className={`absolute top-1.5 left-1.5 size-2.5 rounded-full ring-2 ring-white ${
              isActive ? "bg-[var(--apple-blue)]" : "bg-[var(--apple-gray-2)]"
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Caption + keyword pills */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] md:text-[17px] font-semibold text-[var(--apple-ink)] truncate">
            {caption || "No caption provided"}
          </p>
          <p className="text-[12px] font-medium mt-0.5 mb-2">
            <span className={isActive ? "text-[var(--apple-blue)]" : "text-[var(--apple-gray-2)]"}>
              {isActive ? "Active" : "Paused"}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {keywords.length > 0 ? (
              keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-[var(--apple-ink)]"
                >
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-[var(--apple-gray-2)]">No trigger keywords</span>
            )}
          </div>
        </div>

        {/* Essential stats — icon + value, always visible. Full width second line on mobile. */}
        <div className="order-last sm:order-none w-full sm:w-auto flex items-center justify-around sm:justify-end gap-4 md:gap-6 shrink-0 border-t border-[var(--apple-hairline)] pt-3 sm:border-0 sm:pt-0">
          {STAT_DEFS.slice(0, 3).map((stat) => (
            <div
              key={stat.key}
              title={stat.label}
              aria-label={`${stat.label}: ${statValue(stat.key)}`}
              className="flex items-center gap-2"
            >
              <stat.icon className="size-4 text-[var(--apple-gray-2)]" aria-hidden="true" />
              <span className="text-[17px] md:text-[19px] font-semibold tracking-tight text-[var(--apple-ink)] tabular-nums">
                {statValue(stat.key)}
              </span>
            </div>
          ))}
          <button
            aria-label="What do these icons mean?"
            onClick={(e) => {
              e.stopPropagation();
              onShowLegend();
            }}
            className="p-1 text-[var(--apple-gray-2)] hover:text-[var(--apple-blue)] transition-colors duration-200 outline-none"
          >
            <Info className="size-4" />
          </button>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Automation options"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-[var(--apple-gray-2)] hover:text-[var(--apple-ink)] transition-colors duration-200 outline-none shrink-0"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
            className="w-48 rounded-xl p-1.5 shadow-xl border-[var(--apple-hairline)] bg-white"
          >
            <DropdownMenuItem
              onClick={onEdit}
              className="focus:bg-[var(--apple-surface-alt)] font-medium py-2.5 cursor-pointer rounded-lg text-[var(--apple-ink)]"
            >
              <Pencil className="size-4 mr-2.5 text-[var(--apple-blue)]" />
              Edit Automation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onToggle}
              className="focus:bg-[var(--apple-surface-alt)] font-medium py-2.5 cursor-pointer rounded-lg text-[var(--apple-ink)]"
            >
              {isActive ? (
                <>
                  <Pause className="size-4 mr-2.5 text-amber-500" />
                  Pause Automation
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2.5 text-emerald-500" />
                  Resume Automation
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5 bg-[var(--apple-hairline)]" />
            <DropdownMenuItem
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 focus:bg-red-50 font-medium py-2.5 cursor-pointer rounded-lg"
            >
              <Trash2 className="size-4 mr-2.5" />
              Delete completely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="font-apple w-[92%] max-w-[400px] gap-0 p-0 overflow-hidden rounded-[20px] border border-[var(--apple-hairline)] bg-white shadow-2xl"
        >
          <div className="flex flex-col items-center px-7 pt-8 pb-6 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
              <Trash2 className="size-6 text-red-600" aria-hidden="true" />
            </div>
            <DialogHeader className="items-center gap-2">
              <DialogTitle className="text-[19px] md:text-[21px] font-semibold tracking-tight text-[var(--apple-ink)] text-center">
                Delete this automation?
              </DialogTitle>
              <DialogDescription className="max-w-[300px] text-[14px] leading-relaxed text-[var(--apple-gray)] text-center">
                This can&apos;t be undone. All bot replies tied to this post will
                stop immediately.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="grid grid-cols-2 gap-2.5 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="h-11 rounded-full font-medium border-[var(--apple-hairline)] bg-white text-[var(--apple-ink)] shadow-none hover:bg-[var(--apple-surface-alt)]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete();
              }}
              className="h-11 rounded-full font-medium bg-red-600 text-white shadow-none transition-colors duration-[240ms] hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DETAILS DIALOG — full media-level breakdown, mirrors header stats treatment */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent
          aria-describedby={undefined}
          className="font-apple w-[94%] max-w-[560px] max-h-[85dvh] overflow-y-auto gap-0 p-0 rounded-[20px] border border-[var(--apple-hairline)] bg-white shadow-2xl"
        >
          {/* Media header on alt surface */}
          <div className="flex items-center gap-4 bg-[var(--apple-surface-alt)] p-5 md:p-6">
            <div className="relative size-16 md:size-20 shrink-0 rounded-[12px] bg-white overflow-hidden">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Automation media" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--apple-gray-2)] text-[9px] uppercase font-semibold">
                  No image
                </div>
              )}
              <span
                className={`absolute top-1.5 left-1.5 size-2.5 rounded-full ring-2 ring-white ${
                  isActive ? "bg-[var(--apple-blue)]" : "bg-[var(--apple-gray-2)]"
                }`}
                aria-hidden="true"
              />
            </div>
            <DialogHeader className="min-w-0 flex-1 gap-1 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)]">
                {isActive ? "Active automation" : "Paused automation"}
              </p>
              <DialogTitle className="text-[16px] md:text-[19px] font-semibold tracking-tight text-[var(--apple-ink)] leading-snug line-clamp-2 text-left">
                {caption || "No caption provided"}
              </DialogTitle>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-[var(--apple-ink)]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </DialogHeader>
          </div>

          {/* Stats — same divider-column treatment as the page-level stats section */}
          <div className="p-5 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-4">
              Performance
            </p>
            <div className="grid grid-cols-2 gap-y-6">
              {STAT_DEFS.map((stat, i) => (
                <div
                  key={stat.key}
                  className={`flex flex-col gap-1 py-1 ${
                    i % 2 === 0
                      ? "pr-4"
                      : "pl-4 border-l border-[var(--apple-hairline)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[var(--apple-gray-2)]">
                    <stat.icon className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] truncate">
                      {stat.label}
                    </span>
                  </span>
                  <span className="apple-display text-[26px] md:text-[32px] tabular-nums">
                    {statValue(stat.key)}
                  </span>
                  <span className="text-[11px] leading-snug text-[var(--apple-gray)]">
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AutomationGrid({
  automations,
  filteredAutomations,
  isLoading,
  filterTab,
  setFilterTab,
  onEdit,
  onDelete,
  onToggleStatus,
}: AutomationGridProps) {
  const tabs = ["all", "active", "inactive"] as const;
  const [showLegend, setShowLegend] = useState(false);

  return (
    <section className="font-apple w-full max-w-5xl mx-auto px-6 mt-10 mb-8">
      {/* Section header */}
      <div className="flex items-baseline justify-between border-b border-[var(--apple-hairline)] pb-4">
        <h2 className="text-[21px] md:text-[28px] font-semibold tracking-tight text-[var(--apple-ink)]">
          Your automations
        </h2>
        <div className="flex items-center gap-4 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 pb-0.5 border-b-2 ${
                filterTab === tab
                  ? "text-[var(--apple-blue)] border-[var(--apple-blue)]"
                  : "text-[var(--apple-gray-2)] border-transparent hover:text-[var(--apple-ink)]"
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="hidden sm:inline text-[12px] font-medium text-[var(--apple-gray-2)]">
            {automations.length} total
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[var(--apple-blue)]" />
        </div>
      ) : filteredAutomations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-b border-[var(--apple-hairline)]">
          <Zap className="size-5 text-[var(--apple-gray-2)] mb-3" aria-hidden="true" />
          <p className="text-[17px] font-semibold text-[var(--apple-ink)]">
            No automations found
          </p>
          <p className="text-[14px] text-[var(--apple-gray)] mt-1 max-w-[280px] leading-relaxed">
            Nothing in this tab yet. Create an automation to start capturing
            leads on autopilot.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-6">
          {filteredAutomations.map((automation) => (
            <AutomationRow
              key={automation.id}
              automation={automation}
              onEdit={() => onEdit(automation)}
              onDelete={() => onDelete(automation.id)}
              onToggle={() => onToggleStatus(automation.id, automation.isActive)}
              onShowLegend={() => setShowLegend(true)}
            />
          ))}
        </div>
      )}

      {/* STAT LEGEND DIALOG — explains what each icon means */}
      <Dialog open={showLegend} onOpenChange={setShowLegend}>
        <DialogContent
          aria-describedby={undefined}
          className="font-apple w-[92%] max-w-[400px] gap-0 p-0 overflow-hidden rounded-[20px] border border-[var(--apple-hairline)] bg-white shadow-2xl"
        >
          <DialogHeader className="p-6 pb-4 text-left">
            <DialogTitle className="text-[19px] font-semibold tracking-tight text-[var(--apple-ink)]">
              What these icons mean
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1 px-4 pb-6">
            {STAT_DEFS.map((stat) => (
              <div key={stat.key} className="flex items-start gap-3.5 rounded-[14px] p-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--apple-surface-alt)]">
                  <stat.icon className="size-4 text-[var(--apple-ink)]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--apple-ink)]">{stat.label}</p>
                  <p className="text-[12px] leading-relaxed text-[var(--apple-gray)]">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
