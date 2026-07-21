import {
  Plus,
  Send,
  UserPlus,
  Settings,
  MessageCircle,
  MessagesSquare,
  Reply,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutomationStatsDTO } from "../types";

interface AutomationHeaderProps {
  stats: AutomationStatsDTO;
  onOpenSettings: () => void;
  onOpenCreationModal: () => void;
}

export function AutomationHeader({
  stats,
  onOpenSettings,
  onOpenCreationModal,
}: AutomationHeaderProps) {
  const statItems = [
    { label: "Final goal DMs", value: stats.finalGoalDmsSent, icon: Send },
    {
      label: "Followers gained",
      value: stats.totalFollowersGained,
      icon: UserPlus,
    },
    {
      label: "Comments triggered",
      value: stats.totalCommentsTriggered,
      icon: MessageCircle,
    },
    {
      label: "Total comments",
      value: stats.totalComments,
      icon: MessagesSquare,
    },
    {
      label: "Comments replied",
      value: stats.commentRepliesSent,
      icon: Reply,
    },
    {
      label: "Link clicks",
      value: stats.linkClicks,
      icon: MousePointerClick,
    },
  ];

  return (
    <div className="font-apple w-full max-w-5xl mx-auto px-6">
      {/* HEADER */}
      <div className="w-full flex flex-col items-start text-left mt-10 md:mt-16 mb-12 gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)]">
          Automation engine
        </p>

        <h1 className="apple-display text-[34px] md:text-[48px]">
          Automate growth.
        </h1>

        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] max-w-md">
            Capture leads and reply to comments instantly with smart Instagram
            DMs, running entirely on autopilot.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={onOpenSettings}
              variant="outline"
              className="rounded-full border-[var(--apple-hairline)] bg-transparent text-[var(--apple-ink)] hover:bg-[var(--apple-surface-alt)] hover:text-[var(--apple-ink)] h-11 px-5 text-[15px] font-medium transition-colors duration-[240ms] shadow-none"
            >
              <Settings className="mr-2 size-4" /> Settings
            </Button>
            <Button
              onClick={onOpenCreationModal}
              className="rounded-full bg-[var(--apple-blue)] hover:bg-[var(--apple-blue-hover)] text-white h-11 px-6 text-[15px] font-medium transition-colors duration-[240ms] shadow-none"
            >
              <Plus className="mr-2 size-4" /> New Automation
            </Button>
          </div>
        </div>
      </div>

      {/* STATS ROW — divider columns, same treatment as dashboard MiniAnalytics */}
      <div className="w-full grid grid-cols-3 gap-y-8 mb-4">
        {statItems.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-1.5 py-2 ${
              i % 3 === 0
                ? "pr-4 md:pr-6"
                : "px-4 md:px-6 border-l border-[var(--apple-hairline)]"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[var(--apple-gray-2)]">
              <stat.icon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] truncate">
                {stat.label}
              </span>
            </div>
            <span className="apple-display text-[28px] md:text-[40px] tabular-nums">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
