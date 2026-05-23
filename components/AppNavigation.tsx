"use client";

import { useState, useEffect } from "react";
import { SuggestUsModal } from "@/components/suggest-us-modal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ManageProfileModal } from "@/components/manage-profile-modal";
import Loomingo from "@/assets/logo/Loomingo.png";

import {
  Home,
  MessageSquare,
  ShoppingBag,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  Settings,
  Lightbulb,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Firebase
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";

// Signup Form
import { SignupForm } from "@/components/signup-form";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";

/* =========================================================
   SHARED OVERLAYS
========================================================= */

// 1. Auth Modal
export function AuthModal({
  isOpen,
  onClose,
  message,
  showForm = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  showForm?: boolean;
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-background border shadow-2xl rounded-3xl relative w-full max-w-[400px] p-6 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-muted/80 text-muted-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        {message && (
          <div
            className={cn(
              "p-3 border backdrop-blur-sm rounded-xl text-center text-sm font-medium",
              "bg-slate-900/85 border-slate-700 text-white",
              showForm ? "mb-4" : "my-4",
            )}
          >
            {message}
          </div>
        )}

        {showForm && <SignupForm />}
      </div>
    </div>
  );
}

// 2. Top Alert
export function TopAlert({
  message,
  variant = "default",
  onClose,
}: {
  message: string;
  variant?: "default" | "destructive";
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-sm animate-in slide-in-from-top-8 fade-in zoom-in-95 duration-300 shadow-2xl">
      <Alert variant={variant} className="backdrop-blur-md bg-background/95">
        {variant === "destructive" ? (
          <AlertCircle className="size-4" />
        ) : (
          <CheckCircle2 className="size-4 text-green-500" />
        )}
        <AlertTitle>
          {variant === "destructive" ? "Error" : "Success"}
        </AlertTitle>
        <AlertDescription className="pr-4">{message}</AlertDescription>
        <AlertAction>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="size-4" />
          </button>
        </AlertAction>
      </Alert>
    </div>
  );
}

// 3. Logout Confirmation Modal
export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-background border shadow-2xl rounded-3xl relative w-full max-w-[320px] p-6 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-center mb-2">Sign Out</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMMON AUTH + INSTAGRAM CHECK
========================================================= */

async function verifyInstagramConnection(user: User) {
  try {
    const token = await user.getIdToken();

    const response = await fetch("http://localhost:8080/api/v1/me/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        instagramConnected: false,
      };
    }

    const data = await response.json();

    return {
      success: true,
      instagramConnected:
        data.instagramConnected ?? data.isInstagramConnected ?? false,
    };
  } catch (error) {
    console.error("Verification failed:", error);

    return {
      success: false,
      instagramConnected: false,
    };
  }
}

/* =========================================================
   MOBILE NAVBAR
========================================================= */

export function MobileNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomProfile = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch("http://localhost:8080/api/v1/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCustomPhoto(data.photoUrl || null);
        }
      } catch (error) {
        console.error("Failed to fetch custom profile photo", error);
      }
    };

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCustomProfile(currentUser);
      } else {
        setCustomPhoto(null);
      }
    });

    const handleProfileUpdate = () => {
      if (auth.currentUser) fetchCustomProfile(auth.currentUser);
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      unsub();
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);

  let pageTitle = "Loomingo";

  if (pathname === "/home-page") pageTitle = "Home-Loomingo";
  else if (pathname === "/auto-dm") pageTitle = "Auto-DM-Loomingo";
  else if (pathname === "/store") pageTitle = "Store-Loomingo";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center justify-between px-4 shadow-sm">
      
      {/* 🚀 UPDATED: Mobile Logo */}
      <div className="flex items-center">
        <img 
          src={Loomingo.src} 
          alt="Loomingo Logo" 
          className="h-7 w-auto object-contain" 
        />
      </div>

      <h1 className="font-semibold text-lg tracking-wide absolute left-1/2 -translate-x-1/2">
        {pageTitle}
      </h1>

      <div className="flex items-center justify-end min-w-[24px]">
        {/* Profile icon removed for mobile view as per user request */}
      </div>
    </div>
  );
}

/* =========================================================
   MOBILE BOTTOM DOCK
========================================================= */

export function BottomDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  // Overlay states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  const [alertConfig, setAlertConfig] = useState<{
    message: string;
    variant: "default" | "destructive";
  }>({ message: "", variant: "default" });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchCustomProfile = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch("http://localhost:8080/api/v1/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCustomPhoto(data.photoUrl || null);
        }
      } catch (error) {
        console.error("Failed to fetch custom profile photo", error);
      }
    };

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCustomProfile(currentUser);
      } else {
        setCustomPhoto(null);
      }
    });

    const handleProfileUpdate = () => {
      if (auth.currentUser) fetchCustomProfile(auth.currentUser);
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      unsub();
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);

  const confirmLogout = async () => {
    try {
      await signOut(auth);

      sessionStorage.clear();
      localStorage.clear();

      setShowLogoutConfirm(false);
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleProtectedAction = (actionName: string) => {
    setIsProfileOpen(false);

    if (!user) {
      setAuthMessage(`Please sign in first to access ${actionName}.`);
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }

    if (actionName === "Suggestions") {
      setShowSuggestModal(true);
    } else if (actionName === "Manage Account") {
      setShowManageAccount(true);
    } else {
      console.log(`Navigating to ${actionName}`);
    }
  };

  const handleAutoDMClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!user) {
      setAuthMessage(
        "First Sign-in and then connect instagram account to access this.",
      );
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }

    const result = await verifyInstagramConnection(user);

    if (!result.success) {
      setAlertConfig({
        message: "Unable to verify account status. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!result.instagramConnected) {
      setAlertConfig({
        message: "You have to connect your instagram first.",
        variant: "destructive",
      });
      return;
    }

    router.push("/auto-dm");
  };

  const getDockItemClass = (path: string) => {
    const isActive = pathname === path;

    return cn(
      "flex flex-col items-center gap-1 p-2 transition-colors duration-300 relative",
      isActive
        ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
        : "text-muted-foreground hover:text-foreground",
    );
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
        showForm={showForm}
      />

      <TopAlert
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig({ message: "", variant: "default" })}
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      <SuggestUsModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        onSuccess={(message) => setAlertConfig({ message, variant: "default" })}
      />

      <ManageProfileModal
        isOpen={showManageAccount}
        onClose={() => setShowManageAccount(false)}
        onSuccess={(message) => setAlertConfig({ message, variant: "default" })}
        onError={(message) =>
          setAlertConfig({ message, variant: "destructive" })
        }
      />

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)] z-50 flex items-center justify-around px-2 pb-safe">
        <Link href="/home-page" className={getDockItemClass("/home-page")}>
          <Home className="size-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/auto-dm"
          onClick={handleAutoDMClick}
          className={getDockItemClass("/auto-dm")}
        >
          <MessageSquare className="size-5" />
          <span className="text-[10px] font-medium">Auto-DM</span>
        </Link>

        <Link href="/store" className={getDockItemClass("/store")}>
          <ShoppingBag className="size-5" />
          <span className="text-[10px] font-medium">Store</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors duration-300",
              isProfileOpen
                ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {customPhoto ? (
              <img
                src={customPhoto}
                alt="Profile"
                className="size-5 rounded-full object-cover border border-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserCircle className="size-5" />
            )}

            <span className="text-[10px] font-medium">Profile</span>
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-14 right-0 w-48 bg-background border border-border/50 shadow-xl rounded-2xl py-1.5 flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in zoom-in-95">
              <button
                onClick={() => handleProtectedAction("Manage Account")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
              >
                <Settings className="size-4 text-muted-foreground" />
                Manage Account
              </button>

              <button
                onClick={() => handleProtectedAction("Help")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
              >
                <LifeBuoy className="size-4 text-muted-foreground" />
                Help
              </button>

              <button
                onClick={() => handleProtectedAction("Suggestions")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
              >
                <Lightbulb className="size-4 text-muted-foreground" /> Suggest
                us
              </button>

              <div className="border-t my-1 border-border/40" />

              {user ? (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-left transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign-out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setAuthMessage("");
                    setShowForm(true);
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 text-left transition-colors"
                >
                  <UserCircle className="size-4" />
                  Sign-in/up
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =========================================================
   DESKTOP SIDEBAR
========================================================= */

export function DesktopSidebar() {
  const pathname = usePathname();
  const [showManageAccount, setShowManageAccount] = useState(false);
  const router = useRouter();
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  // Overlay states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  const [alertConfig, setAlertConfig] = useState<{
    message: string;
    variant: "default" | "destructive";
  }>({ message: "", variant: "default" });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchCustomProfile = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch("http://localhost:8080/api/v1/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCustomPhoto(data.photoUrl || null);
        }
      } catch (error) {
        console.error("Failed to fetch custom profile photo", error);
      }
    };

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCustomProfile(currentUser);
      } else {
        setCustomPhoto(null);
      }
    });

    const handleProfileUpdate = () => {
      if (auth.currentUser) fetchCustomProfile(auth.currentUser);
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      unsub();
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);

  const confirmLogout = async () => {
    try {
      await signOut(auth);

      sessionStorage.clear();
      localStorage.clear();

      setShowLogoutConfirm(false);
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProtectedAction = (actionName: string) => {
    setIsProfileOpen(false);

    if (!user) {
      setAuthMessage(`Please sign in first to access ${actionName}.`);
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }

    if (actionName === "Suggestions") {
      setShowSuggestModal(true);
    } else if (actionName === "Manage Account") {
      setShowManageAccount(true);
    } else {
      console.log(`Navigating to ${actionName}`);
    }
  };

  const handleAutoDMClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!user) {
      setAuthMessage(
        "First Sign-in and then connect instagram account to access this.",
      );
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }

    const result = await verifyInstagramConnection(user);

    if (!result.success) {
      setAlertConfig({
        message: "Unable to verify account status. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!result.instagramConnected) {
      setAlertConfig({
        message: "You have to connect your instagram first.",
        variant: "destructive",
      });
      return;
    }

    router.push("/auto-dm");
  };

  const getSidebarItemClass = (path: string) => {
    const isActive = pathname === path;

    return cn(
      "w-full flex items-center gap-3 py-3 rounded-xl text-sm transition-colors",
      isCollapsed ? "justify-center px-0" : "px-4 font-medium",
      isActive
        ? "bg-primary/10 text-primary font-semibold shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
        showForm={showForm}
      />

      <TopAlert
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig({ message: "", variant: "default" })}
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      <SuggestUsModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        onSuccess={(message) => setAlertConfig({ message, variant: "default" })}
      />
      <ManageProfileModal
        isOpen={showManageAccount}
        onClose={() => setShowManageAccount(false)}
        onSuccess={(message) => setAlertConfig({ message, variant: "default" })}
        onError={(message) =>
          setAlertConfig({ message, variant: "destructive" })
        }
      />

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <div
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 border-r bg-background z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-background border shadow-sm rounded-full p-1 text-muted-foreground hover:text-foreground z-50 transition-transform"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>

        {/* 🚀 UPDATED: Desktop Sidebar Logo */}
        <div
          className={cn(
            "flex items-center font-light text-xl py-5 mb-4 text-primary",
            isCollapsed ? "justify-center px-0" : "gap-3 px-6",
          )}
        >
          <img 
            src={Loomingo.src} 
            alt="Loomingo Logo" 
            className={cn("object-contain transition-all duration-300", isCollapsed ? "h-8" : "h-9")}
          />
        </div>

        <nav className="flex-1 space-y-2 px-3">
          <Link href="/home-page" className={getSidebarItemClass("/home-page")}>
            <Home className="size-5 shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>

          <Link
            href="/auto-dm"
            onClick={handleAutoDMClick}
            className={getSidebarItemClass("/auto-dm")}
          >
            <MessageSquare className="size-5 shrink-0" />
            {!isCollapsed && <span>Auto-DM</span>}
          </Link>

          <Link href="/store" className={getSidebarItemClass("/store")}>
            <ShoppingBag className="size-5 shrink-0" />
            {!isCollapsed && <span>Store</span>}
          </Link>
        </nav>

        <div className="mt-auto border-t pt-4 pb-4 px-3 space-y-2">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
                isProfileOpen
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {customPhoto ? (
                <img
                  src={customPhoto}
                  alt="Profile"
                  className="size-5 shrink-0 rounded-full object-cover border border-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCircle className="size-5 shrink-0" />
              )}

              {!isCollapsed && <span className="truncate">Profile</span>}
            </button>

            {isProfileOpen && (
              <div
                className={cn(
                  "absolute bottom-full mb-2 w-48 bg-background border border-border/50 shadow-xl rounded-2xl py-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95",
                  isCollapsed ? "left-14" : "left-4",
                )}
              >
                <button
                  onClick={() => handleProtectedAction("Manage Account")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Manage Account
                </button>

                <button
                  onClick={() => handleProtectedAction("Help")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
                >
                  <LifeBuoy className="size-4 text-muted-foreground" />
                  Help
                </button>

                <button
                  onClick={() => handleProtectedAction("Suggestions")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-muted text-left transition-colors"
                >
                  <Lightbulb className="size-4 text-muted-foreground" /> Suggest
                  us
                </button>
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
              )}
            >
              <LogOut className="size-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Sign-out</span>}
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthMessage("");
                setShowForm(true);
                setShowAuthModal(true);
              }}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
              )}
            >
              <UserCircle className="size-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Sign-in / Up</span>}
            </button>
          )}
        </div>
      </div>
    </>
  );
}