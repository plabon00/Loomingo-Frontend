"use client";

import { useMemo } from "react";
import { auth } from "@/lib/firebase";
import useSWR from "swr";
import { useAuthUser } from "@/hooks/use-auth-user";

const fetchWithToken = async (url: string) => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    }
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export default function InstagramProfileCard() {
  const { user } = useAuthUser();
  const activeIgId = typeof window !== "undefined" ? localStorage.getItem("activeInstagramId") : null;

  const cachedProfile = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_portfolio");
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
    }
    return null;
  }, []);

  const { data: profileData, isLoading } = useSWR(
    user && activeIgId ? `/api/v1/me/instagram/portfolio` : null,
    fetchWithToken,
    {
      fallbackData: cachedProfile,
      onSuccess: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("dashboard_portfolio", JSON.stringify(data));
          if (data?.businessAccountId) {
            localStorage.setItem("activeInstagramId", data.businessAccountId);
          }
        }
      }
    }
  );

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  // 1. Loading Skeleton State (Styled to match new card)
  if (isLoading && !profileData) {
    return (
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-sm animate-pulse">
        <div className="h-4 bg-zinc-100 rounded-md w-1/3 mb-6" />
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="shrink-0 w-20 h-20 rounded-full bg-zinc-100" />
          <div className="flex gap-6 flex-1 justify-center">
            <div className="h-10 w-10 bg-zinc-100 rounded-md" />
            <div className="h-10 w-10 bg-zinc-100 rounded-md" />
            <div className="h-10 w-10 bg-zinc-100 rounded-md" />
          </div>
        </div>
        <div className="h-3 bg-zinc-100 rounded-sm w-1/2 mb-3" />
        <div className="h-3 bg-zinc-100 rounded-sm w-3/4 mb-3" />
        <div className="h-3 bg-zinc-100 rounded-sm w-2/3" />
      </div>
    );
  }

  // 2. Error / Not Found State
  if (!profileData) {
    return (
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 w-full max-w-sm shadow-sm text-center">
        <p className="text-sm font-semibold text-red-950 mb-2">Account Connected</p>
        <p className="text-xs text-zinc-500">We couldn't load the profile stats right now. Please refresh the page.</p>
      </div>
    );
  }

  // 3. Data Mapping 
  const username = profileData.username || "Connected Account";
  const profilePic = profileData.profilePictureUrl || "https://i.pravatar.cc/150?img=32";
  const mediaCount = profileData.mediaCount || 0;
  const followers = profileData.followersCount || 0;
  const following = profileData.followingCount || 0; 
  const bio = profileData.bio || profileData.biography || "Helping creators scale 🚀\nAutomate your DMs and grow faster.";

  return (
    <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-sm relative text-left">
      
      {/* Username Header */}
      <div className="flex items-center mb-6">
        <h3 className="font-semibold text-red-950 text-base tracking-tight">{username}</h3>
      </div>

      {/* Top Row: Profile Picture & Stats */}
      <div className="flex items-center justify-between mb-6 gap-4">
        
        {/* Profile Picture Container with Loomingo Badge */}
        <div className="relative shrink-0">
          
          {/* Profile Picture with Instagram Story Gradient Ring */}
          <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
            <div className="w-full h-full rounded-full border-[3px] border-white bg-zinc-50 overflow-hidden">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover bg-white"
                referrerPolicy="no-referrer" 
              />
            </div>
          </div>

          {/* Loomingo Logo Badge */}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-[2px] shadow-sm border border-zinc-200 flex items-center justify-center overflow-hidden">
            <img 
              src="/logo/Loomingo.png" 
              alt="Loomingo" 
              className="size-5 rounded-full object-cover"
            />
          </div>
          
        </div>

        {/* Account Stats */}
        <div className="flex gap-4 md:gap-6 text-center flex-1 justify-center text-red-950">
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight">{formatNumber(mediaCount)}</span>
            <span className="text-[11px] text-zinc-500 font-medium">Posts</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight">{formatNumber(followers)}</span>
            <span className="text-[11px] text-zinc-500 font-medium">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight">{formatNumber(following)}</span>
            <span className="text-[11px] text-zinc-500 font-medium">Following</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-2">
        <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed">
          {bio}
        </p>
      </div>
      
    </div>
  );
}