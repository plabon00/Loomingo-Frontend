"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import LoomingoLogo from "@/assets/logo/Loomingo.png";

export default function InstagramProfileCard() {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const token = await user.getIdToken();
        const activeIgId = localStorage.getItem("activeInstagramId");
        
        if (!activeIgId) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/v1/me/instagram/portfolio`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Failed to fetch. Status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch Instagram profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Wait for Firebase to confirm the user is logged in before fetching
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchInstagramProfile();
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Formatter for large numbers (e.g., 12500 -> 12.5K)
  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-card border-2 border-dotted border-white rounded-[24px] p-6 w-full max-w-sm shadow-sm animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="flex items-center justify-between mb-5 gap-4">
          <div className="shrink-0 w-20 h-20 rounded-full bg-muted" />
          <div className="flex gap-6 flex-1 justify-center">
            <div className="h-10 w-10 bg-muted rounded" />
            <div className="h-10 w-10 bg-muted rounded" />
            <div className="h-10 w-10 bg-muted rounded" />
          </div>
        </div>
        <div className="h-3 bg-muted rounded w-1/2 mb-2" />
        <div className="h-3 bg-muted rounded w-3/4 mb-2" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    );
  }

  // 2. Error / Not Found State
  if (!profileData) {
    return (
      <div className="bg-card border-2 border-dotted border-white rounded-[24px] p-6 w-full max-w-sm shadow-sm text-center">
        <p className="text-sm font-semibold mb-1">Account Connected</p>
        <p className="text-xs text-muted-foreground">We couldn't load the profile stats right now. Please refresh the page.</p>
      </div>
    );
  }

  // 3. Data Mapping 
  const username = profileData.username || "Connected Account";
  const profilePic = profileData.profilePictureUrl || "https://i.pravatar.cc/150?img=32";
  const mediaCount = profileData.mediaCount || 0;
  const followers = profileData.followersCount || 0;
  
  // 🚀 UPDATED: Fetching following and bio directly from profileData
  const following = profileData.followingCount || 0; 
  const bio = profileData.bio || profileData.biography || "Helping creators scale 🚀\nAutomate your DMs and grow faster.";

  return (
    <div className="bg-card border-2 border-dotted border-white rounded-[24px] p-6 w-full max-w-sm shadow-sm relative text-left">
      
      {/* Username Header */}
      <div className="flex items-center mb-4">
        <h3 className="font-bold text-base tracking-tight">{username}</h3>
      </div>

      {/* Top Row: Profile Picture & Stats */}
      <div className="flex items-center justify-between mb-5 gap-4">
        
        {/* 🚀 UPDATED: Profile Picture Container with Loomingo Badge */}
        <div className="relative shrink-0">
          
          {/* Profile Picture with Instagram Story Gradient Ring */}
          <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
            <div className="w-full h-full rounded-full border-[3px] border-card bg-muted overflow-hidden">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover bg-white"
                referrerPolicy="no-referrer" 
              />
            </div>
          </div>

          {/* Loomingo Logo Badge */}
          <div className="absolute bottom-0 right-0 bg-card rounded-full p-[2px] shadow-sm border border-border flex items-center justify-center overflow-hidden">
            <img 
              src={LoomingoLogo.src} 
              alt="Loomingo" 
              className="size-5 rounded-full object-cover"
            />
          </div>
          
        </div>

        {/* Account Stats */}
        <div className="flex gap-4 md:gap-6 text-center flex-1 justify-center">
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">{formatNumber(mediaCount)}</span>
            <span className="text-[11px] text-muted-foreground">Posts</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">{formatNumber(followers)}</span>
            <span className="text-[11px] text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">{formatNumber(following)}</span>
            <span className="text-[11px] text-muted-foreground">Following</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-2">
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-snug">
          {bio}
        </p>
      </div>
      
    </div>
  );
}