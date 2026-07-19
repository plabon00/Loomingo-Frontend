"use client";

import { Activity, Clock, Send, Zap } from "lucide-react";
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
    <div className="bg-white/80 backdrop-blur-md border border-zinc-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col h-full transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 rounded-full">
            <Activity className="size-4 text-zinc-700" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            Recent Activity
          </h3>
        </div>
        <Link href="/auto-dm" className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-300">
          View All
        </Link>
      </div>
      
      {/* Feed List */}
      <div className="flex flex-col gap-3 flex-1">
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-transparent">
                <div className="w-10 h-10 rounded-full bg-zinc-200 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
                  <div className="h-2 bg-zinc-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentDMs.length === 0 ? (
          
          /* Empty State (Shown if BOTH SSE and Database have 0 entries) */
          <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
            <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Zap className="size-5 text-zinc-400" />
            </div>
            <p className="text-sm font-semibold text-zinc-900">No recent activity</p>
            <p className="text-xs font-medium text-zinc-500 mt-1 max-w-[200px]">Your automated DMs will appear here.</p>
          </div>
          
        ) : (
          
          /* Data State */
          recentDMs.map((dm) => (
            <div 
              key={dm.id} 
              className="flex items-center gap-4 px-3 py-2 hover:bg-zinc-50/80 rounded-full transition-all border border-transparent hover:border-zinc-200/60 hover:shadow-sm cursor-default"
            >
              
              {/* Brand-styled Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
                <Send className="size-4 text-zinc-700" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  Sent to <span className="font-bold">{dm.username.startsWith('@') ? dm.username : `@${dm.username}`}</span>
                </p>
                <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">
                  Triggered by keyword <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-semibold ml-1">&quot;{dm.keyword}&quot;</span>
                </p>
              </div>
              
              {/* Timestamp calculated during render */}
              <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 shrink-0 whitespace-nowrap bg-zinc-100/80 px-2.5 py-1 rounded-full">
                <Clock className="size-3"/> {formatTimeAgo(dm.rawTime)}
              </span>
              
            </div>
          ))
        )}
      </div>
      
    </div>
  );
}