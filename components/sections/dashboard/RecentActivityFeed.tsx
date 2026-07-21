"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; 

function formatTimeAgo(dateString: string | undefined | null) {
  if (!dateString) return "Just now";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

interface SentDmDTO {
  id: string | number;
  recipientUsername?: string;
  username?: string; 
  triggerKeyword?: string;
  keyword?: string; 
  sentAt?: string;
  timestamp?: string; 
}

function formatDmData(dm: SentDmDTO) {
  return {
    id: dm.id,
    username: dm.recipientUsername || dm.username || "user",
    keyword: dm.triggerKeyword || dm.keyword || "automation",
    rawTime: dm.sentAt || dm.timestamp || new Date().toISOString()
  };
}

export default function RecentActivityFeed() {
  const [recentDMs, setRecentDMs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTick] = useState(0);

  // Force time-ago update every 30s
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRecentDMs = async (user: any) => {
      try {
        const token = await user.getIdToken();
        const userId = sessionStorage.getItem("userId") || user.uid;

        const response = await fetch(`/api/dms/recent/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          const data: SentDmDTO[] = await response.json();
          setRecentDMs(data.map(formatDmData).slice(0, 4));
        }
      } catch (err) {
        console.warn("Could not load recent activity:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchRecentDMs(user);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="font-apple relative w-full flex flex-col h-full">

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-[var(--apple-hairline)] pb-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-gray-2)]">
            Recent activity
          </h3>
        </div>
        <Link href="/autodm" className="apple-link text-[13px] font-medium">
          View all
        </Link>
      </div>

      {/* Feed List */}
      <div className="relative flex flex-col flex-1 divide-y divide-[var(--apple-hairline)]/60">

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col animate-pulse divide-y divide-zinc-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 bg-zinc-100 rounded w-2/3"></div>
                  <div className="h-2 bg-zinc-100 rounded w-1/2"></div>
                </div>
                <div className="h-2 bg-zinc-100 rounded w-14"></div>
              </div>
            ))}
          </div>
        ) : recentDMs.length === 0 ? (

          /* Empty State (Shown if BOTH SSE and Database have 0 entries) */
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
            <Zap className="size-6 text-[var(--apple-gray-2)] mb-3" aria-hidden="true" />
            <p className="text-[17px] font-semibold text-[var(--apple-ink)]">No recent activity</p>
            <p className="text-[14px] text-[var(--apple-gray)] mt-1 max-w-[240px] leading-relaxed">Your automated DMs will appear here once your first automation runs.</p>
          </div>

        ) : (

          /* Data State */
          recentDMs.map((dm) => (
            <div
              key={dm.id}
              className="group flex items-center gap-3 md:gap-4 py-4 transition-colors duration-[240ms] cursor-default"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] text-[var(--apple-ink)] truncate">
                  Sent to <span className="font-semibold">{dm.username.startsWith('@') ? dm.username : `@${dm.username}`}</span>
                </p>
                <p className="text-[13px] text-[var(--apple-gray)] truncate mt-0.5">
                  Keyword <span className="font-medium text-[var(--apple-blue)]">&quot;{dm.keyword}&quot;</span>
                </p>
              </div>

              {/* Timestamp calculated during render */}
              <span className="text-[12px] font-medium text-[var(--apple-gray-2)] tabular-nums shrink-0 whitespace-nowrap">
                {formatTimeAgo(dm.rawTime)}
              </span>

            </div>
          ))
        )}
      </div>

    </div>
  );
}