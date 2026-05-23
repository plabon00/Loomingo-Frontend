"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import HowItWorks from "@/components/ui/how-it-work";
import UpcomingFeatures from "@/components/upcoming-featurs";
import InstagramPortfolio from "@/components/instagram-profile";
import InstagramIcon from "@/components/ui/icon/instagram-icon";
import UserGreeting from "@/components/user-greating";

// Firebase Auth Imports
import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth"; 

// IMPORT LAYOUT COMPONENTS & OVERLAYS FROM APP NAVIGATION
import { 
  MobileNavbar, 
  BottomDock, 
  DesktopSidebar, 
  AuthModal, 
  TopAlert 
} from "@/components/AppNavigation"; 

export default function HomePage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("Creator");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true); 
  const [planName, setPlanName] = useState("Free"); 

  // Auth & Overlay States
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [topAlert, setTopAlert] = useState("");
  const [authMessage, setAuthMessage] = useState(""); 
  const [showForm, setShowForm] = useState(true);

  // --- 1. FIREBASE AUTH & DATABASE SYNC LISTENER ---
  useEffect(() => {
    // Extracted fetch logic so we can reuse it
    const fetchUserData = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        
        // 1. Fetch User Home Profile
        const response = await fetch("http://localhost:8080/api/v1/me/me", {
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
          
          // 2. If Instagram is connected, fetch Portfolio Data & save to LocalStorage
          if (isIgConnected) {
            const portfolioResponse = await fetch("http://localhost:8080/api/v1/me/instagram/portfolio", {
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

    // 🚀 NEW: Listen for profile updates from the ManageProfileModal
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

  // --- 2. 🚀 UPDATED: INSTAGRAM AUTH SUCCESS & ERROR LISTENER ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check: ensure message comes from your own frontend domain
      if (event.origin !== window.location.origin) return;

      if (event.data) {
        // SUCCESS CASE
        if (event.data.type === "INSTAGRAM_AUTH_SUCCESS") {
          const { userId } = event.data;
          localStorage.setItem("activeInstagramId", userId); 
          
          setIsConnected(true);
          setIsConnecting(false);
          setTopAlert("Instagram account connected successfully! 🎉"); // Better UI than alert()
        } 
        // ERROR CASE (Catches the already-linked error from your Spring Boot controller)
        else if (event.data.type === "INSTAGRAM_AUTH_ERROR") {
          setIsConnecting(false);
          // Show the error message sent from your backend through the popup
          const errorMessage = event.data.message || "Failed to connect Instagram. Please try again.";
          setTopAlert(errorMessage);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // --- 3. CONNECT HANDLER ---
  const handleConnect = () => {
    // 1. If not logged in -> Show Auth Modal
    if (!user) {
      setAuthMessage("Sign-in first to connect your Instagram account.");
      setShowForm(true);
      setShowAuthModal(true);
      return; 
    }

    // 2. Proceed with connection logic
    setIsConnecting(true);
    const firebaseUid = sessionStorage.getItem("userId");

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const authUrl = `http://localhost:8080/api/instagram/connect_account?uid=${firebaseUid}`;
    
    const popup = window.open(authUrl, "Instagram Auth", `width=${width},height=${height},top=${top},left=${left}`);

    const checkPopupClosed = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(checkPopupClosed);
        // Only toggle loading state off if the user closed the window manually without success/error
        setIsConnecting((prev) => {
          if (prev) {
            setTopAlert("Connection cancelled.");
          }
          return false;
        });
      }
    }, 1000);
  };

  return (
    <div className="w-full relative flex flex-col items-center bg-background min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64">
      
      {/* AUTH OVERLAYS */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message={authMessage} showForm={showForm} />
      <TopAlert message={topAlert} onClose={() => setTopAlert("")} />

      {/* LAYOUT COMPONENTS */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* Main Page Content */}
      <div className="w-full flex flex-col items-center justify-center max-w-5xl mx-auto px-4">
        
        <div className="bg-blue-100/40 rounded-2xl border-blue-400 border-2 mt-8 md:mt-12 mb-2 w-fit">
          <p className="mx-6 my-1 dark:text-white text-blue-600 flex items-center text-center font-light text-sm md:text-base">
            <span className="text-lg mr-2">💎</span>
            You're on {planName} Plan 
          </p>
        </div>

        <UserGreeting name={userName} />

        {/* --- CONDITIONAL INSTAGRAM SECTION --- */}
        <div className="w-full max-w-sm mb-12 flex flex-col items-center text-center mt-6">
          {isLoadingStatus ? (
             <div className="animate-pulse h-11 w-full bg-muted rounded-xl"></div>
          ) : isConnected ? (
            <InstagramPortfolio />
          ) : (
            <div className="flex flex-col items-center w-full bg-card p-6 rounded-2xl border shadow-sm">
              <p className="text-sm text-muted-foreground mb-4 font-medium leading-relaxed">
                Connect your Instagram to automate DMs and scale your growth with us.
              </p>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white border-0 rounded-xl h-11 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <InstagramIcon className="size-5 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Instagram"}
              </Button>
            </div>
          )}
        </div>

        <div className="w-full"><HowItWorks /></div>
        <div className="w-full mt-12"><UpcomingFeatures /></div>

      </div>
    </div>
  );
}