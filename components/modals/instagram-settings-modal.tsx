"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MoreVertical,
  Trash2,
  Unplug,
  Plug,
  CheckCircle2,
  Loader2,
  Camera,
  User,
  AlertCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";

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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
      setOpenDropdownId(null);
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
    setOpenDropdownId(null);
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
    setOpenDropdownId(null);
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
    setOpenDropdownId(null);
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-background shadow-2xl relative w-full h-full md:h-[450px] md:max-w-3xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden md:rounded-3xl rounded-none md:border"
        onClick={(e) => e.stopPropagation()}
      >
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
                "flex items-center gap-2.5 px-5 py-3 text-sm font-medium",
                alert.type === "success"
                  ? "bg-green-500/10 border-b border-green-500/20 text-green-700 dark:text-green-400"
                  : "bg-red-500/10 border-b border-red-500/20 text-red-700 dark:text-red-400"
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
                className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-5 border-b shrink-0 bg-muted/10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="size-5 text-pink-600" />
              Connected Accounts
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your linked profiles and automation statuses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div
          className="flex-1 p-4 md:p-6 overflow-y-auto"
          onClick={() => setOpenDropdownId(null)}
        >
          {isLoading ? (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">Loading accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
              <Camera className="size-10 mb-2 opacity-20" />
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
                      "flex items-center justify-between p-3.5 border rounded-2xl transition-all relative",
                      isActive
                        ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 shadow-sm"
                        : "border-border bg-card",
                      isBusy && "opacity-60 pointer-events-none"
                    )}
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3">
                      {acc.profilePictureUrl ? (
                        <img
                          src={acc.profilePictureUrl}
                          alt={acc.username}
                          className="size-10 rounded-full object-cover border shadow-sm"
                          style={{ borderColor: isActive ? "#22c55e" : "transparent" }}
                        />
                      ) : (
                        <div
                          className={cn(
                            "size-10 rounded-full flex items-center justify-center border",
                            isActive ? "border-green-500 bg-green-100" : "bg-muted"
                          )}
                        >
                          <User
                            className={cn(
                              "size-4",
                              isActive ? "text-green-600" : "text-muted-foreground"
                            )}
                          />
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm flex items-center gap-1.5 leading-none mb-1">
                          {acc.name || acc.username}
                          {isActive && <CheckCircle2 className="size-3.5 text-green-500" />}
                        </span>
                        <span className="text-[11px] text-muted-foreground leading-none">
                          @{acc.username}
                        </span>
                      </div>
                    </div>

                    {/* Right: Active Badge & 3-Dot Menu */}
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="hidden md:inline-flex text-[9px] uppercase tracking-wider font-bold text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}

                      {/* Busy spinner */}
                      {isBusy && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      )}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === acc.id ? null : acc.id);
                          }}
                          disabled={isBusy}
                          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-40"
                        >
                          <MoreVertical className="size-4 text-muted-foreground" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === acc.id && (
                          <div
                            className="absolute right-0 top-full mt-2 w-56 bg-background border border-border/60 shadow-xl rounded-xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {acc.isSubscribed ? (
                              <button
                                onClick={() => handleUnsubscribe(acc.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 transition-colors border-b border-border/50"
                              >
                                <Unplug className="size-4" />
                                Unsubscribe Automation
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSubscribe(acc.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium hover:bg-green-50 dark:hover:bg-green-950/30 text-green-600 transition-colors border-b border-border/50"
                              >
                                <Zap className="size-4" />
                                Subscribe Automation
                              </button>
                            )}
                            <button
                              onClick={() => handleRemove(acc.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"
                            >
                              <Trash2 className="size-4" />
                              Remove Account
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}