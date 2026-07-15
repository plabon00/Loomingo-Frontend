"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Plus, Trash2, Settings, Loader2, FileDown, Check, X, Building, Megaphone, List, ChevronDown, Calendar, Edit3, ArrowRight, ArrowLeft, Save, FileText, Search } from "lucide-react";
import Link from "next/link";
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

// Shared control styles: explicit colors so inputs stay readable
// regardless of the system dark-mode preference (page is light-locked).
const inputCls = "h-9 sm:h-11 rounded-lg sm:rounded-xl border-zinc-300 bg-white text-zinc-900 text-base sm:text-sm placeholder:text-zinc-400 shadow-sm";
const selectCls = "w-full rounded-lg sm:rounded-xl border border-zinc-300 bg-white text-zinc-900 text-base sm:text-sm outline-none focus:border-indigo-500 appearance-none shadow-sm h-9 sm:h-11";

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
        alert("Could not prepare the PDF. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error preparing the PDF.");
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
        alert("You can select a maximum of 5 deliverables.");
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
            alert("You can select a maximum of 5 deliverables.");
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

  if (isLoading || !user) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-indigo-600 size-8" /></div>;
  }

  return (
    <div className="flex min-h-[100dvh] bg-zinc-100 font-sans text-zinc-900">
      <Toaster position="top-center" richColors />
      <DesktopSidebar />
      <MobileNavbar />

      <main className="flex-1 md:ml-20 lg:ml-64 pt-16 md:pt-0 pb-24 md:pb-8 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Invoice Dashboard</h1>
              <p className="text-zinc-600 mt-1 text-sm md:text-base">Manage brands, track history, and generate invoices.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apps/invoice-generator/creator-details">
                <Button variant="outline" className="rounded-full border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 shadow-sm"><Settings className="size-4 mr-2" /> Creator Details</Button>
              </Link>
              <Button onClick={() => openNewInvoiceWizard()} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"><Plus className="size-4 mr-2" /> New Invoice</Button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="flex sm:hidden p-1 bg-white border border-zinc-200 rounded-full shadow-sm mt-2">
            <button onClick={() => setActiveMobileTab("history")} className={`flex-1 py-2 text-xs font-semibold rounded-full transition-colors ${activeMobileTab === "history" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"}`}>History</button>
            <button onClick={() => setActiveMobileTab("brands")} className={`flex-1 py-2 text-xs font-semibold rounded-full transition-colors ${activeMobileTab === "brands" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"}`}>Brands</button>
            <button onClick={() => setActiveMobileTab("templates")} className={`flex-1 py-2 text-xs font-semibold rounded-full transition-colors ${activeMobileTab === "templates" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"}`}>Templates</button>
          </div>

          {/* History Section */}
          <section className={`bg-white border border-zinc-200 rounded-3xl p-4 md:p-6 shadow-sm ${activeMobileTab === "history" ? "block" : "hidden sm:block"}`}>
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">Recent History</h2>
              <div className="flex items-center gap-3">
                <Link href="/apps/invoice-generator/history"><span className="text-sm font-medium text-indigo-600 hover:underline whitespace-nowrap">View All</span></Link>
                <Button onClick={() => openNewInvoiceWizard()} size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm hidden sm:flex">
                  <Plus className="size-4 mr-1" /> Create New
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-4 sm:pb-2 sm:snap-x sm:snap-mandatory sm:scrollbar-hide">
              {/* Create New Invoice card at the front */}
              <button
                onClick={() => openNewInvoiceWizard()}
                className="w-full sm:w-48 sm:snap-start shrink-0 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center gap-2 min-h-[180px] sm:min-h-[220px]"
              >
                <span className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30"><Plus className="size-5" /></span>
                <span className="text-sm font-semibold text-indigo-700">Create New Invoice</span>
              </button>

              {invoices.length === 0 ? (
                <div className="flex flex-col justify-center text-sm text-zinc-500 px-4">No invoices yet. Create one to see history here.</div>
              ) : (
                invoices.slice(0, 10).map((inv, i) => {
                  const thumb = buildInvoicePreviewData(inv);
                  return (
                    <div key={inv.id || i} className="w-full sm:w-48 sm:snap-start shrink-0 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 transition-all overflow-hidden group">
                      {/* Exact invoice preview (top of the document) */}
                      <div onClick={() => openPreviewFromHistory(inv)} className="relative h-28 sm:h-36 overflow-hidden cursor-pointer bg-zinc-50 border-b border-zinc-200">
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
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-zinc-100 rounded text-zinc-700 truncate">{inv.invoiceNumber}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditDate(inv); }}
                            title="Edit invoice date"
                            className="shrink-0 p-1.5 rounded-full bg-zinc-100 text-zinc-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          >
                            <Edit3 className="size-3" />
                          </button>
                        </div>
                        <h3 onClick={() => openPreviewFromHistory(inv)} className="font-bold text-sm text-zinc-900 truncate cursor-pointer">{inv.brandName}</h3>
                        <p className="text-[11px] text-zinc-500 truncate">{inv.campaignName || 'No Campaign Name'}</p>
                        <p className="text-[10px] text-zinc-500 mt-1.5 font-medium">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Saved Brands Section */}
          <section className={`bg-white border border-zinc-200 rounded-3xl p-4 md:p-6 shadow-sm ${activeMobileTab === "brands" ? "block" : "hidden sm:block"}`}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Saved Brands</h2>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-4 sm:pb-2 sm:snap-x sm:snap-mandatory sm:scrollbar-hide">
              <div
                onClick={() => { setEditingBrand({ name: "", address: "", gstin: "", pan: "", contact: "", email: "" }); setIsBrandModalOpen(true); }}
                className="w-full sm:w-64 sm:snap-start shrink-0 p-3 sm:p-4 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 hover:border-zinc-400 transition-colors h-[120px]"
              >
                <Plus className="size-6 text-zinc-500 mb-2" />
                <span className="text-sm font-medium text-zinc-700">Add New Brand</span>
              </div>
              {brands.map((b, i) => (
                <div key={b.id || i} className="w-full sm:w-64 sm:snap-start shrink-0 p-3 sm:p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col justify-between h-[120px] relative">
                  <div>
                    <h3 className="font-bold text-zinc-900 truncate pr-8">{b.name}</h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{b.address || 'No Address'}</p>
                    {(b.gstin || b.pan) && <p className="text-[10px] text-zinc-500 mt-2 font-medium">Tax ID attached</p>}
                  </div>
                  <button onClick={() => { setEditingBrand(b); setIsBrandModalOpen(true); }} className="absolute top-3 right-3 bg-zinc-100 p-2 rounded-full hover:bg-zinc-200 transition-colors" title="Edit brand">
                    <Edit3 className="size-3.5 text-zinc-600" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Templates Section: exact live previews */}
          <section className={`bg-white border border-zinc-200 rounded-3xl p-4 md:p-6 shadow-sm ${activeMobileTab === "templates" ? "block" : "hidden sm:block"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Templates</h2>
              <p className="text-xs text-zinc-500 hidden sm:block">Tap a template to start an invoice with it</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 pb-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => openNewInvoiceWizard(t.id)}
                  className="w-full text-left rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="border-b border-zinc-100">
                    <TemplateThumbnail templateId={t.id} />
                  </div>
                  <div className="px-3 py-2 flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-zinc-800 truncate">{t.name}</span>
                    <ArrowRight className="size-3.5 text-zinc-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* NEW INVOICE WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full h-auto max-h-[90dvh] sm:max-h-[90vh] max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-xl text-zinc-900">Create Invoice</h3>
                <p className="text-sm text-zinc-500 font-medium">Step {wizardStep} of 2</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsWizardOpen(false)} className="rounded-full text-zinc-600 hover:bg-zinc-100"><X className="size-5" /></Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-zinc-50/50">

              {/* STEP 1: Campaign Details */}
              {wizardStep === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2"><Building className="size-4 text-indigo-500" /> Client Information</h4>
                      {isBrandSearchOpen ? (
                        <div className="flex items-center gap-2 relative w-32 sm:w-48 animate-in fade-in slide-in-from-right-4 duration-300">
                          <Input 
                            autoFocus
                            placeholder="Search..." 
                            className="h-8 text-xs pr-8"
                            value={brandSearchQuery}
                            onChange={(e) => setBrandSearchQuery(e.target.value)}
                          />
                          <button onClick={() => { setIsBrandSearchOpen(false); setBrandSearchQuery(""); }} className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setIsBrandSearchOpen(true)} className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
                          <Search className="size-4" />
                        </button>
                      )}
                    </div>
                    
                    {brands.length === 0 ? (
                      <div className="p-4 border border-dashed border-zinc-300 rounded-xl text-center text-sm text-zinc-500">
                        No saved brands found. You can add them from the Dashboard.
                      </div>
                    ) : (
                      <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
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
                                className={`snap-start shrink-0 w-40 sm:w-48 text-left p-3 rounded-xl border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-zinc-200 hover:border-indigo-300 hover:bg-zinc-50 shadow-sm'}`}
                              >
                                <h5 className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-900' : 'text-zinc-900'}`}>{b.name}</h5>
                                <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-indigo-700/80' : 'text-zinc-500'}`}>{b.address || 'No Address'}</p>
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
                    <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2"><Megaphone className="size-4 text-purple-500" /> Campaign Specifics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Campaign Name <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                        <Input placeholder="Summer Sale 2026" className={inputCls} value={formData.campaignName} onChange={(e) => setFormData({...formData, campaignName: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Live Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Input type="date" className={`${inputCls} pr-10`} value={formData.liveDate} onChange={(e) => setFormData({...formData, liveDate: e.target.value})} />
                          <Calendar className="absolute right-3 top-3.5 size-4 text-zinc-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2"><List className="size-4 text-orange-500" /> Deliverables</h4>
                    
                    {selectedDeliverables.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-zinc-500 mb-2 block">Selected ({selectedDeliverables.length}/5)</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedDeliverables.map(deliv => (
                            <button key={deliv} onClick={() => toggleDeliverable(deliv)} className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-600 text-white border border-indigo-600 shadow-sm flex items-center group">
                              {deliv} <X className="size-3 ml-1 text-indigo-200 group-hover:text-white transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {DELIVERABLE_OPTIONS.filter(opt => opt !== "Other").map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleDeliverable(opt)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${selectedDeliverables.includes(opt) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}
                        >
                          {selectedDeliverables.includes(opt) ? <Check className="size-3 inline mr-1" /> : <Plus className="size-3 inline mr-1" />}
                          {opt}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowOtherDeliverableInput(!showOtherDeliverableInput)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${showOtherDeliverableInput ? 'bg-zinc-100 text-zinc-900 border-zinc-300' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}
                      >
                        {showOtherDeliverableInput ? <X className="size-3 inline mr-1" /> : <Plus className="size-3 inline mr-1" />}
                        Other
                      </button>
                    </div>
                    {showOtherDeliverableInput && (
                      <Input 
                        placeholder="Specify other deliverable and press Enter..." 
                        className={`${inputCls} mt-2 text-sm`} 
                        value={otherDeliverable} 
                        onChange={(e) => setOtherDeliverable(e.target.value)}
                        onKeyDown={handleAddCustomDeliverable}
                        autoFocus
                      />
                    )}
                  </div>

                </div>
              )}

              {/* STEP 2: Line Items */}
              {wizardStep === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-50/50 p-3 sm:p-4 rounded-xl border border-zinc-100 gap-3 mb-4">
                    <div className="w-full sm:flex-1 sm:mr-4">
                      <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Template</label>
                      <div className="relative">
                        <select className={`${selectCls} h-10 pl-4 pr-10 w-full bg-white border-zinc-200 font-medium text-indigo-900 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/20`} value={formData.templateId} onChange={(e) => setFormData({...formData, templateId: parseInt(e.target.value)})}>
                          {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 size-4 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="w-full sm:w-28 flex-shrink-0 flex items-center justify-between sm:block">
                      <label className="text-xs font-semibold text-zinc-600 mb-0 sm:mb-1.5 block sm:text-right">Currency</label>
                      <div className="relative flex sm:justify-end">
                        <select className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 outline-none rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer appearance-none pr-8 transition-colors text-zinc-800 w-28 text-center shadow-sm" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})}>
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
                    {lineItems.map((item, index) => (
                      <div key={index} className="p-3 sm:p-4 pt-10 rounded-xl border border-zinc-200 bg-white shadow-sm space-y-3 relative group">
                        {/* Delete Button on top right */}
                        <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)} className="absolute top-2 right-2 size-7 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 opacity-80 hover:opacity-100 transition-opacity bg-red-50/50"><Trash2 className="size-3.5" /></Button>

                        {/* Row 1: Type & Name side by side */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {/* Type */}
                          <div className="relative shrink-0 w-full sm:w-36">
                            <select
                              className="w-full h-9 pl-3 pr-8 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 text-sm font-semibold outline-none appearance-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                              value={item.type}
                              onChange={(e) => updateLineItem(index, "type", e.target.value)}
                            >
                              {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-zinc-500 pointer-events-none" />
                          </div>
                          
                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            {item.type === "Ad Rights" ? (
                              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-indigo-50/60 border border-indigo-100 h-9 px-2 shadow-sm">
                                <div className="relative">
                                  <select 
                                    className="h-6 pl-1.5 pr-5 rounded-md border-none bg-white/60 text-indigo-900 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[60px]" 
                                    value={item.adRightsFrom || ""} 
                                    onChange={(e) => updateLineItem(index, "adRightsFrom", e.target.value)}
                                  >
                                    <option value="" disabled>Mon</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-1 top-1.5 size-3 text-indigo-400 pointer-events-none" />
                                </div>
                                <span className="text-indigo-300 font-bold text-xs">-</span>
                                <div className="relative">
                                  <select 
                                    className="h-6 pl-1.5 pr-5 rounded-md border-none bg-white/60 text-indigo-900 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[60px]" 
                                    value={item.adRightsTo || ""} 
                                    onChange={(e) => updateLineItem(index, "adRightsTo", e.target.value)}
                                  >
                                    <option value="" disabled>Mon</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-1 top-1.5 size-3 text-indigo-400 pointer-events-none" />
                                </div>
                                <div className="relative ml-auto">
                                  <select 
                                    className="h-6 pl-1.5 pr-5 rounded-md border-none bg-white/60 text-indigo-900 text-xs font-semibold outline-none appearance-none cursor-pointer hover:bg-white transition-colors text-center w-[55px]" 
                                    value={item.adRightsYear || new Date().getFullYear().toString()} 
                                    onChange={(e) => updateLineItem(index, "adRightsYear", e.target.value)}
                                  >
                                    {Array.from({length: 21}, (_, i) => (new Date().getFullYear() + i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-1 top-1.5 size-3 text-indigo-400 pointer-events-none" />
                                </div>
                              </div>
                            ) : (
                              <Input
                                value={item.name}
                                onChange={(e) => updateLineItem(index, "name", e.target.value)}
                                disabled={item.type !== "Others"}
                                placeholder="Item description..."
                                className="h-9 w-full rounded-xl border-zinc-300 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 disabled:bg-zinc-100 disabled:text-zinc-500 shadow-sm focus-visible:ring-indigo-500"
                              />
                            )}
                          </div>
                        </div>

                        {/* Row 2: Qty and Price side by side, aligned to the right */}
                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-zinc-50/80">
                          {/* Quantity */}
                          <div className="flex items-center gap-1.5 bg-zinc-50 rounded-full px-2 py-1 border border-zinc-200">
                            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Qty</span>
                            <div className="relative">
                              <select className="h-7 pl-2 pr-6 rounded-full border-none bg-white text-zinc-900 text-xs outline-none appearance-none font-bold shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors" value={item.quantity || 1} onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}>
                                {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center border border-zinc-300 rounded-full px-3 h-9 bg-white w-28 sm:w-32 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                            <span className="text-zinc-500 text-sm font-bold mr-1.5">{getCurrencySymbol(formData.currency)}</span>
                            <Input
                              type="number"
                              inputMode="decimal"
                              placeholder="0.00"
                              value={item.price || ''}
                              onChange={(e) => updateLineItem(index, "price", parseFloat(e.target.value) || 0)}
                              className="h-full bg-transparent border-none px-0 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 shadow-none focus-visible:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                                        <Button variant="outline" onClick={addLineItem} className="w-full border-dashed border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 rounded-xl h-10"><Plus className="size-4 mr-2" /> Add Another Item</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-6 border-t border-zinc-100 flex items-center justify-between gap-2 bg-white">
              {wizardStep === 1 ? (
                <>
                  <Button variant="ghost" onClick={() => setIsWizardOpen(false)} className="rounded-full text-zinc-600 hover:bg-zinc-100">Cancel</Button>
                  <Button onClick={() => setWizardStep(2)} disabled={!formData.brandName} className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">Next Step <ArrowRight className="size-4 ml-2" /></Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setWizardStep(1)} className="rounded-full text-zinc-600 hover:bg-zinc-100"><ArrowLeft className="size-4 mr-2" /> Back</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleGenerate} className="rounded-full border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold shadow-sm">Preview</Button>
                    <Button onClick={handleSaveInvoice} disabled={isSaving} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">{isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />} Save</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BRAND EDIT MODAL */}
      {isBrandModalOpen && editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
            <h3 className="font-bold text-lg text-zinc-900 mb-3 sm:mb-4">{editingBrand.id ? 'Edit Brand' : 'Add Brand'}</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">Brand Name <span className="text-red-500">*</span></label>
                <Input className={`${inputCls} h-10`} value={editingBrand.name || ""} onChange={e => setEditingBrand({...editingBrand, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1">Billing Address <span className="text-red-500">*</span></label>
                <Input className={`${inputCls} h-10`} value={editingBrand.address || ""} onChange={e => setEditingBrand({...editingBrand, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">GSTIN <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                  <Input className={`${inputCls} h-10`} value={editingBrand.gstin || ""} onChange={e => setEditingBrand({...editingBrand, gstin: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">PAN <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                  <Input className={`${inputCls} h-10`} value={editingBrand.pan || ""} onChange={e => setEditingBrand({...editingBrand, pan: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Contact Number <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                  <Input className={`${inputCls} h-10`} value={editingBrand.contact || ""} onChange={e => setEditingBrand({...editingBrand, contact: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Email <span className="text-zinc-400 font-normal ml-1">(Optional)</span></label>
                  <Input type="email" className={`${inputCls} h-10`} value={editingBrand.email || ""} onChange={e => setEditingBrand({...editingBrand, email: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-between mt-6">
              {editingBrand.id ? (
                <Button disabled={isDeletingBrand || isSavingBrand} variant="ghost" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="size-4 mr-2" /> Delete
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button disabled={isDeletingBrand || isSavingBrand} variant="ghost" className="rounded-full text-zinc-600 hover:bg-zinc-100" onClick={() => setIsBrandModalOpen(false)}>Cancel</Button>
                <Button disabled={isSavingBrand || isDeletingBrand} onClick={handleBrandSave} className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white">
                  {isSavingBrand ? <Loader2 className="size-4 mr-2 animate-spin" /> : null} Save Brand
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="size-5" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Delete Brand?</h3>
            </div>
            <p className="text-sm text-zinc-600 mb-6">Are you sure you want to permanently delete <strong>{editingBrand?.name}</strong>? This action cannot be undone and will remove it from your saved list.</p>
            <div className="flex gap-2 justify-end">
              <Button disabled={isDeletingBrand} variant="ghost" className="rounded-full text-zinc-600 hover:bg-zinc-100" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button disabled={isDeletingBrand} onClick={handleBrandDelete} className="rounded-full bg-red-600 hover:bg-red-700 text-white">
                {isDeletingBrand ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />} Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INVOICE DATE MODAL */}
      {editingInvoice && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-lg text-zinc-900">Edit Invoice</h3>
            <p className="text-sm text-zinc-500 mb-4">{editingInvoice.invoiceNumber} · {editingInvoice.brandName}</p>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium mb-4">
              Note: You can change only the Date. All other invoice details are locked after creation.
            </div>

            <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Invoice Creation Date</label>
            <div className="relative">
              <Input type="date" className={`${inputCls} h-10 pr-10`} value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              <Calendar className="absolute right-3 top-3 size-4 text-zinc-500 pointer-events-none" />
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <Button variant="ghost" className="rounded-full text-zinc-600 hover:bg-zinc-100" onClick={() => setEditingInvoice(null)}>Cancel</Button>
              <Button onClick={handleUpdateInvoiceDate} disabled={isSavingDate || !editDate} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSavingDate ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />} Save Date
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-900/90 backdrop-blur-sm flex flex-col p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-white font-bold text-base sm:text-xl truncate">Preview {selectedInvoiceNumber && `· ${selectedInvoiceNumber}`}</h3>
            <div className="flex gap-2 shrink-0">
              {previewInvoice && (
                <Button onClick={() => openEditDate(previewInvoice)} variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                  <Edit3 className="size-4 sm:mr-2" /><span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              <Button onClick={handleDownloadPreview} disabled={isDownloading || (isPreviewLoading && !previewData)} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                {isDownloading ? <Loader2 className="size-4 animate-spin sm:mr-2" /> : <FileDown className="size-4 sm:mr-2" />}<span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={closePreviewModal} className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"><X className="size-5" /></Button>
            </div>
          </div>
          <div className="flex-1 bg-zinc-200 rounded-2xl overflow-y-auto shadow-2xl custom-scrollbar">
            {previewData ? (
              // Client-side render: always fits the screen width (no PDF zoom issues on mobile)
              <div className="w-full max-w-3xl mx-auto p-2 sm:p-6">
                <ScaledA4 className="shadow-xl rounded-md">
                  <InvoiceHtmlPreview invoiceData={previewData.invoiceData} lineItems={previewData.lineItems} creatorSettings={creatorSettings} />
                </ScaledA4>
              </div>
            ) : isPreviewLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500"><Loader2 className="size-10 animate-spin mb-4" /><p>Loading preview...</p></div>
            ) : previewPdfUrl ? (
              <iframe src={`${previewPdfUrl}#view=FitH`} className="w-full h-full border-0" />
            ) : (
              <div className="h-full flex items-center justify-center"><p className="text-zinc-500">Failed to load preview.</p></div>
            )}
          </div>
        </div>
      )}

      <BottomDock />
    </div>
  );
}
