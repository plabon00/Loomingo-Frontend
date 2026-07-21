"use client";

import { useMemo } from "react";
import {
  Send,
  Reply,
  MousePointerClick,
} from "lucide-react";
import useSWR from "swr";
import { auth } from "@/lib/firebase";
import type { AutomationStatsDTO } from "@/components/features/autodm/types";

const fetchWithToken = async (url: string) => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

const formatCount = (n: number | undefined) =>
  (n ?? 0).toLocaleString("en-US");

export default function MiniAnalytics() {
  // Instagram business account id persisted by the connect flow
  const businessId =
    typeof window !== "undefined"
      ? localStorage.getItem("activeInstagramId")
      : null;

  // Instant paint from the last-known snapshot, refreshed in the background
  const cachedStats = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_account_stats");
      if (stored) {
        try {
          return JSON.parse(stored) as AutomationStatsDTO;
        } catch (e) {}
      }
    }
    return null;
  }, []);

  const { data } = useSWR<AutomationStatsDTO>(
    businessId ? `/api/auto-dm/automations/stats/${businessId}` : null,
    fetchWithToken,
    {
      fallbackData: cachedStats ?? undefined,
      onSuccess: (stats) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("dashboard_account_stats", JSON.stringify(stats));
        }
      },
    },
  );

  const stats = [
    {
      label: "Final goal DMs",
      value: formatCount(data?.finalGoalDmsSent),
      icon: Send,
    },
    {
      label: "Comments replied",
      value: formatCount(data?.commentRepliesSent),
      icon: Reply,
    },
    {
      label: "Link clicks",
      value: formatCount(data?.linkClicks),
      icon: MousePointerClick,
    },
  ];

  return (
    <div
      data-stagger
      className="font-apple w-full grid grid-cols-3 gap-y-8"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col ${
            i % 3 === 0
              ? "pr-4 md:pr-6"
              : "px-4 md:px-6 border-l border-[var(--apple-hairline)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <stat.icon className="size-3.5 shrink-0 text-[var(--apple-gray-2)]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--apple-gray-2)] leading-tight truncate">
              {stat.label}
            </span>
          </div>

          <span className="apple-display text-[28px] md:text-[40px] tabular-nums mt-4">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
