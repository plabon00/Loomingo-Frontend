"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InstagramPortfolio from "@/components/features/instagram/instagram-profile";
import InstagramIcon from "@/components/ui/icon/instagram-icon";
import UserGreeting from "@/components/layout/user-greeting";
import { Plus, Lock } from "lucide-react";

import QuickActionCTA from "@/components/sections/dashboard/QuickActionCTA";
import MiniAnalytics from "@/components/sections/dashboard/MiniAnalytics";
import RecentActivityFeed from "@/components/sections/dashboard/RecentActivityFeed";

import { auth } from "@/lib/firebase"; 
import { AuthModal, TopAlert } from "@/components/layout/AppNavigation"; 
import { useAuthUser } from "@/hooks/use-auth-user";
import useSWR from "swr";
import { TransitionLink } from "@/components/ui/transition-link";

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

export default function DashboardContent() {
  const { user, isLoading: isAuthLoading } = useAuthUser();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [topAlert, setTopAlert] = useState("");
  const [authMessage, setAuthMessage] = useState(""); 
  const [showForm, setShowForm] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Persistent Client Cache (LocalStorage) for instant load
  const cachedMe = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_me");
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
    }
    return null;
  }, []);

  // 2. SWR for background fetching and deduplication
  const { data: meData, error: meError, isLoading: isMeLoading } = useSWR(
    user ? `/api/v1/me/me` : null,
    fetchWithToken,
    {
      fallbackData: cachedMe,
      onSuccess: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("dashboard_me", JSON.stringify(data));
        }
      }
    }
  );

  // Derived State
  const isConnected = meData?.instagramConnected ?? meData?.isInstagramConnected ?? false;
  const userName = meData?.fullName?.split(" ")[0] || meData?.name?.split(" ")[0] || user?.displayName?.split(" ")[0] || "Creator";
  const planName = meData?.planName || "Free";
  const isLoadingStatus = isAuthLoading || (isMeLoading && !meData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data) {
        if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
          const { userId } = event.data;
          localStorage.setItem("activeInstagramId", userId); 
          setIsConnecting(false);
          setTopAlert("Instagram account connected successfully! 🎉"); 
          // Force SWR to revalidate so isConnected becomes true
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("userProfileUpdated"));
          }
        } 
        else if (event.data.type === "INSTAGRAM_AUTH_ERROR") {
          setIsConnecting(false);
          setTopAlert(event.data.message || "Failed to connect Instagram. Please try again.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleConnect = () => {
    if (!user) {
      setAuthMessage("Sign-in first to connect your Instagram account.");
      setShowForm(true);
      setShowAuthModal(true);
      return; 
    }

    setIsConnecting(true);
    const firebaseUid = user.uid;
    const width = 500, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://loomingo-backend-1.onrender.com";
    const authUrl = `${backendUrl}/api/instagram/connect_account?uid=${firebaseUid}`;
    
    const popup = window.open(authUrl, "Instagram Auth", `width=${width},height=${height},top=${top},left=${left}`);

    const checkPopupClosed = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(checkPopupClosed);
        setIsConnecting((prev) => {
          if (prev) setTopAlert("Connection cancelled.");
          return false;
        });
      }
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message={authMessage} showForm={showForm} />
      <TopAlert message={topAlert} onClose={() => setTopAlert("")} />

      {/* DASHBOARD HEADER */}
      <div className="font-apple w-full flex flex-col items-start text-left mt-10 md:mt-16 mb-10 gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)]">
          {planName} plan
        </span>

        <UserGreeting name={userName} />

        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] max-w-md">
            Here is what&apos;s happening with your account today.
          </p>

          {isConnected && (
            <TransitionLink href="/autodm">
              <Button className="rounded-full bg-[var(--apple-blue)] hover:bg-[var(--apple-blue-hover)] text-white h-11 px-6 text-[15px] font-medium shadow-none transition-colors duration-[240ms]">
                <Plus className="mr-2 size-4" /> New Automation
              </Button>
            </TransitionLink>
          )}
        </div>
      </div>

      {isLoadingStatus ? (
        <div className="w-full flex flex-col md:flex-row gap-6 mb-10">
          <div className="animate-pulse h-64 w-full md:w-1/3 rounded-[18px] bg-[var(--apple-surface-alt)]"></div>
          <div className="animate-pulse h-64 w-full md:w-2/3 rounded-[18px] bg-[var(--apple-surface-alt)]"></div>
        </div>
      ) : (
        <div className="relative w-full mb-10">

          {/* MAIN DASHBOARD GRID */}
          <div className={`w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 transition-all duration-700 ease-in-out ${(!isConnected || !user) ? 'blur-[10px] opacity-30 select-none pointer-events-none scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
            <div className="col-span-1 flex flex-col gap-6">
              <InstagramPortfolio />
              <div className="md:hidden">
                <QuickActionCTA />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
              <MiniAnalytics />
              <RecentActivityFeed />
            </div>
          </div>

          {/* LOCKED STATE OVERLAY */}
          {(!isConnected || !user) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-zinc-200/70 p-6 mx-2 md:mx-0">

              <div className="relative mb-6">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] border border-zinc-200">
                  <InstagramIcon className="size-8 text-zinc-900" />
                </span>
                <div className="absolute -top-1.5 -right-2.5 bg-zinc-900 rounded-full p-1.5 border-2 border-white">
                  <Lock className="size-3 text-white" />
                </div>
              </div>

              <span className="font-apple inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)] mb-4">
                <span className="size-1.5 rounded-full bg-[var(--apple-blue)]" />
                Not connected
              </span>

              <h3 className="apple-display text-[28px] md:text-[34px] mb-3">Connect to unlock</h3>

              <p className="font-apple text-[17px] leading-relaxed text-[var(--apple-gray)] mb-8 text-center max-w-md">
                Link your Instagram account to view live analytics, recent activity, and start automating your growth.
              </p>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="font-apple w-full max-w-sm relative z-10 bg-[var(--apple-blue)] hover:bg-[var(--apple-blue-hover)] text-white border-0 rounded-full h-14 text-[17px] font-medium transition-colors duration-[240ms] shadow-none"
              >
                <InstagramIcon className="size-5 mr-3" />
                {isConnecting ? "Connecting..." : "Connect Instagram"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}