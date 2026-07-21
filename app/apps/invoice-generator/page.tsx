"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import Footer from "@/components/layout/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Plus, Trash2, Settings, Loader2, FileDown, Check, X, Building, Megaphone, List, ChevronDown, Calendar, Edit3, ArrowRight, ArrowLeft, Save, FileText, Search, Receipt, Landmark } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { InvoiceHtmlPreview } from "@/components/invoice/InvoiceHtmlPreview";
import { ScaledA4, TemplateThumbnail, buildInvoicePreviewData } from "@/components/invoice/ScaledInvoicePreview";

const TEMPLATES = [
  { id: 1, name: "Modern Teal" },
  { id: 2, name: "Retro Beige" },
  { id: 3, name: "Teal Ribbon" },
  { id: 4, name: "Blue Wave" },
  { id: 5, name: "Minimal Gold" },
  { id: 6, name: "Dark Professional" },
];

const DELIVERABLE_OPTIONS = ["Instagram Reel", "Instagram Story", "YouTube Video", "YouTube Short", "Static Post", "Carousel Post", "Other"];
const ITEM_TYPES = ["Reels + Story", "Reels", "Story", "Ad Rights", "Others"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["2024", "2025", "2026", "2027", "2028"];

const getCurrencySymbol = (c: string) => (c === "USD" ? "$" : c === "EUR" ? "€" : c === "GBP" ? "£" : "₹");

// ————— Ledger design tokens —————
// Ink navy for primary actions, emerald for "money" moments, warm paper surfaces.
const INK = "#1d1d1f";        // Apple ink
const INK_HOVER = "#1f3450";
const MONEY = "#0066cc";      // Apple blue accent
const PAPER = "#ffffff";      // Apple white page

// Shared control styles: explicit colors so inputs stay readable
// regardless of the system dark-mode preference (page is light-locked).
const inputCls = "h-10 sm:h-11 rounded-xl border-[var(--apple-hairline)] bg-white text-zinc-900 text-base sm:text-sm placeholder:text-zinc-400 shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--apple-blue)]/25 focus-visible:border-[var(--apple-ink)] transition-all duration-200";
const selectCls = "w-full rounded-xl border border-[var(--apple-hairline)] bg-white text-zinc-900 text-base sm:text-sm outline-none focus:border-[var(--apple-ink)] appearance-none shadow-sm h-10 sm:h-11 transition-colors";
const cardCls = "border-t border-[var(--apple-hairline)]"; // flat section divider, no card
const kickerCls = "text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-gray-2)]";

const sectionReveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export default function InvoiceGeneratorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard Data
  const [invoices, setInvoices] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [creatorSettings, setCreatorSettings] = useState<any>(null);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"history" | "brands" | "templates">("history");
  const [wizardStep, setWizardStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isBrandSearchOpen, setIsBrandSearchOpen] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Preview State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ invoiceData: any; lineItems: any[] } | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null); // saved invoice record (null = wizard preview)
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState("");

  // Edit Date Modal
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [editDate, setEditDate] = useState("");
  const [isSavingDate, setIsSavingDate] = useState(false);

  // Brand Edit Modal
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isDeletingBrand, setIsDeletingBrand] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    templateId: 1,
    brandName: "",
    billingAddress: "",
    gstin: "",
    pan: "",
    contact: "",
    brandEmail: "",
    contactNumber: "",
    bankHolderName: "",
    igUserName: "",
    liveDate: new Date().toISOString().split('T')[0],
    currency: "INR",
    campaignName: "",
  });

  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [otherDeliverable, setOtherDeliverable] = useState("");
  const [showOtherDeliverableInput, setShowOtherDeliverableInput] = useState(false);

  const [lineItems, setLineItems] = useState([
    { no: 1, type: "Reels", name: "Instagram Reel", quantity: 1, price: 0, adRightsFrom: "", adRightsTo: "", adRightsYear: new Date().getFullYear().toString() }
  ]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchDashboardData(currentUser.uid);
      } else {
        router.push("/");
      }
    });
    return () => unsub();
  }, [router]);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch Invoices, Brands, and Settings concurrently
      const [invRes, brandRes, settingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices?userId=${userId}`),
        fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands?userId=${userId}`),
        fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/creator/settings?userId=${userId}`)
      ]);

      if (invRes.ok) {
        const data = await invRes.json();
        setInvoices(data.invoices || []);
      }
      if (brandRes.ok) {
        const data = await brandRes.json();
        setBrands(data.brands || []);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setCreatorSettings(data.settings || data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPdfBlobUrl = async (invoiceId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices/download?id=${invoiceId}`);
    const data = await res.json();
    if (res.ok && data.pdfBase64) {
      const binaryString = window.atob(data.pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }
    return null;
  };

  const openPreviewFromHistory = async (inv: any) => {
    setSelectedInvoiceNumber(inv.invoiceNumber);
    setPreviewInvoice(inv);
    setPreviewPdfUrl(null);
    setIsPreviewModalOpen(true);

    // Prefer the client-side HTML render: it scales to fit any screen.
    const data = buildInvoicePreviewData(inv);
    if (data) {
      setPreviewData(data);
      setIsPreviewLoading(false);
      return;
    }

    // Fallback: fetch the stored PDF.
    setPreviewData(null);
    setIsPreviewLoading(true);
    try {
      const url = await fetchPdfBlobUrl(inv.id);
      setPreviewPdfUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleBrandDelete = async () => {
    if (!editingBrand?.id || !user) return;
    setIsDeletingBrand(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands?id=${editingBrand.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setShowDeleteConfirm(false);
        setIsBrandModalOpen(false);
        fetchDashboardData(user.uid);
        toast.success("Brand deleted successfully!");
      } else {
        toast.error("Failed to delete brand. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while deleting the brand.");
    } finally {
      setIsDeletingBrand(false);
    }
  };

  const buildWizardPayload = () => {
    let finalDeliverables = selectedDeliverables.filter(d => d !== "Other").join(", ");
    if (selectedDeliverables.includes("Other") && otherDeliverable) {
      finalDeliverables += finalDeliverables ? `, ${otherDeliverable}` : otherDeliverable;
    }

    const formattedLineItems = lineItems.map(item => {
      if (item.type === "Ad Rights" && item.adRightsFrom && item.adRightsTo) {
        const yearStr = item.adRightsYear ? ` ${item.adRightsYear}` : ` ${new Date().getFullYear()}`;
        return { ...item, name: `Advertisement Rights from ${item.adRightsFrom} - ${item.adRightsTo}${yearStr}` };
      }
      return item;
    });

    return { ...formData, deliverables: finalDeliverables, lineItems: formattedLineItems };
  };

  const handleDownloadPreview = async () => {
    setIsDownloading(true);
    try {
      let url = previewPdfUrl;
      if (!url) {
        if (previewInvoice?.id) {
          url = await fetchPdfBlobUrl(previewInvoice.id);
        } else if (user) {
          // Wizard preview: generate the PDF on demand.
          const invoiceData = buildWizardPayload();
          const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, preview: true, invoiceData })
          });
          const data = await res.json();
          if (res.ok && data.success && data.pdfBase64) {
            const binaryString = window.atob(data.pdfBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
            url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
          } else if (res.ok && data.pdfUrl) {
            url = data.pdfUrl;
          }
        }
        if (url) setPreviewPdfUrl(url);
      }
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${selectedInvoiceNumber || Date.now()}.pdf`;
        a.click();
      } else {
        toast.error("Could not prepare the PDF. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error preparing the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Line Item Handlers
  const addLineItem = () => {
    setLineItems([...lineItems, { no: lineItems.length + 1, type: "Others", name: "", quantity: 1, price: 0, adRightsFrom: "", adRightsTo: "", adRightsYear: new Date().getFullYear().toString() }]);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "type") {
      if (value === "Reels") newItems[index].name = "Instagram Reel Content & Promotion";
      else if (value === "Story") newItems[index].name = "Instagram Story Content & Promotion";
      else if (value === "Reels + Story") newItems[index].name = "Instagram Reel + Story Campaign Package";
      else if (value === "Ad Rights") newItems[index].name = "Advertisement Rights";
      else if (value === "Others") newItems[index].name = "";
    }
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, no: i + 1 })));
  };

  const toggleDeliverable = (deliv: string) => {
    setSelectedDeliverables(prev => {
      if (prev.includes(deliv)) return prev.filter(d => d !== deliv);
      if (prev.length >= 5) {
        toast.error("You can select a maximum of 5 deliverables.");
        return prev;
      }
      return [...prev, deliv];
    });
  };

  const handleAddCustomDeliverable = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = otherDeliverable.trim();
      if (val !== '') {
        if (!selectedDeliverables.includes(val)) {
          if (selectedDeliverables.length >= 5) {
            toast.error("You can select a maximum of 5 deliverables.");
            return;
          }
          setSelectedDeliverables([...selectedDeliverables, val]);
        }
        setOtherDeliverable("");
        setShowOtherDeliverableInput(false);
      }
    }
  };

  // Instant client-side preview: scales to fit every screen (no PDF zoom issues).
  const handleGenerate = () => {
    const errors: string[] = [];
    if (!formData.brandName) errors.push("brandName");
    if (!formData.billingAddress) errors.push("billingAddress");
    if (lineItems.length === 0) {
      toast.error("You must add at least one line item.");
      return;
    }
    if (errors.length > 0) {
      setFormErrors(errors);
      toast.error("Please fill all mandatory fields marked in red.");
      return;
    }
    setFormErrors([]);

    const payload = buildWizardPayload();
    setPreviewInvoice(null);
    setPreviewPdfUrl(null);
    setSelectedInvoiceNumber("New_Invoice");
    setPreviewData({ invoiceData: payload, lineItems: payload.lineItems });
    setIsPreviewLoading(false);
    setIsPreviewModalOpen(true);
  };

  const handleSaveInvoice = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const invoiceData = buildWizardPayload();

      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          preview: false,
          invoiceData
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Invoice Saved: ${data.invoiceNumber}`);
        setIsWizardOpen(false);
        fetchDashboardData(user.uid);
      } else {
        toast.error("Failed to save invoice.");
      }
    } catch (err) {
      toast.error("Network error saving invoice.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditDate = (inv: any) => {
    setEditingInvoice(inv);
    const d = inv.createdAt ? new Date(inv.createdAt) : new Date();
    setEditDate(isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0]);
  };

  const handleUpdateInvoiceDate = async () => {
    if (!user || !editingInvoice || !editDate) return;
    setIsSavingDate(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices?id=${editingInvoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, createdAt: new Date(editDate).toISOString() })
      });
      if (res.ok) {
        setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? { ...i, createdAt: new Date(editDate).toISOString() } : i));
        setEditingInvoice(null);
        toast.success("Invoice date updated successfully.");
      } else {
        toast.error("Failed to update date.");
      }
    } catch (err) {
      toast.error("Network error updating date.");
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleBrandSave = async () => {
    if (!user || !editingBrand?.name) return;
    setIsSavingBrand(true);
    try {
      const isNew = !editingBrand.id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands${!isNew ? `?id=${editingBrand.id}` : ''}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: editingBrand.name,
          address: editingBrand.address,
          gstin: editingBrand.gstin,
          pan: editingBrand.pan,
          contact: editingBrand.contact,
          email: editingBrand.email
        })
      });
      if (res.ok) {
        setIsBrandModalOpen(false);
        fetchDashboardData(user.uid);
        toast.success(isNew ? "Brand created successfully!" : "Brand updated successfully!");
      } else {
        toast.error("Failed to save brand. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving the brand.");
    } finally {
      setIsSavingBrand(false);
    }
  };

  const openNewInvoiceWizard = (templateId: number = 1) => {
    setFormData({ templateId, brandName: "", billingAddress: "", gstin: "", pan: "", contact: "", brandEmail: "", contactNumber: "", bankHolderName: "", igUserName: creatorSettings?.igUserName || "", liveDate: new Date().toISOString().split('T')[0], currency: "INR", campaignName: "" });
    setSelectedDeliverables([]);
    setOtherDeliverable("");
    setShowOtherDeliverableInput(false);
    setLineItems([{ no: 1, type: "Reels", name: "Instagram Reel Content & Promotion", quantity: 1, price: 0, adRightsFrom: "", adRightsTo: "", adRightsYear: new Date().getFullYear().toString() }]);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewData(null);
    setPreviewInvoice(null);
    if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
    setPreviewPdfUrl(null);
  };

  return (
    <div className="flex min-h-[100dvh] font-sans text-zinc-900" style={{ backgroundColor: PAPER }}>
      <Toaster position="top-center" richColors />
      <DesktopSidebar />
      <MobileNavbar />

      <main className="font-apple flex-1 pt-[calc(4rem+var(--promo-h,0px))] md:pt-[calc(3rem+var(--promo-h,0px))] pb-24 md:pb-8 w-full overflow-x-hidden">

        {/* ————— HEADER: flat, same pattern as autodm ————— */}
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="w-full flex flex-col items-start text-left mt-10 md:mt-16 mb-12 gap-3">
            <p className={kickerCls}>Creator billing desk</p>
            <h1 className="apple-display text-[34px] md:text-[48px]">Get paid properly.</h1>

            <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <p className="text-[17px] md:text-[21px] leading-relaxed text-[var(--apple-gray)] max-w-md">
                Brand-deal invoices that look as professional as your content, drafted and delivered in minutes.
              </p>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/apps/invoice-generator/creator-details">
                  <Button variant="outline" className="rounded-full border-[var(--apple-hairline)] bg-transparent text-[var(--apple-ink)] hover:bg-[var(--apple-surface-alt)] hover:text-[var(--apple-ink)] h-11 px-5 text-[15px] font-medium transition-colors duration-[240ms] shadow-none" disabled={isLoading}>
                    <Settings className="mr-2 size-4" /> Creator Details
                  </Button>
                </Link>
                <Button onClick={() => openNewInvoiceWizard()} disabled={isLoading} className="rounded-full bg-[var(--apple-blue)] hover:bg-[var(--apple-blue-hover)] text-white h-11 px-6 text-[15px] font-medium transition-colors duration-[240ms] shadow-none">
                  <Plus className="mr-2 size-4" /> Create Invoice
                </Button>
              </div>
            </div>
          </div>

          {/* Stats row — divider columns, same as dashboard/autodm */}
          <div className="w-full grid grid-cols-3 divide-x divide-[var(--apple-hairline)] mb-4">
            {[
              { value: isLoading ? "—" : invoices.length, label: "Invoices raised" },
              { value: isLoading ? "—" : brands.length, label: "Brands on file" },
              { value: TEMPLATES.length, label: "Templates" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col gap-1.5 py-2 ${i === 0 ? "pr-4 md:pr-6" : "px-4 md:px-6"}`}>
                <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-gray-2)] truncate">
                  {stat.label}
                </span>
                <span className="apple-display text-[28px] md:text-[40px] tabular-nums">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-8 md:mt-12 space-y-14 md:space-y-20">

          {isLoading || !user ? (
            <div className="space-y-6 animate-pulse mt-8">
              {/* History Skeleton */}
              <div className={`${cardCls} pt-8 md:pt-10`}>
                <div className="h-6 w-32 bg-[var(--apple-surface-alt)] rounded-full mb-4"></div>
                <div className="flex gap-3 overflow-hidden">
                  <div className="w-full sm:w-48 h-[220px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0"></div>
                  <div className="w-full sm:w-48 h-[220px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0"></div>
                  <div className="w-full sm:w-48 h-[220px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0 hidden sm:block"></div>
                  <div className="w-full sm:w-48 h-[220px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0 hidden md:block"></div>
                </div>
              </div>

              {/* Brands Skeleton */}
              <div className={`${cardCls} pt-8 md:pt-10`}>
                <div className="h-6 w-32 bg-[var(--apple-surface-alt)] rounded-full mb-4"></div>
                <div className="flex gap-3 overflow-hidden">
                  <div className="w-full sm:w-64 h-[120px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0"></div>
                  <div className="w-full sm:w-64 h-[120px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0"></div>
                  <div className="w-full sm:w-64 h-[120px] bg-[var(--apple-surface-alt)] rounded-2xl shrink-0 hidden md:block"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Tabs — sliding ink pill */}
              <div className="flex sm:hidden p-1 bg-white border border-[var(--apple-hairline)] rounded-full shadow-sm mt-2">
                {([["history", "History"], ["brands", "Brands"], ["templates", "Templates"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveMobileTab(key)}
                    className={`relative flex-1 py-2.5 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer ${activeMobileTab === key ? "text-white" : "text-zinc-600"}`}
                  >
                    {activeMobileTab === key && (
                      <motion.span
                        layoutId="mobile-tab-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-full shadow-sm"
                        style={{ backgroundColor: INK }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>

              {/* ————— HISTORY: The Paper Trail ————— */}
              <motion.section {...sectionReveal} className={`${cardCls} pt-8 md:pt-10 ${activeMobileTab === "history" ? "block" : "hidden sm:block"}`}>
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div>
                    <p className={kickerCls}>History</p>
                    <h2 className="text-[21px] md:text-[28px] font-semibold tracking-tight text-[var(--apple-ink)] mt-0.5">Recent invoices</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/apps/invoice-generator/history">
                      <span className="apple-link text-[14px] whitespace-nowrap">View all ›</span>
                    </Link>
                    <Button onClick={() => openNewInvoiceWizard()} size="sm" className="rounded-full text-white shadow-sm hidden sm:flex hover:brightness-110 transition-all" style={{ backgroundColor: INK }}>
                      <Plus className="size-4 mr-1" /> Create New
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-4 sm:pb-2 sm:snap-x sm:snap-mandatory sm:scrollbar-hide">
                  {/* Create New Invoice card at the front */}
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openNewInvoiceWizard()}
                    className="w-full sm:w-48 sm:snap-start shrink-0 rounded-[18px] border-2 border-dashed border-[var(--apple-blue)]/35 bg-[var(--apple-blue)]/[0.04] hover:bg-[var(--apple-blue)]/[0.08] hover:border-[var(--apple-blue)]/60 transition-colors flex flex-col items-center justify-center gap-2.5 min-h-[180px] sm:min-h-[220px] cursor-pointer group"
                  >
                    <span className="size-11 rounded-full text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:rotate-90" style={{ backgroundColor: MONEY }}>
                      <Plus className="size-5" />
                    </span>
                    <span className="text-sm font-bold" style={{ color: MONEY }}>New Invoice</span>
                    <span className="text-[12px] text-[var(--apple-gray-2)] -mt-1">bill the next deal</span>
                  </motion.button>

                  {invoices.length === 0 ? (
                    <div className="flex flex-col justify-center px-4">
                      <p className="text-[17px] font-semibold text-[var(--apple-ink)]">No invoices yet</p>
                      <p className="text-xs text-zinc-400 mt-1">Your saved invoices will appear here.</p>
                    </div>
                  ) : (
                    invoices.slice(0, 10).map((inv, i) => {
                      const thumb = buildInvoicePreviewData(inv);
                      return (
                        <motion.div
                          key={inv.id || i}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full sm:w-48 sm:snap-start shrink-0 rounded-[18px] bg-[var(--apple-surface-alt)] hover:bg-[#efeff1] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                        >
                          {/* Exact invoice preview (top of the document) */}
                          <div onClick={() => openPreviewFromHistory(inv)} className="relative h-28 sm:h-36 overflow-hidden cursor-pointer bg-white border-b border-[var(--apple-hairline)]">
                            {thumb ? (
                              <ScaledA4 className="pointer-events-none select-none">
                                <InvoiceHtmlPreview invoiceData={thumb.invoiceData} lineItems={thumb.lineItems} creatorSettings={creatorSettings} />
                              </ScaledA4>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <FileText className="size-10 text-zinc-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded truncate" style={{ backgroundColor: "#1d1d1f0d", color: INK }}>{inv.invoiceNumber}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditDate(inv); }}
                                title="Edit invoice date"
                                className="shrink-0 p-1.5 rounded-full bg-[var(--apple-surface-alt)] text-zinc-600 hover:text-white transition-colors cursor-pointer"
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = INK)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                              >
                                <Edit3 className="size-3" />
                              </button>
                            </div>
                            <h3 onClick={() => openPreviewFromHistory(inv)} className="font-bold text-sm text-zinc-950 truncate cursor-pointer">{inv.brandName}</h3>
                            <p className="text-[11px] text-zinc-500 truncate">{inv.campaignName || 'No Campaign Name'}</p>
                            <p className="text-[10px] text-zinc-400 mt-1.5 font-medium tabular-nums">{new Date(inv.createdAt).toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.section>

              {/* ————— SAVED BRANDS: The Rolodex ————— */}
              <motion.section {...sectionReveal} className={`${cardCls} pt-8 md:pt-10 ${activeMobileTab === "brands" ? "block" : "hidden sm:block"}`}>
                <div className="mb-4">
                  <p className={kickerCls}>Brands</p>
                  <h2 className="text-[21px] md:text-[28px] font-semibold tracking-tight text-[var(--apple-ink)] mt-0.5">Saved brands</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-4 sm:pb-2 sm:snap-x sm:snap-mandatory sm:scrollbar-hide">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditingBrand({ name: "", address: "", gstin: "", pan: "", contact: "", email: "" }); setIsBrandModalOpen(true); }}
                    className="w-full sm:w-64 sm:snap-start shrink-0 p-3 sm:p-4 rounded-[18px] border-2 border-dashed border-[var(--apple-hairline)] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[var(--apple-ink)]/50 transition-colors h-[120px] group"
                  >
                    <Plus className="size-6 text-zinc-400 mb-2 transition-transform duration-300 group-hover:rotate-90" />
                    <span className="text-sm font-semibold text-zinc-700">Add New Brand</span>
                  </motion.div>
                  {brands.map((b, i) => (
                    <motion.div
                      key={b.id || i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3 }}
                      className="w-full sm:w-64 sm:snap-start shrink-0 p-3 sm:p-4 rounded-[18px] bg-[var(--apple-surface-alt)] hover:bg-[#efeff1] transition-all duration-300 flex flex-col justify-between h-[120px] relative"
                    >
                      <div>
                        {/* Brand monogram */}
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="size-7 rounded-lg text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: INK }}>
                            {(b.name || "?").charAt(0).toUpperCase()}
                          </span>
                          <h3 className="font-bold text-zinc-950 truncate pr-8">{b.name}</h3>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{b.address || 'No Address'}</p>
                        {(b.gstin || b.pan) && (
                          <p className="text-[10px] font-semibold mt-2 flex items-center gap-1" style={{ color: MONEY }}>
                            <Check className="size-3" /> Tax ID attached
                          </p>
                        )}
                      </div>
                      <button onClick={() => { setEditingBrand(b); setIsBrandModalOpen(true); }} className="absolute top-3 right-3 bg-[var(--apple-surface-alt)] p-2 rounded-full hover:bg-[var(--apple-hairline)] transition-colors cursor-pointer" title="Edit brand">
                        <Edit3 className="size-3.5 text-zinc-600" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ————— TEMPLATES: The Stationery Drawer ————— */}
              <motion.section {...sectionReveal} className={`${cardCls} pt-8 md:pt-10 ${activeMobileTab === "templates" ? "block" : "hidden sm:block"}`}>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className={kickerCls}>Templates</p>
                    <h2 className="text-[21px] md:text-[28px] font-semibold tracking-tight text-[var(--apple-ink)] mt-0.5">Templates</h2>
                  </div>
                  <p className="text-[14px] text-[var(--apple-gray-2)] hidden sm:block">pick one, start billing</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 pb-2">
                  {TEMPLATES.map((t, i) => (
                    <motion.button
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.25), duration: 0.3 }}
                      whileHover={{ y: -3 }}
                      onClick={() => openNewInvoiceWizard(t.id)}
                      className="w-full text-left rounded-[18px] bg-[var(--apple-surface-alt)] overflow-hidden hover:bg-[#efeff1] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--apple-blue)]"
                    >
                      <div className="border-b border-[var(--apple-hairline)]">
                        <TemplateThumbnail templateId={t.id} />
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-zinc-800 truncate">{t.name}</span>
                        <ArrowRight className="size-3.5 text-zinc-300 group-hover:translate-x-0.5 shrink-0 transition-all duration-200" style={{}} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            </>
          )}

        </div>
        <Footer />
      </main>

      {/* ————— NEW INVOICE WIZARD ————— */}
      <AnimatePresence>
        {isWizardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--apple-ink)]/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 pb-20 sm:pb-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="bg-white w-full h-auto max-h-[82dvh] sm:max-h-[90vh] max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header with step progress */}
              <div className="p-4 sm:p-6 pb-0 sm:pb-0 border-b border-[var(--apple-hairline)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-zinc-950 tracking-tight">New Invoice</h3>
                    <p className="font-semibold tracking-tight text-sm text-zinc-400 mt-0.5">
                      {wizardStep === 1 ? "who's paying, and for what" : "name your price"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsWizardOpen(false)} className="rounded-full text-zinc-500 hover:bg-[var(--apple-surface-alt)] cursor-pointer"><X className="size-5" /></Button>
                </div>
                {/* Progress rail */}
                <div className="flex gap-1.5 mt-4 mb-4">
                  <div className="h-1 flex-1 rounded-full overflow-hidden bg-[var(--apple-surface-alt)]">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: MONEY }} initial={false} animate={{ width: "100%" }} />
                  </div>
                  <div className="h-1 flex-1 rounded-full overflow-hidden bg-[var(--apple-surface-alt)]">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: MONEY }} initial={false} animate={{ width: wizardStep === 2 ? "100%" : "0%" }} transition={{ duration: 0.35, ease: "easeOut" }} />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-white">

                <AnimatePresence mode="wait" initial={false}>
                  {/* STEP 1: Campaign Details */}
                  {wizardStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5 sm:space-y-6"
                    >
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                            <span className="size-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: INK }}><Building className="size-3.5" /></span>
                            Client Information
                          </h4>
                          {isBrandSearchOpen ? (
                            <div className="flex items-center gap-2 relative w-32 sm:w-48">
                              <Input
                                autoFocus
                                placeholder="Search..."
                                className="h-8 text-xs pr-8 rounded-lg border-[var(--apple-hairline)]"
                                value={brandSearchQuery}
                                onChange={(e) => setBrandSearchQuery(e.target.value)}
                              />
                              <button onClick={() => { setIsBrandSearchOpen(false); setBrandSearchQuery(""); }} className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 cursor-pointer">
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setIsBrandSearchOpen(true)} className="p-1.5 text-zinc-400 hover:bg-[var(--apple-surface-alt)] rounded-full transition-colors cursor-pointer" aria-label="Search brands">
                              <Search className="size-4" />
                            </button>
                          )}
                        </div>

                        {brands.length === 0 ? (
                          <div className="p-4 border border-dashed border-[var(--apple-hairline)] rounded-xl text-center text-sm text-zinc-500 bg-white">
                            No saved brands found. You can add them from the Dashboard.
                          </div>
                        ) : (
                          <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {brands
                              .filter(b => b.name.toLowerCase().includes(brandSearchQuery.toLowerCase()))
                              .map(b => {
                                const isSelected = formData.brandName === b.name;
                                return (
                                  <button
                                    key={b.id}
                                    onClick={() => {
                                      setFormData({...formData, brandName: b.name, billingAddress: b.address || "", gstin: b.gstin || "", pan: b.pan || "", contact: b.contact || "", brandEmail: b.email || ""});
                                    }}
                                    className={`snap-start shrink-0 w-40 sm:w-48 text-left p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer relative ${isSelected ? 'bg-white shadow-md' : 'bg-white border-[var(--apple-hairline)] hover:border-[var(--apple-ink)]/30 shadow-sm'}`}
                                    style={isSelected ? { borderColor: MONEY } : undefined}
                                  >
                                    {isSelected && (
                                      <span className="absolute -top-2 -right-2 size-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: MONEY }}>
                                        <Check className="size-3" />
                                      </span>
                                    )}
                                    <h5 className="font-bold text-sm truncate text-zinc-950">{b.name}</h5>
                                    <p className="text-[10px] mt-1 truncate text-zinc-500">{b.address || 'No Address'}</p>
                                  </button>
                                );
                            })}
                            {brands.filter(b => b.name.toLowerCase().includes(brandSearchQuery.toLowerCase())).length === 0 && (
                              <div className="text-xs text-zinc-500 italic p-2">No brands match your search.</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                          <span className="size-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: INK }}><Megaphone className="size-3.5" /></span>
                          Campaign Specifics
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Campaign Name <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                            <Input placeholder="Summer Sale 2026" className={inputCls} value={formData.campaignName} onChange={(e) => setFormData({...formData, campaignName: e.target.value})} />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Live Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <Input type="date" className={`${inputCls} pr-10`} value={formData.liveDate} onChange={(e) => setFormData({...formData, liveDate: e.target.value})} />
                              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                          <span className="size-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: INK }}><List className="size-3.5" /></span>
                          Deliverables
                        </h4>

                        {selectedDeliverables.length > 0 && (
                          <div className="mb-4">
                            <span className="text-xs font-semibold text-zinc-500 mb-2 block">Selected ({selectedDeliverables.length}/5)</span>
                            <div className="flex flex-wrap gap-2">
                              <AnimatePresence>
                                {selectedDeliverables.map(deliv => (
                                  <motion.button
                                    key={deliv}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                                    onClick={() => toggleDeliverable(deliv)}
                                    className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-white shadow-sm flex items-center group cursor-pointer"
                                    style={{ backgroundColor: MONEY }}
                                  >
                                    {deliv} <X className="size-3 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                  </motion.button>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {DELIVERABLE_OPTIONS.filter(opt => opt !== "Other").map(opt => (
                            <button
                              key={opt}
                              onClick={() => toggleDeliverable(opt)}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer active:scale-95 ${selectedDeliverables.includes(opt) ? 'text-white shadow-sm' : 'bg-white text-zinc-700 border-[var(--apple-hairline)] hover:border-[var(--apple-ink)]/40'}`}
                              style={selectedDeliverables.includes(opt) ? { backgroundColor: MONEY, borderColor: MONEY } : undefined}
                            >
                              {selectedDeliverables.includes(opt) ? <Check className="size-3 inline mr-1" /> : <Plus className="size-3 inline mr-1" />}
                              {opt}
                            </button>
                          ))}
                          <button
                            onClick={() => setShowOtherDeliverableInput(!showOtherDeliverableInput)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer active:scale-95 ${showOtherDeliverableInput ? 'bg-[var(--apple-surface-alt)] text-zinc-900 border-[var(--apple-hairline)]' : 'bg-white text-zinc-700 border-[var(--apple-hairline)] hover:border-[var(--apple-ink)]/40'}`}
                          >
                            {showOtherDeliverableInput ? <X className="size-3 inline mr-1" /> : <Plus className="size-3 inline mr-1" />}
                            Other
                          </button>
                        </div>
                        <AnimatePresence>
                          {showOtherDeliverableInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Input
                                placeholder="Specify other deliverable and press Enter..."
                                className={`${inputCls} mt-1 text-sm`}
                                value={otherDeliverable}
                                onChange={(e) => setOtherDeliverable(e.target.value)}
                                onKeyDown={handleAddCustomDeliverable}
                                autoFocus
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </motion.div>
                  )}

                  {/* STEP 2: Line Items */}
                  {wizardStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 sm:p-4 rounded-xl border border-[var(--apple-hairline)] gap-3 mb-4 shadow-sm">
                        <div className="w-full sm:flex-1 sm:mr-4">
                          <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Template</label>
                          <div className="relative">
                            <select className={`${selectCls} h-10 pl-4 pr-10 w-full font-semibold`} style={{ color: INK }} value={formData.templateId} onChange={(e) => setFormData({...formData, templateId: parseInt(e.target.value)})}>
                              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 size-4 text-zinc-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="w-full sm:w-28 flex-shrink-0 flex items-center justify-between sm:block">
                          <label className="text-xs font-semibold text-zinc-600 mb-0 sm:mb-1.5 block sm:text-right">Currency</label>
                          <div className="relative flex sm:justify-end">
                            <select className="bg-[var(--apple-surface-alt)] hover:bg-[var(--apple-surface-alt)] border border-[var(--apple-hairline)] outline-none rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer appearance-none pr-8 transition-colors text-zinc-800 w-28 text-center shadow-sm" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})}>
                              <option value="INR">🇮🇳 INR</option>
                              <option value="USD">🇺🇸 USD</option>
                              <option value="EUR">🇪🇺 EUR</option>
                              <option value="AED">🇦🇪 AED</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <AnimatePresence initial={false}>
                          {lineItems.map((item, index) => (
                            <motion.div
                              key={index}
                              layout
                              initial={{ opacity: 0, y: 12, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              className="p-3 sm:p-4 rounded-xl border border-[var(--apple-hairline)] bg-white shadow-sm space-y-3 relative group"
                            >
                              {/* Item number stamp + delete */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: "#1d1d1f10", color: INK }}>
                                  ITEM {String(index + 1).padStart(2, "0")}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)} className="size-7 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 className="size-3.5" /></Button>
                              </div>

                              {/* Row 1: Type & Name side by side */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {/* Type */}
                                <div className="relative shrink-0 w-full sm:w-36">
                                  <select
                                    className="w-full h-10 pl-3 pr-8 rounded-xl border border-[var(--apple-hairline)] bg-white text-zinc-900 text-sm font-semibold outline-none appearance-none focus:border-[var(--apple-ink)] transition-all shadow-sm cursor-pointer"
                                    value={item.type}
                                    onChange={(e) => updateLineItem(index, "type", e.target.value)}
                                  >
                                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-2.5 top-3 size-4 text-zinc-500 pointer-events-none" />
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                  {item.type === "Ad Rights" ? (
                                    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border h-10 px-2 shadow-sm" style={{ backgroundColor: "#0066cc08", borderColor: "#0066cc30" }}>
                                      <div className="relative">
                                        <select
                                          className="h-7 pl-1.5 pr-5 rounded-md border-none bg-white/80 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[60px]"
                                          style={{ color: MONEY }}
                                          value={item.adRightsFrom || ""}
                                          onChange={(e) => updateLineItem(index, "adRightsFrom", e.target.value)}
                                        >
                                          <option value="" disabled>Mon</option>
                                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-1 top-2 size-3 pointer-events-none" style={{ color: "#0066cc70" }} />
                                      </div>
                                      <span className="font-bold text-xs" style={{ color: "#0066cc50" }}>–</span>
                                      <div className="relative">
                                        <select
                                          className="h-7 pl-1.5 pr-5 rounded-md border-none bg-white/80 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[60px]"
                                          style={{ color: MONEY }}
                                          value={item.adRightsTo || ""}
                                          onChange={(e) => updateLineItem(index, "adRightsTo", e.target.value)}
                                        >
                                          <option value="" disabled>Mon</option>
                                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-1 top-2 size-3 pointer-events-none" style={{ color: "#0066cc70" }} />
                                      </div>
                                      <div className="relative ml-auto">
                                        <select
                                          className="h-7 pl-1.5 pr-5 rounded-md border-none bg-white/80 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[58px]"
                                          style={{ color: MONEY }}
                                          value={item.adRightsYear || new Date().getFullYear().toString()}
                                          onChange={(e) => updateLineItem(index, "adRightsYear", e.target.value)}
                                        >
                                          {Array.from({length: 21}, (_, i) => (new Date().getFullYear() + i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-1 top-2 size-3 pointer-events-none" style={{ color: "#0066cc70" }} />
                                      </div>
                                    </div>
                                  ) : (
                                    <Input
                                      value={item.name}
                                      onChange={(e) => updateLineItem(index, "name", e.target.value)}
                                      disabled={item.type !== "Others"}
                                      placeholder="Item description..."
                                      className="h-10 w-full rounded-xl border-[var(--apple-hairline)] text-sm bg-white text-zinc-900 placeholder:text-zinc-400 disabled:bg-white disabled:text-zinc-500 shadow-sm focus-visible:ring-[var(--apple-blue)]/25"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Row 2: Qty and Price side by side, aligned to the right */}
                              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-[var(--apple-surface-alt)]">
                                {/* Quantity */}
                                <div className="flex items-center gap-1.5 bg-white rounded-full px-2 py-1 border border-[var(--apple-hairline)]">
                                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Qty</span>
                                  <div className="relative">
                                    <select className="h-7 pl-2 pr-6 rounded-full border-none bg-white text-zinc-900 text-xs outline-none appearance-none font-bold shadow-sm cursor-pointer hover:bg-[var(--apple-surface-alt)] transition-colors" value={item.quantity || 1} onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}>
                                      {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center border rounded-full px-3 h-9 bg-white w-28 sm:w-32 shadow-sm focus-within:ring-2 focus-within:ring-[var(--apple-blue)]/25 transition-all" style={{ borderColor: "#0066cc40" }}>
                                  <span className="text-sm font-bold mr-1.5" style={{ color: MONEY }}>{getCurrencySymbol(formData.currency)}</span>
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={item.price || ''}
                                    onChange={(e) => updateLineItem(index, "price", parseFloat(e.target.value) || 0)}
                                    className="h-full bg-transparent border-none px-0 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 shadow-none focus-visible:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 tabular-nums"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        <Button variant="outline" onClick={addLineItem} className="w-full border-dashed border-[var(--apple-hairline)] bg-white text-zinc-700 hover:border-[var(--apple-ink)]/40 hover:bg-white rounded-xl h-11 cursor-pointer transition-colors">
                          <Plus className="size-4 mr-2" /> Add Another Item
                        </Button>

                        {/* Running total — the money moment */}
                        <div className="flex items-center justify-between rounded-xl px-4 py-3 mt-2" style={{ backgroundColor: INK }}>
                          <span className="text-xs font-bold uppercase tracking-wider text-white/60">Invoice total</span>
                          <span className="text-lg font-bold text-white tabular-nums">
                            {getCurrencySymbol(formData.currency)}{lineItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-4 sm:p-6 border-t border-[var(--apple-hairline)] flex items-center justify-between gap-2 bg-white">
                {wizardStep === 1 ? (
                  <>
                    <Button variant="ghost" onClick={() => setIsWizardOpen(false)} className="rounded-full text-zinc-600 hover:bg-[var(--apple-surface-alt)] cursor-pointer h-11">Cancel</Button>
                    <Button onClick={() => setWizardStep(2)} disabled={!formData.brandName} className="rounded-full text-white shadow-md h-11 px-6 font-semibold hover:brightness-110 transition-all cursor-pointer" style={{ backgroundColor: INK }}>
                      Next Step <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => setWizardStep(1)} className="rounded-full text-zinc-600 hover:bg-[var(--apple-surface-alt)] cursor-pointer h-11"><ArrowLeft className="size-4 mr-2" /> Back</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleGenerate} className="rounded-full font-semibold shadow-sm h-11 cursor-pointer border-[var(--apple-hairline)] hover:bg-[var(--apple-surface-alt)] transition-colors" style={{ color: INK }}>Preview</Button>
                      <Button onClick={handleSaveInvoice} disabled={isSaving} className="rounded-full text-white shadow-md h-11 px-6 font-semibold hover:brightness-110 transition-all cursor-pointer" style={{ backgroundColor: MONEY }}>
                        {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />} Save
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ————— BRAND EDIT MODAL ————— */}
      <AnimatePresence>
        {isBrandModalOpen && editingBrand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-[var(--apple-ink)]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90dvh] overflow-y-auto border border-[var(--apple-hairline)]"
            >
              <h3 className="font-bold text-lg text-zinc-950 tracking-tight">{editingBrand.id ? 'Edit Brand' : 'Add Brand'}</h3>
              <p className="font-semibold tracking-tight text-sm text-zinc-400 mb-4">{editingBrand.id ? 'keep the rolodex current' : 'a new name for the rolodex'}</p>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Brand Name <span className="text-red-500">*</span></label>
                  <Input className={`${inputCls} h-10`} value={editingBrand.name || ""} onChange={e => setEditingBrand({...editingBrand, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Billing Address <span className="text-red-500">*</span></label>
                  <Input className={`${inputCls} h-10`} value={editingBrand.address || ""} onChange={e => setEditingBrand({...editingBrand, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 block mb-1.5">GSTIN <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                    <Input className={`${inputCls} h-10`} value={editingBrand.gstin || ""} onChange={e => setEditingBrand({...editingBrand, gstin: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 block mb-1.5">PAN <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                    <Input className={`${inputCls} h-10`} value={editingBrand.pan || ""} onChange={e => setEditingBrand({...editingBrand, pan: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Contact Number <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                    <Input className={`${inputCls} h-10`} value={editingBrand.contact || ""} onChange={e => setEditingBrand({...editingBrand, contact: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Email <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                    <Input type="email" className={`${inputCls} h-10`} value={editingBrand.email || ""} onChange={e => setEditingBrand({...editingBrand, email: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-between mt-6">
                {editingBrand.id ? (
                  <Button disabled={isDeletingBrand || isSavingBrand} variant="ghost" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="size-4 mr-2" /> Delete
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button disabled={isDeletingBrand || isSavingBrand} variant="ghost" className="rounded-full text-zinc-600 hover:bg-[var(--apple-surface-alt)] cursor-pointer" onClick={() => setIsBrandModalOpen(false)}>Cancel</Button>
                  <Button disabled={isSavingBrand || isDeletingBrand} onClick={handleBrandSave} className="rounded-full text-white cursor-pointer hover:brightness-110 transition-all font-semibold" style={{ backgroundColor: INK }}>
                    {isSavingBrand ? <Loader2 className="size-4 mr-2 animate-spin" /> : null} Save Brand
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ————— DELETE CONFIRMATION MODAL ————— */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-[var(--apple-ink)]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--apple-hairline)]"
            >
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="size-5" />
                </div>
                <h3 className="font-bold text-lg text-zinc-950">Delete Brand?</h3>
              </div>
              <p className="text-sm text-zinc-600 mb-6">Are you sure you want to permanently delete <strong>{editingBrand?.name}</strong>? This action cannot be undone and will remove it from your saved list.</p>
              <div className="flex gap-2 justify-end">
                <Button disabled={isDeletingBrand} variant="ghost" className="rounded-full text-zinc-600 hover:bg-[var(--apple-surface-alt)] cursor-pointer" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button disabled={isDeletingBrand} onClick={handleBrandDelete} className="rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  {isDeletingBrand ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />} Yes, Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ————— EDIT INVOICE DATE MODAL ————— */}
      <AnimatePresence>
        {editingInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] bg-[var(--apple-ink)]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--apple-hairline)]"
            >
              <h3 className="font-bold text-lg text-zinc-950 tracking-tight">Edit Invoice</h3>
              <p className="text-sm text-zinc-500 mb-4 font-mono">{editingInvoice.invoiceNumber} · {editingInvoice.brandName}</p>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium mb-4">
                Note: You can change only the Date. All other invoice details are locked after creation.
              </div>

              <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Invoice Creation Date</label>
              <div className="relative">
                <Input type="date" className={`${inputCls} h-10 pr-10`} value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                <Calendar className="absolute right-3 top-3 size-4 text-zinc-500 pointer-events-none" />
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button variant="ghost" className="rounded-full text-zinc-600 hover:bg-[var(--apple-surface-alt)] cursor-pointer" onClick={() => setEditingInvoice(null)}>Cancel</Button>
                <Button onClick={handleUpdateInvoiceDate} disabled={isSavingDate || !editDate} className="rounded-full text-white cursor-pointer hover:brightness-110 transition-all font-semibold" style={{ backgroundColor: INK }}>
                  {isSavingDate ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />} Save Date
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ————— PREVIEW MODAL ————— */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] backdrop-blur-sm flex flex-col p-3 sm:p-6"
            style={{ backgroundColor: "#1d1d1ff0" }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-white font-bold text-base sm:text-xl truncate">
                Preview {selectedInvoiceNumber && <span className="font-mono font-medium text-white/60 text-sm sm:text-base">· {selectedInvoiceNumber}</span>}
              </h3>
              <div className="flex gap-2 shrink-0">
                {previewInvoice && (
                  <Button onClick={() => openEditDate(previewInvoice)} variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white cursor-pointer">
                    <Edit3 className="size-4 sm:mr-2" /><span className="hidden sm:inline">Edit</span>
                  </Button>
                )}
                <Button onClick={handleDownloadPreview} disabled={isDownloading || (isPreviewLoading && !previewData)} className="rounded-full text-white cursor-pointer hover:brightness-110 transition-all font-semibold" style={{ backgroundColor: MONEY }}>
                  {isDownloading ? <Loader2 className="size-4 animate-spin sm:mr-2" /> : <FileDown className="size-4 sm:mr-2" />}<span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={closePreviewModal} className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"><X className="size-5" /></Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-2xl overflow-y-auto shadow-2xl custom-scrollbar"
              style={{ backgroundColor: PAPER }}
            >
              {previewData ? (
                // Client-side render: always fits the screen width (no PDF zoom issues on mobile)
                <div className="w-full max-w-3xl mx-auto p-2 sm:p-6">
                  <ScaledA4 className="shadow-xl rounded-md">
                    <InvoiceHtmlPreview invoiceData={previewData.invoiceData} lineItems={previewData.lineItems} creatorSettings={creatorSettings} />
                  </ScaledA4>
                </div>
              ) : isPreviewLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="size-10 animate-spin mb-4" />
                  <p className="font-semibold tracking-tight text-lg">preparing your paperwork…</p>
                </div>
              ) : previewPdfUrl ? (
                <iframe src={`${previewPdfUrl}#view=FitH`} className="w-full h-full border-0" />
              ) : (
                <div className="h-full flex items-center justify-center"><p className="text-zinc-500">Failed to load preview.</p></div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomDock />
    </div>
  );
}
