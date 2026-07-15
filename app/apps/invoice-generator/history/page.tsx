"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileDown, Search, X, Trash2, Edit3, Calendar, Save, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { InvoiceHtmlPreview } from "@/components/invoice/InvoiceHtmlPreview";
import { ScaledA4, buildInvoicePreviewData } from "@/components/invoice/ScaledInvoicePreview";

type Invoice = {
  id: string;
  invoiceNumber: string;
  brandName: string;
  createdAt: string;
  pdfUrl: string;
  [key: string]: any;
};

export default function InvoiceHistory() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorSettings, setCreatorSettings] = useState<any>(null);

  // Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewData, setPreviewData] = useState<{ invoiceData: any; lineItems: any[] } | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Edit Date state
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editDate, setEditDate] = useState("");
  const [isSavingDate, setIsSavingDate] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
        return;
      }

      try {
        const [invRes, settingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices?userId=${currentUser.uid}`),
          fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/creator/settings?userId=${currentUser.uid}`)
        ]);
        const data = await invRes.json();
        if (invRes.ok && data.success && data.invoices) {
          setInvoices(data.invoices);
        }
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setCreatorSettings(s.settings || s.data);
        }
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const filteredInvoices = invoices.filter(inv =>
    inv.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const openPreview = async (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPreviewPdfUrl(null);

    // Prefer the client-side HTML render: scales to fit any screen (mobile-safe).
    const data = buildInvoicePreviewData(inv);
    if (data) {
      setPreviewData(data);
      setIsPreviewLoading(false);
      return;
    }

    setPreviewData(null);
    setIsPreviewLoading(true);
    try {
      const url = await fetchPdfBlobUrl(inv.id);
      if (url) setPreviewPdfUrl(url);
    } catch (e) {
      alert("Failed to load PDF preview");
      setSelectedInvoice(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setSelectedInvoice(null);
    setPreviewData(null);
    if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
    setPreviewPdfUrl(null);
  };

  const handleDownload = async () => {
    if (!selectedInvoice) return;
    setIsDownloading(true);
    try {
      let url = previewPdfUrl;
      if (!url) {
        url = await fetchPdfBlobUrl(selectedInvoice.id);
        if (url) setPreviewPdfUrl(url);
      }
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedInvoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Could not prepare the PDF. Please try again.");
      }
    } catch {
      alert("Network error downloading the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (inv: Invoice) => {
    if (!user || !confirm(`Delete invoice ${inv.invoiceNumber}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices?id=${inv.id}&userId=${user.uid}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices(prev => prev.filter(i => i.id !== inv.id));
      } else {
        alert("Failed to delete invoice.");
      }
    } catch {
      alert("Network error deleting invoice.");
    }
  };

  const openEditDate = (inv: Invoice) => {
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
        const newDate = new Date(editDate).toISOString();
        setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? { ...i, createdAt: newDate } : i));
        if (selectedInvoice?.id === editingInvoice.id) {
          setSelectedInvoice(prev => prev ? { ...prev, createdAt: newDate } : prev);
        }
        setEditingInvoice(null);
      } else {
        alert("Failed to update the invoice date.");
      }
    } catch {
      alert("Network error updating the invoice date.");
    } finally {
      setIsSavingDate(false);
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-indigo-600 size-8" /></div>;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-100 text-zinc-900 pb-24 md:pb-0">
      <DesktopSidebar />
      <MobileNavbar />

      <main className="md:ml-20 lg:ml-64 pt-16 md:pt-8 min-h-[100dvh]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pb-12">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Link href="/apps/invoice-generator">
                <Button variant="ghost" size="icon" className="rounded-full text-zinc-600 hover:bg-zinc-200">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Invoice History</h1>
                <p className="text-zinc-600 mt-1 text-sm md:text-base">View, edit dates, and download your past invoices.</p>
              </div>
            </div>

            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                <Input
                  placeholder="Search by brand or invoice #"
                  className="pl-9 bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/apps/invoice-generator" className="shrink-0">
                <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                  <Plus className="size-4 sm:mr-2" /><span className="hidden sm:inline">New Invoice</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            {filteredInvoices.length > 0 ? (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="px-6 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Invoice No.</th>
                        <th className="px-6 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Brand Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Date Created</th>
                        <th className="px-6 py-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-zinc-50 transition-colors cursor-pointer"
                          onClick={() => openPreview(inv)}
                        >
                          <td className="px-6 py-4 font-medium text-sm text-zinc-900">{inv.invoiceNumber}</td>
                          <td className="px-6 py-4 text-sm text-zinc-700">{inv.brandName}</td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditDate(inv); }}
                              className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit invoice date"
                            >
                              <Edit3 className="size-4.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openPreview(inv); }}
                              className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View & Download PDF"
                            >
                              <FileDown className="size-5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(inv); }}
                              className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Invoice"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="md:hidden divide-y divide-zinc-100">
                  {filteredInvoices.map((inv) => (
                    <div key={inv.id} onClick={() => openPreview(inv)} className="p-4 flex items-center justify-between gap-3 active:bg-zinc-50">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-zinc-900 truncate">{inv.brandName}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{inv.invoiceNumber} · {new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditDate(inv); }}
                          className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit invoice date"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openPreview(inv); }}
                          className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View & Download PDF"
                        >
                          <FileDown className="size-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(inv); }}
                          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 px-4">
                <FileDown className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-1">No invoices found</h3>
                <p className="text-sm text-zinc-600">
                  {searchQuery ? "Try adjusting your search terms." : "You haven't generated any invoices yet."}
                </p>
                {!searchQuery && (
                  <Link href="/apps/invoice-generator">
                    <Button className="mt-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">Create your first invoice</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white w-full max-w-4xl h-[95dvh] sm:h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-200 bg-zinc-50 gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-zinc-900 truncate">Invoice {selectedInvoice.invoiceNumber}</h3>
                <p className="text-xs sm:text-sm text-zinc-600 truncate">{selectedInvoice.brandName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => openEditDate(selectedInvoice)}
                  className="border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                >
                  <Edit3 className="size-4 sm:mr-2" /><span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || (isPreviewLoading && !previewData)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {isDownloading ? <Loader2 className="animate-spin size-4 sm:mr-2" /> : <FileDown className="size-4 sm:mr-2" />}
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePreview}
                  className="hover:bg-zinc-200 text-zinc-600 rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body: preview always fits the screen */}
            <div className="flex-1 bg-zinc-200 overflow-y-auto custom-scrollbar">
              {previewData ? (
                <div className="w-full max-w-3xl mx-auto p-2 sm:p-8">
                  <ScaledA4 className="shadow-lg rounded-md">
                    <InvoiceHtmlPreview invoiceData={previewData.invoiceData} lineItems={previewData.lineItems} creatorSettings={creatorSettings} />
                  </ScaledA4>
                </div>
              ) : previewPdfUrl ? (
                <iframe src={`${previewPdfUrl}#view=FitH`} className="w-full h-full border-0 bg-white" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="size-10 animate-spin mb-4" />
                  <p>Generating preview...</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Edit Date Modal */}
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
              <Input type="date" className="h-10 rounded-xl border-zinc-300 bg-white text-zinc-900 pr-10" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
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

      <BottomDock />
    </div>
  );
}
