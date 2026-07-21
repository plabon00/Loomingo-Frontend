"use client";

import { useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import useSWR from "swr";
import { useAuthUser } from "@/hooks/use-auth-user";
import { RotateCw, Heart, Grid3x3, TrendingUp } from "lucide-react";

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
  const [flipped, setFlipped] = useState(false);

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
    user ? `/api/v1/me/instagram/portfolio` : null,
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
      <div className="bg-white border border-zinc-200/70 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_1px_2px_rgba(24,24,27,0.04),0_18px_40px_-30px_rgba(24,24,27,0.25)] animate-pulse">
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
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 w-full max-w-sm shadow-sm text-center">
        <p className="text-sm font-semibold text-zinc-900 mb-2">Account Connected</p>
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

  // Rough engagement proxy (posts-per-follower) — shown on the back face.
  const engagement = followers > 0 ? ((mediaCount / followers) * 100).toFixed(1) : "0.0";

  return (
    <div className="flip-scene relative w-full max-w-sm">
      {/* Orbiting decorative ring — tinted glow behind the card */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center">
        <div className="animate-orbit h-[115%] w-[115%] rounded-full border border-dashed border-fuchsia-300/40 [mask-image:radial-gradient(circle,black,transparent_72%)]" />
        <div className="animate-orbit-reverse absolute h-[92%] w-[92%] rounded-full border border-red-300/30" />
      </div>

      <div className={`flip-card relative w-full ${flipped ? "is-flipped" : ""}`}>
        {/* ── FRONT FACE ─────────────────────────────── */}
        <div className="flip-face relative bg-white/80 backdrop-blur-xl border border-zinc-200/70 rounded-3xl p-6 sm:p-8 lg:p-5 w-full shadow-[0_1px_2px_rgba(24,24,27,0.04),0_18px_40px_-30px_rgba(24,24,27,0.25)] text-left overflow-hidden">
          {/* colored wash */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-400/20 to-red-400/10 blur-2xl" />

          {/* Username Header + flip control */}
          <div className="flex items-center justify-between mb-6 lg:mb-4 relative">
            <h3 className="font-semibold text-zinc-900 text-base tracking-tight">{username}</h3>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              aria-label="Flip card to see engagement stats"
              className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white transition-colors duration-200 active:scale-95"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Top Row: Profile Picture & Stats */}
          <div className="flex items-center justify-between mb-6 lg:mb-5 gap-4 lg:gap-2 w-full relative">
            <div className="relative shrink-0">
              <div className="w-20 h-20 lg:w-16 lg:h-16 rounded-full p-[3px] lg:p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
                <div className="w-full h-full rounded-full border-[3px] lg:border-[2px] border-white bg-zinc-50 overflow-hidden">
                  <img
                    src={profilePic}
                    alt={`${username} profile photo`}
                    className="w-full h-full object-cover bg-white"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 lg:-bottom-1 lg:-right-1 bg-white rounded-full p-[2px] shadow-sm border border-zinc-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo/Loomingo.png"
                  alt="Loomingo"
                  className="size-5 lg:size-4 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 lg:gap-3 text-center flex-1 justify-center lg:justify-end text-zinc-900">
              <div className="flex flex-col">
                <span className="font-semibold text-lg lg:text-base leading-tight tabular-nums">{formatNumber(mediaCount)}</span>
                <span className="text-[11px] lg:text-[10px] text-zinc-500 font-medium">Posts</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg lg:text-base leading-tight tabular-nums">{formatNumber(followers)}</span>
                <span className="text-[11px] lg:text-[10px] text-zinc-500 font-medium">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg lg:text-base leading-tight tabular-nums">{formatNumber(following)}</span>
                <span className="text-[11px] lg:text-[10px] text-zinc-500 font-medium">Following</span>
              </div>
            </div>
          </div>

          <div className="mb-2 w-full relative">
            <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed break-words">
              {bio}
            </p>
          </div>

          <p className="mt-4 text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 relative">
            <RotateCw className="size-3" aria-hidden="true" /> Tap to flip for insights
          </p>
        </div>

        {/* ── BACK FACE ──────────────────────────────── */}
        <div className="flip-face flip-face-back bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 lg:p-6 w-full shadow-[0_18px_40px_-30px_rgba(24,24,27,0.6)] text-left overflow-hidden flex flex-col">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-gradient-to-tr from-fuchsia-500/30 to-red-500/20 blur-2xl" />

          <div className="flex items-center justify-between mb-6 relative">
            <h3 className="font-semibold text-white text-base tracking-tight">Account insights</h3>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label="Flip card back to profile"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-zinc-900 transition-colors duration-200 active:scale-95"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 relative flex-1 content-start">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <Grid3x3 className="size-4 text-fuchsia-300 mb-2" aria-hidden="true" />
              <span className="block text-2xl font-semibold tabular-nums">{formatNumber(mediaCount)}</span>
              <span className="text-[11px] text-zinc-400">Total posts</span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <Heart className="size-4 text-red-400 mb-2" aria-hidden="true" />
              <span className="block text-2xl font-semibold tabular-nums">{formatNumber(followers)}</span>
              <span className="text-[11px] text-zinc-400">Followers</span>
            </div>
            <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10 p-4">
              <TrendingUp className="size-4 text-emerald-400 mb-2" aria-hidden="true" />
              <span className="block text-2xl font-semibold tabular-nums">{engagement}%</span>
              <span className="text-[11px] text-zinc-400">Content ratio (posts / follower)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}