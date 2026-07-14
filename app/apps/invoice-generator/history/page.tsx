"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileDown, Search, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type Invoice = {
  id: string;
  invoiceNumber: string;
  brandName: string;
  createdAt: string;
  pdfUrl: string;
};

export default function InvoiceHistory() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
        return;
      }
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices?userId=${currentUser.uid}`);
        const data = await res.json();
        if (res.ok && data.success && data.invoices) {
          setInvoices(data.invoices);
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

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-red-600 size-8" /></div>;
  }

  const openPreview = async (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPreviewPdfUrl(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices/download?id=${inv.id}`);
      const data = await res.json();
      if(res.ok && data.pdfBase64) {
        const binaryString = window.atob(data.pdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPreviewPdfUrl(url);
      }
    } catch (e) {
      alert("Failed to load PDF preview");
      setSelectedInvoice(null);
    }
  };

  const handleDownload = () => {
    if (!previewPdfUrl || !selectedInvoice) return;
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = previewPdfUrl;
    link.download = `${selectedInvoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsDownloading(false);
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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20 md:pb-0">
      <DesktopSidebar />
      <MobileNavbar />

      <main className="md:ml-20 lg:ml-64 pt-16 md:pt-8 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pb-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/apps/invoice-generator">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-200">
                  <ArrowLeft className="size-5 text-zinc-600" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Historical Vault</h1>
                <p className="text-zinc-500 mt-1">View and download your past invoices.</p>
              </div>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <Input 
                placeholder="Search by brand or invoice #" 
                className="pl-9 bg-white border-zinc-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden">
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-200/60">
                      <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Invoice No.</th>
                      <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Brand Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date Created</th>
                      <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredInvoices.map((inv) => (
                      <tr 
                        key={inv.id} 
                        className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                        onClick={() => openPreview(inv)}
                      >
                        <td className="px-6 py-4 font-medium text-sm text-zinc-900">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600">{inv.brandName}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent row click
                              openPreview(inv);
                            }}
                            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View & Download PDF"
                          >
                            <FileDown className="size-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent row click
                              handleDelete(inv);
                            }}
                            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            ) : (
              <div className="text-center py-20">
                <FileDown className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-1">No invoices found</h3>
                <p className="text-sm text-zinc-500">
                  {searchQuery ? "Try adjusting your search terms." : "You haven't generated any invoices yet."}
                </p>
                {!searchQuery && (
                  <Link href="/apps/invoice-generator">
                    <Button variant="outline" className="mt-6">Create your first invoice</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-zinc-50/50">
              <div>
                <h3 className="font-semibold text-lg text-zinc-900">Invoice {selectedInvoice.invoiceNumber}</h3>
                <p className="text-sm text-zinc-500">{selectedInvoice.brandName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleDownload} 
                  disabled={!previewPdfUrl || isDownloading}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {isDownloading ? <Loader2 className="animate-spin size-4 mr-2" /> : <FileDown className="size-4 mr-2" />} 
                  Download PDF
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedInvoice(null);
                    setPreviewPdfUrl(null);
                  }}
                  className="hover:bg-zinc-200 text-zinc-500 rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body / PDF Preview */}
            <div className="flex-1 bg-zinc-200 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
              {previewPdfUrl ? (
                <iframe src={`${previewPdfUrl}#view=FitH`} className="w-full h-full border-0 shadow-lg bg-white rounded-md" />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <Loader2 className="size-10 animate-spin mb-4" />
                  <p>Generating preview...</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <BottomDock />
    </div>
  );
}
