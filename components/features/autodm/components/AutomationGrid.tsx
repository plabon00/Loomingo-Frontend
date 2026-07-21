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

function AutomationRow({
  automation,
  onEdit,
  onDelete,
  onToggle,
}: {
  automation: AutomationCardDTO;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    thumbnailUrl,
    caption,
    isActive,
    followersGained,
    finalGoalDmsSent,
    commentsTriggered,
    totalComments,
    commentRepliesSent,
    linkClicks,
  } = automation;
  const keywords = automation.triggerKeyword || [];

  // Media-level stats rendered on the row (hidden on mobile; secondary ones only on lg+)
  const rowStats = [
    { label: "DMs", value: finalGoalDmsSent, icon: Send, lgOnly: false },
    { label: "Follows", value: followersGained, icon: UserPlus, lgOnly: false },
    { label: "Triggered", value: commentsTriggered, icon: MessageCircle, lgOnly: false },
    { label: "Comments", value: totalComments, icon: MessagesSquare, lgOnly: true },
    { label: "Replied", value: commentRepliesSent, icon: Reply, lgOnly: true },
    { label: "Clicks", value: linkClicks, icon: MousePointerClick, lgOnly: true },
  ];

  return (
    <>
      {/* Alt-surface band row — mirrors the dashboard's alternating #f5f5f7 sections */}
      <div className="group flex items-center gap-4 md:gap-6 rounded-[18px] bg-[var(--apple-surface-alt)] p-4 md:p-5 transition-all duration-[240ms] hover:bg-[#efeff1]">
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

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 md:gap-7 shrink-0">
          {rowStats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.lgOnly ? "hidden lg:flex" : "flex"} flex-col items-end`}
            >
              <span className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-gray-2)]">
                <stat.icon className="size-3" aria-hidden="true" /> {stat.label}
              </span>
              <span className="text-[17px] md:text-[21px] font-semibold tracking-tight text-[var(--apple-ink)] tabular-nums">
                {stat.value || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Automation options"
              className="p-2 text-[var(--apple-gray-2)] hover:text-[var(--apple-ink)] transition-colors duration-200 outline-none shrink-0"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
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
            />
          ))}
        </div>
      )}
    </section>
  );
}
