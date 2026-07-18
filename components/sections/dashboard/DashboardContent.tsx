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
      <div className="w-full flex flex-col items-center justify-center text-center mt-8 md:mt-10 mb-8 gap-3">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/80 text-zinc-900 text-xs font-semibold backdrop-blur-sm shadow-sm gap-2 uppercase tracking-wider">
          <span className="text-sm">💎</span>
          {planName} Plan
        </div>
        
        <UserGreeting name={userName} />
        
        <p className="text-sm md:text-base text-zinc-500 max-w-sm font-medium">
          Here is what's happening with your account today.
        </p>

        {isConnected && (
          <TransitionLink href="/autodm" className="mt-3">
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md h-11 px-6 text-sm font-medium transition-colors">
              <Plus className="mr-2 size-4" /> New Automation
            </Button>
          </TransitionLink>
        )}
      </div>

      {isLoadingStatus ? (
        <div className="w-full flex flex-col md:flex-row gap-6 mb-10">
          <div className="animate-pulse h-64 w-full md:w-1/3 bg-white/60 border border-zinc-200 rounded-[2rem] shadow-sm"></div>
          <div className="animate-pulse h-64 w-full md:w-2/3 bg-white/60 border border-zinc-200 rounded-[2rem] shadow-sm"></div>
        </div>
      ) : (
        <div className="relative w-full mb-10">
          
          {/* MAIN DASHBOARD GRID */}
          <div className={`w-full grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out ${(!isConnected || !user) ? 'blur-[10px] opacity-30 select-none pointer-events-none scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
            <div className="col-span-1 flex flex-col gap-6">
              <InstagramPortfolio />
              <div className="md:hidden">
                <QuickActionCTA />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
              <MiniAnalytics />
              <RecentActivityFeed />
            </div>
          </div>

          {/* LOCKED STATE OVERLAY */}
          {(!isConnected || !user) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/60 shadow-xl p-6 mx-2 md:mx-0">
              
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-zinc-200/50 border border-zinc-100 relative">
                <InstagramIcon className="size-10 text-black relative z-10" />
                <div className="absolute -top-2 -right-2 bg-zinc-900 rounded-full p-1.5 border-2 border-white shadow-sm">
                  <Lock className="size-3.5 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 mb-3 tracking-tight">Connect to Unlock</h3>
              
              <p className="text-sm md:text-base text-zinc-500 mb-8 font-medium text-center max-w-md">
                Link your Instagram account to view live analytics, recent activity, and start automating your growth.
              </p>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full max-w-sm relative z-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white border-0 rounded-xl h-14 text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
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