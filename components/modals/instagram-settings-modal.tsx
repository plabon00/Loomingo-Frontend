"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MoreVertical,
  Trash2,
  Unplug,
  CheckCircle2,
  Loader2,
  Camera,
  User,
  AlertCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ————— Theme tokens —————
const PRIMARY = "#5742f5";
const INK = "#152436";
const PAPER = "#f6f4ef";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InstagramAccount {
  id: string;
  name: string;
  username: string;
  profilePictureUrl: string;
  isSubscribed: boolean;
}

interface InstagramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AlertState = {
  type: "success" | "error";
  message: string;
} | null;

// ─── Component ────────────────────────────────────────────────────────────────

export function InstagramSettingsModal({ isOpen, onClose }: InstagramSettingsModalProps) {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  // Per-account loading states
  const [loadingAccountId, setLoadingAccountId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"remove" | "unsubscribe" | "subscribe" | null>(null);

  // Top alert banner
  const [alert, setAlert] = useState<AlertState>(null);

  // Auto-dismiss alert after 4 s
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(timer);
  }, [alert]);

  // ── Fetch accounts ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setAlert(null);
      return;
    }

    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const activeId = localStorage.getItem("activeInstagramId");
        setActiveAccountId(activeId);

        const token = await user.getIdToken();
        const res = await fetch(`/api/v1/me/instagram/accounts`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAccounts(data);
        } else {
          console.error("Failed to fetch accounts from server.");
        }
      } catch (error) {
        console.error("Failed to fetch IG accounts", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [isOpen]);

  // ── Helper: get auth token ──────────────────────────────────────────────────
  const getToken = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return user.getIdToken();
  }, []);

  // ── Subscribe to webhook ─────────────────────────────────────────────────────
  const handleSubscribe = async (accountId: string) => {
    setLoadingAccountId(accountId);
    setLoadingAction("subscribe");

    try {
      const token = await getToken();
      const res = await fetch(
        `/api/v1/me/instagram/accounts/${accountId}/webhook`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      if (res.ok) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId ? { ...acc, isSubscribed: true } : acc
          )
        );
        setAlert({ type: "success", message: "Automation subscribed successfully." });
      } else {
        const errText = await res.text().catch(() => "Unknown error");
        setAlert({
          type: "error",
          message: `Failed to subscribe: ${res.status} – ${errText}`,
        });
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      setAlert({ type: "error", message: "Network error — could not subscribe account." });
    } finally {
      setLoadingAccountId(null);
      setLoadingAction(null);
    }
  };

  // ── Unsubscribe from webhook ────────────────────────────────────────────────
  const handleUnsubscribe = async (accountId: string) => {
    if (!confirm("Are you sure you want to unsubscribe this account from automation?")) return;
    setLoadingAccountId(accountId);
    setLoadingAction("unsubscribe");

    try {
      const token = await getToken();
      const res = await fetch(
        `/api/v1/me/instagram/accounts/${accountId}/webhook`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      if (res.ok) {
        // Mark account as unsubscribed in local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId ? { ...acc, isSubscribed: false } : acc
          )
        );
        setAlert({ type: "success", message: "Automation unsubscribed successfully." });
      } else {
        const errText = await res.text().catch(() => "Unknown error");
        setAlert({
          type: "error",
          message: `Failed to unsubscribe: ${res.status} – ${errText}`,
        });
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setAlert({ type: "error", message: "Network error — could not unsubscribe account." });
    } finally {
      setLoadingAccountId(null);
      setLoadingAction(null);
    }
  };

  // ── Remove account ──────────────────────────────────────────────────────────
  const handleRemove = async (accountId: string) => {
    if (!confirm("Are you sure you want to completely remove this Instagram account?")) return;
    setLoadingAccountId(accountId);
    setLoadingAction("remove");

    try {
      const token = await getToken();
      const res = await fetch(
        `/api/v1/me/instagram/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      if (res.ok) {
        // Optimistic remove from local state
        setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
        if (activeAccountId === accountId) {
          localStorage.removeItem("activeInstagramId");
          setActiveAccountId(null);
        }
        setAlert({ type: "success", message: "Instagram account removed successfully." });
      } else {
        const errText = await res.text().catch(() => "Unknown error");
        setAlert({
          type: "error",
          message: `Failed to remove: ${res.status} – ${errText}`,
        });
      }
    } catch (error) {
      console.error("Remove error:", error);
      setAlert({ type: "error", message: "Network error — could not remove account." });
    } finally {
      setLoadingAccountId(null);
      setLoadingAction(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-2xl p-0 overflow-hidden md:rounded-[2rem] border border-[#e6e1d6] bg-white shadow-2xl h-[100dvh] md:h-auto md:max-h-[85vh] flex flex-col gap-0 [&>button:last-child]:hidden outline-none"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/5 hover:bg-black/10 rounded-full text-zinc-600 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <DialogHeader className="p-6 pb-6 relative text-left rounded-t-[2rem] border-b border-[#e6e1d6]" style={{ backgroundColor: PAPER }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2" style={{ color: INK }}>
            <div className="size-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-[#e6e1d6]">
              <Camera className="size-5" style={{ color: PRIMARY }} />
            </div>
            Connected Accounts
          </DialogTitle>
          <DialogDescription className="text-sm font-medium mt-2" style={{ color: "#6b7280" }}>
            Manage your linked profiles and automation statuses.
          </DialogDescription>
        </DialogHeader>

        {/* ── Top Alert Banner ──────────────────────────────────────────────── */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out shrink-0",
            alert ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {alert && (
            <div
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 text-sm font-medium",
                alert.type === "success"
                  ? "bg-[#f2f0ff] border-b border-[#5742f5]/20 text-[#5742f5]"
                  : "bg-red-50 border-b border-red-100 text-red-600"
              )}
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              <span className="flex-1 truncate">{alert.message}</span>
              <button
                onClick={() => setAlert(null)}
                className="ml-auto opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/5"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col h-full items-center justify-center text-zinc-400 space-y-3 min-h-[200px]">
              <Loader2 className="size-8 animate-spin" style={{ color: PRIMARY }} />
              <p className="text-sm font-medium">Loading accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col h-[200px] items-center justify-center text-zinc-400 bg-[#fbfbf9] rounded-3xl border-2 border-dashed border-[#e6e1d6] shadow-sm">
              <Camera className="size-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">No accounts connected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((acc) => {
                const isActive = acc.id === activeAccountId;
                const isBusy = loadingAccountId === acc.id;

                return (
                  <div
                    key={acc.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-3xl transition-all relative gap-4",
                      isActive
                        ? "border-[#5742f5]/30 bg-[#f2f0ff] shadow-sm"
                        : "border-[#e6e1d6] bg-white hover:border-[#5742f5]/20 hover:shadow-md",
                      isBusy && "opacity-60 pointer-events-none"
                    )}
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4">
                      {acc.profilePictureUrl ? (
                        <div className="relative">
                          <img
                            src={acc.profilePictureUrl}
                            alt={acc.username}
                            className={cn(
                              "size-14 rounded-full object-cover border-2 shadow-sm transition-colors",
                              isActive ? "border-[#5742f5]" : "border-[#e6e1d6]"
                            )}
                          />
                          {isActive && (
                            <div className="absolute -bottom-1 -right-1 text-white rounded-full p-0.5 border-2 border-white" style={{ backgroundColor: PRIMARY }}>
                              <CheckCircle2 className="size-4" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "size-14 rounded-full flex items-center justify-center border-2",
                            isActive ? "border-[#5742f5] bg-[#f2f0ff]" : "border-[#e6e1d6] bg-zinc-100"
                          )}
                        >
                          <User
                            className={cn(
                              "size-6",
                              isActive ? "text-[#5742f5]" : "text-zinc-400"
                            )}
                          />
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="font-bold text-[16px] flex items-center gap-1.5 leading-none mb-2" style={{ color: INK }}>
                          {acc.name || acc.username}
                        </span>
                        <span className="text-sm leading-none font-medium text-zinc-500">
                          @{acc.username}
                        </span>
                      </div>
                    </div>

                    {/* Right: Active Badge & Menu */}
                    <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-zinc-100">
                      {isActive && (
                        <span className="inline-flex text-[10px] uppercase tracking-wider font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#5742f5]/20" style={{ color: PRIMARY }}>
                          Active
                        </span>
                      )}

                      {/* Busy spinner */}
                      {isBusy && (
                        <Loader2 className="size-5 animate-spin text-zinc-400" />
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isBusy} className="rounded-full size-10 bg-white border border-[#e6e1d6] text-zinc-600 hover:bg-zinc-50 shadow-sm">
                            <MoreVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-[#e6e1d6] bg-white">
                          {acc.isSubscribed ? (
                            <DropdownMenuItem onClick={() => handleUnsubscribe(acc.id)} className="text-amber-600 focus:bg-amber-50 font-medium py-2.5 cursor-pointer rounded-xl">
                              <Unplug className="size-4 mr-2.5" />
                              Unsubscribe Automation
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleSubscribe(acc.id)} className="focus:bg-[#f2f0ff] font-medium py-2.5 cursor-pointer rounded-xl" style={{ color: PRIMARY }}>
                              <Zap className="size-4 mr-2.5 fill-current" />
                              Subscribe Automation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="my-1.5 bg-[#e6e1d6]/50" />
                          <DropdownMenuItem onClick={() => handleRemove(acc.id)} className="text-red-600 focus:bg-red-50 font-medium py-2.5 cursor-pointer rounded-xl">
                            <Trash2 className="size-4 mr-2.5" />
                            Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}