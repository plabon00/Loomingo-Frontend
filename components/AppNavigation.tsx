"use client";

import { useState, useEffect } from "react";
import { SuggestUsModal } from "@/components/suggest-us-modal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ManageProfileModal } from "@/components/manage-profile-modal";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white border border-zinc-100 shadow-2xl rounded-[2rem] relative w-full max-w-[400px] p-6 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X className="size-4" />
        </button>

        {message && (
          <div
            className={cn(
              "p-3 border rounded-xl text-center text-sm font-medium bg-red-50 border-red-100 text-red-900",
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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-sm animate-in slide-in-from-top-8 fade-in zoom-in-95 duration-300">
      <Alert variant={variant} className="backdrop-blur-xl bg-white/95 border-zinc-200 shadow-xl rounded-2xl">
        {variant === "destructive" ? (
          <AlertCircle className="size-4 text-red-500" />
        ) : (
          <CheckCircle2 className="size-4 text-green-500" />
        )}
        <AlertTitle className="text-zinc-900">
          {variant === "destructive" ? "Error" : "Success"}
        </AlertTitle>
        <AlertDescription className="pr-4 text-zinc-500">{message}</AlertDescription>
        <AlertAction>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
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
      className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white border border-zinc-100 shadow-2xl rounded-[2rem] relative w-full max-w-[320px] p-8 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-center mb-2 text-zinc-900">Sign Out</h3>
        <p className="text-sm text-zinc-500 text-center mb-8">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-md"
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

    const response = await fetch(`/api/v1/me/me`, {
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
        const res = await fetch(`/api/v1/me/profile`, {
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

  if (pathname === "/home-page") pageTitle = "Home";
  else if (pathname === "/autodm") pageTitle = "Auto-DM";
  else if (pathname === "/store") pageTitle = "Store";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50 flex items-center justify-between px-4">
      
      <div className="flex items-center">
        <img 
          src="/icon.png" 
          alt="Loomingo Logo" 
          className="h-7 w-auto object-contain" 
        />
      </div>

      <h1 className="font-semibold text-base text-zinc-900 tracking-wide absolute left-1/2 -translate-x-1/2">
        {pageTitle}
      </h1>

      <div className="flex items-center justify-end min-w-[24px]">
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
    // ... logic remains exactly the same
    const fetchCustomProfile = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`/api/v1/me/profile`, {
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
      setAuthMessage("First Sign-in and then connect instagram account to access this.");
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }
    const result = await verifyInstagramConnection(user);
    if (!result.success) {
      setAlertConfig({ message: "Unable to verify account status. Please try again.", variant: "destructive" });
      return;
    }
    if (!result.instagramConnected) {
      setAlertConfig({ message: "You have to connect your instagram first.", variant: "destructive" });
      return;
    }
    router.push("/autodm");
  };

  const getDockItemClass = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "flex flex-col items-center gap-1 p-2 transition-colors duration-300 relative",
      isActive
        ? "text-red-600 font-semibold"
        : "text-zinc-400 hover:text-zinc-900",
    );
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message={authMessage} showForm={showForm} />
      <TopAlert message={alertConfig.message} variant={alertConfig.variant} onClose={() => setAlertConfig({ message: "", variant: "default" })} />
      <LogoutConfirmModal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={confirmLogout} />
      <SuggestUsModal isOpen={showSuggestModal} onClose={() => setShowSuggestModal(false)} onSuccess={(message) => setAlertConfig({ message, variant: "default" })} />
      <ManageProfileModal isOpen={showManageAccount} onClose={() => setShowManageAccount(false)} onSuccess={(message) => setAlertConfig({ message, variant: "default" })} onError={(message) => setAlertConfig({ message, variant: "destructive" })} />

      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-t border-zinc-100 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-50 flex items-center justify-around px-2 pb-safe">
        <Link href="/home-page" className={getDockItemClass("/home-page")}>
          <Home className="size-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link href="/autodm" onClick={handleAutoDMClick} className={getDockItemClass("/autodm")}>
          <MessageSquare className="size-5" />
          <span className="text-[10px]">Auto-DM</span>
        </Link>

        <Link href="/store" className={getDockItemClass("/store")}>
          <ShoppingBag className="size-5" />
          <span className="text-[10px]">Store</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors duration-300",
              isProfileOpen ? "text-red-600 font-semibold" : "text-zinc-400 hover:text-zinc-900"
            )}
          >
            {customPhoto ? (
              <img src={customPhoto} alt="Profile" className="size-5 rounded-full object-cover border border-zinc-200" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle className="size-5" />
            )}
            <span className="text-[10px]">Profile</span>
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-16 right-0 w-48 bg-white border border-zinc-100 shadow-2xl rounded-[1.5rem] py-2 flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in zoom-in-95">
              <button
                onClick={() => handleProtectedAction("Manage Account")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <Settings className="size-4 text-zinc-400" /> Manage Account
              </button>
              <button
                onClick={() => handleProtectedAction("Help")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <LifeBuoy className="size-4 text-zinc-400" /> Help
              </button>
              <button
                onClick={() => handleProtectedAction("Suggestions")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <Lightbulb className="size-4 text-zinc-400" /> Suggest us
              </button>

              <div className="border-t my-1 border-zinc-100" />

              {user ? (
                <button
                  onClick={() => { setIsProfileOpen(false); setShowLogoutConfirm(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
                >
                  <LogOut className="size-4" /> Sign-out
                </button>
              ) : (
                <button
                  onClick={() => { setIsProfileOpen(false); setAuthMessage(""); setShowForm(true); setShowAuthModal(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-950 hover:bg-zinc-50 text-left transition-colors"
                >
                  <UserCircle className="size-4" /> Sign-in/up
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
    // ... logic remains exactly the same
    const fetchCustomProfile = async (currentUser: User) => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`/api/v1/me/profile`, {
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
      setAuthMessage("First Sign-in and then connect instagram account to access this.");
      setShowForm(true);
      setShowAuthModal(true);
      return;
    }
    const result = await verifyInstagramConnection(user);
    if (!result.success) {
      setAlertConfig({ message: "Unable to verify account status. Please try again.", variant: "destructive" });
      return;
    }
    if (!result.instagramConnected) {
      setAlertConfig({ message: "You have to connect your instagram first.", variant: "destructive" });
      return;
    }
    router.push("/autodm");
  };

  const getSidebarItemClass = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "w-full flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200",
      isCollapsed ? "justify-center px-0" : "px-4 font-medium",
      isActive
        ? "bg-zinc-100 text-red-950 font-semibold shadow-sm border border-zinc-200/50"
        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
    );
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message={authMessage} showForm={showForm} />
      <TopAlert message={alertConfig.message} variant={alertConfig.variant} onClose={() => setAlertConfig({ message: "", variant: "default" })} />
      <LogoutConfirmModal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={confirmLogout} />
      <SuggestUsModal isOpen={showSuggestModal} onClose={() => setShowSuggestModal(false)} onSuccess={(message) => setAlertConfig({ message, variant: "default" })} />
      <ManageProfileModal isOpen={showManageAccount} onClose={() => setShowManageAccount(false)} onSuccess={(message) => setAlertConfig({ message, variant: "default" })} onError={(message) => setAlertConfig({ message, variant: "destructive" })} />

      {isProfileOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
      )}

      <div
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-zinc-200 bg-white z-40 transition-all duration-300 ease-in-out shadow-sm",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-white border border-zinc-200 shadow-sm rounded-full p-1 text-zinc-400 hover:text-zinc-900 z-50 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        <div
          className={cn(
            "flex items-center py-6 mb-2",
            isCollapsed ? "justify-center px-0" : "px-6",
          )}
        >
          <img 
            src="/logo/Loomingo.png" 
            alt="Loomingo Logo" 
            className={cn("object-contain transition-all duration-300", isCollapsed ? "h-6" : "h-7")}
          />
        </div>

        <nav className="flex-1 space-y-1.5 px-3">
          <Link href="/home-page" className={getSidebarItemClass("/home-page")}>
            <Home className="size-5 shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>

          <Link href="/autodm" onClick={handleAutoDMClick} className={getSidebarItemClass("/autodm")}>
            <MessageSquare className="size-5 shrink-0" />
            {!isCollapsed && <span>Auto-DM</span>}
          </Link>

          <Link href="/store" className={getSidebarItemClass("/store")}>
            <ShoppingBag className="size-5 shrink-0" />
            {!isCollapsed && <span>Store</span>}
          </Link>
        </nav>

        <div className="mt-auto border-t border-zinc-100 pt-4 pb-6 px-3 space-y-2">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
                isProfileOpen
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              {customPhoto ? (
                <img src={customPhoto} alt="Profile" className="size-5 shrink-0 rounded-full object-cover border border-zinc-200" referrerPolicy="no-referrer" />
              ) : (
                <UserCircle className="size-5 shrink-0" />
              )}

              {!isCollapsed && <span className="truncate">Profile</span>}
            </button>

            {isProfileOpen && (
              <div
                className={cn(
                  "absolute bottom-full mb-3 w-56 bg-white border border-zinc-100 shadow-2xl rounded-[1.5rem] py-2 flex flex-col z-50 animate-in fade-in zoom-in-95",
                  isCollapsed ? "left-14" : "left-4",
                )}
              >
                <button
                  onClick={() => handleProtectedAction("Manage Account")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                >
                  <Settings className="size-4 text-zinc-400" /> Manage Account
                </button>

                <button
                  onClick={() => handleProtectedAction("Help")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                >
                  <LifeBuoy className="size-4 text-zinc-400" /> Help
                </button>

                <button
                  onClick={() => handleProtectedAction("Suggestions")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                >
                  <Lightbulb className="size-4 text-zinc-400" /> Suggest us
                </button>

                <div className="border-t my-1 border-zinc-100" />

                {user ? (
                  <button
                    onClick={() => { setIsProfileOpen(false); setShowLogoutConfirm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="size-4" /> Sign-out
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsProfileOpen(false); setAuthMessage(""); setShowForm(true); setShowAuthModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-950 hover:bg-zinc-50 text-left transition-colors"
                  >
                    <UserCircle className="size-4" /> Sign-in / Up
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}