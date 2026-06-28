"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InstagramPortfolio from "@/components/instagram-profile";
import InstagramIcon from "@/components/ui/icon/instagram-icon";
import UserGreeting from "@/components/user-greating";
import { Plus, Lock } from "lucide-react";

import QuickActionCTA from "@/components/Dashboard/QuickActionCTA";
import MiniAnalytics from "@/components/Dashboard/MiniAnalytics";
import RecentActivityFeed from "@/components/Dashboard/RecentActivityFeed";

import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth"; 

import { AuthModal, TopAlert } from "@/components/AppNavigation"; 

export default function DashboardContent() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("Creator");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true); 
  const [planName, setPlanName] = useState("Free"); 

  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [topAlert, setTopAlert] = useState("");
  const [authMessage, setAuthMessage] = useState(""); 
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchUserData = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        
        const response = await fetch(`/api/v1/me/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          const isIgConnected = data.instagramConnected ?? data.isInstagramConnected;
          setIsConnected(isIgConnected); 
          
          const fullName = data.fullName || data.name || currentUser.displayName || "Creator";
          setUserName(fullName.split(" ")[0]);
          setPlanName(data.planName || "Free"); 
          
          if (isIgConnected) {
            const portfolioResponse = await fetch(`/api/v1/me/instagram/portfolio`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
              }
            });

            if (portfolioResponse.ok) {
              const portfolioData = await portfolioResponse.json();
              if (portfolioData.businessAccountId) {
                localStorage.setItem("activeInstagramId", portfolioData.businessAccountId);
              }
            }
          } else {
            localStorage.removeItem("activeInstagramId");
          }
          
        } else {
          const fallbackName = currentUser.displayName || "Creator";
          setUserName(fallbackName.split(" ")[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user DB status:", error);
        const errorName = currentUser.displayName || "Creator";
        setUserName(errorName.split(" ")[0]);
      } finally {
        setIsLoadingStatus(false); 
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); 
      if (currentUser) {
        sessionStorage.setItem("userId", currentUser.uid);
        await fetchUserData(currentUser);
      } else {
        sessionStorage.removeItem("userId");
        localStorage.removeItem("activeInstagramId"); 
        setIsConnected(false);
        setIsLoadingStatus(false);
      }
    });

    const handleProfileUpdate = () => {
      if (auth.currentUser) {
        fetchUserData(auth.currentUser);
      }
    };
    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data) {
        if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
          const { userId } = event.data;
          localStorage.setItem("activeInstagramId", userId); 
          setIsConnected(true);
          setIsConnecting(false);
          setTopAlert("Instagram account connected successfully! 🎉"); 
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
    const firebaseUid = sessionStorage.getItem("userId");
    const width = 500, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // Updated to point directly to your ngrok backend
    const backendUrl = "https://jesica-noncommendatory-marjory.ngrok-free.dev";
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
          <Link href="/autodm" className="mt-3">
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md h-11 px-6 text-sm font-medium transition-colors">
              <Plus className="mr-2 size-4" /> New Automation
            </Button>
          </Link>
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