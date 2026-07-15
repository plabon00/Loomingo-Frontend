"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Settings, History, Loader2, FileDown, Check, X, LayoutTemplate, Building, Megaphone, List, Save, Eye, RefreshCw, ChevronDown } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  { id: 1, name: "Modern Teal (Default)" },
  { id: 2, name: "Retro Beige" },
  { id: 3, name: "Teal Ribbon" },
  { id: 4, name: "Blue Wave" },
  { id: 5, name: "Minimal Gold" },
  { id: 6, name: "Dark Professional" },
];

const DELIVERABLE_OPTIONS = ["Instagram Reel", "Instagram Story", "YouTube Video", "YouTube Short", "Static Post", "Carousel Post", "Other"];
const ITEM_TYPES = ["Product", "Reels", "Story", "Reel + Story"];

export default function InvoiceGenerator() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Preview State
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [creatorSettings, setCreatorSettings] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    templateId: 1,
    brandName: "",
    billingAddress: "",
    gstin: "",
    pan: "",
    contact: "",
    igUserName: "",
    liveDate: "",
    currency: "INR",
    campaignName: "",
  });

  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState([
    { no: 1, type: "Reels", name: "Instagram Reel", quantity: 1, price: 0 }
  ]);

  // Brand Management
  const [brands, setBrands] = useState<any[]>([]);
  const [isNewBrand, setIsNewBrand] = useState(true);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchInstagramUsername(currentUser);
        await fetchBrands(currentUser.uid);
        await fetchCreatorSettings(currentUser.uid);
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Initial render when template changes or loaded for first time
  useEffect(() => {
    if (user && !isLoading) {
      handleGenerate('preview');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.templateId, user]);

  const fetchCreatorSettings = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/creator/settings?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCreatorSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to fetch creator settings", err);
    }
  };

  const fetchInstagramUsername = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const activeIgId = localStorage.getItem("activeInstagramId");
      if (!activeIgId) return;

      const response = await fetch(`/api/v1/me/instagram/portfolio`, {
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "true" }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.username) {
          setFormData(prev => ({ ...prev, igUserName: data.username }));
        }
      }
    } catch (err) {
      console.error("Failed to auto-fetch IG username");
    }
  };

  const fetchBrands = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  const handleBrandSelect = (brandId: string) => {
    if (brandId === "new") {
      setIsNewBrand(true);
      setSelectedBrandId("");
      setFormData(prev => ({ ...prev, brandName: "", billingAddress: "", gstin: "", pan: "", contact: "" }));
    } else {
      setIsNewBrand(false);
      setSelectedBrandId(brandId);
      const brand = brands.find(b => b.id === brandId);
      if (brand) {
        setFormData(prev => ({
          ...prev,
          brandName: brand.name,
          billingAddress: brand.address || "",
          gstin: brand.gstin || "",
          pan: brand.pan || "",
          contact: brand.contact || ""
        }));
      }
    }
  };

  const saveNewBrand = async () => {
    if (!user || !formData.brandName) return;
    
    // Check if brand already exists
    const exists = brands.some(b => b.name.toLowerCase() === formData.brandName.trim().toLowerCase());
    if (exists) {
      alert("A brand with this name already exists.");
      return;
    }

    setIsSavingBrand(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: formData.brandName,
          address: formData.billingAddress,
          gstin: formData.gstin,
          pan: formData.pan,
          contact: ""
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.brand) {
          setBrands(prev => [data.brand, ...prev]);
          setIsNewBrand(false);
          setSelectedBrandId(data.brand.id);
        }
      } else {
        alert("Failed to save brand.");
      }
    } catch (err) {
      console.error("Failed to save brand", err);
      alert("Network error while saving brand.");
    } finally {
      setIsSavingBrand(false);
    }
  };

  const toggleDeliverable = (deliv: string) => {
    setSelectedDeliverables(prev => 
      prev.includes(deliv) ? prev.filter(d => d !== deliv) : [...prev, deliv]
    );
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { no: lineItems.length + 1, type: "Product", name: "", quantity: 1, price: 0 }]);
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill name if type changes
    if (field === "type") {
      if (value === "Reels") newItems[index].name = "Instagram Reel";
      else if (value === "Story") newItems[index].name = "Instagram Story";
      else if (value === "Reel + Story") newItems[index].name = "Instagram Reel + Story";
      else newItems[index].name = "";
    }
    
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    const newItems = lineItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, no: i + 1 }));
    setLineItems(newItems);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [savedInvoiceNumber, setSavedInvoiceNumber] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ templateId: 1, brandName: "", billingAddress: "", gstin: "", pan: "", contact: "", igUserName: "", liveDate: "", currency: "INR", campaignName: "" });
    setSelectedDeliverables([]);
    setLineItems([{ no: 1, type: "Reels", name: "Instagram Reel", quantity: 1, price: 0 }]);
    setIsNewBrand(true);
    setSelectedBrandId("");
    setPreviewPdfUrl(null);
  };

  const handleGenerate = async (mode: 'preview' | 'save' | 'saveAndDownload' = 'save') => {
    if (!user) return;
    if (mode !== 'preview' && (isSaving || isGenerating)) return; // guard against double-submit
    
    if (mode === 'preview') {
      setIsPreviewLoading(true);
    } else if (mode === 'saveAndDownload') {
      setIsGenerating(true);
    } else {
      setIsSaving(true);
    }

    try {
      // If saving and it's a new brand, save it first
      if (mode !== 'preview' && isNewBrand && formData.brandName) {
        await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/brands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            name: formData.brandName,
            address: formData.billingAddress,
            gstin: formData.gstin,
            pan: formData.pan,
            contact: formData.contact
          })
        });
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/invoices/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          preview: mode === 'preview',
          invoiceData: { 
            ...formData, 
            deliverables: selectedDeliverables.join(", "),
            lineItems 
          }
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        let finalUrl = null;
        if (data.pdfBase64) {
          const binaryString = window.atob(data.pdfBase64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          finalUrl = URL.createObjectURL(blob);
        } else if (data.pdfUrl) {
          finalUrl = data.pdfUrl;
        }

        if (mode === 'preview') {
          setPreviewPdfUrl(finalUrl);
        } else if (mode === 'saveAndDownload') {
          // Trigger download directly for final generation
          if (finalUrl) {
            const a = document.createElement("a");
            a.href = finalUrl;
            a.download = `Invoice_${formData.brandName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
            a.click();
          }
          setSavedInvoiceNumber(data.invoiceNumber || "");
          resetForm();
        } else {
          // Just save
          setSavedInvoiceNumber(data.invoiceNumber || "");
          resetForm();
        }
      } else {
        if (mode !== 'preview') alert(data.error || "Failed to generate invoice");
      }
    } catch (err) {
      console.error(err);
      if (mode !== 'preview') alert("Network error generating invoice.");
    } finally {
      if (mode === 'preview') setIsPreviewLoading(false);
      else if (mode === 'saveAndDownload') setIsGenerating(false);
      else setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-red-600 size-8" /></div>;
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <DesktopSidebar />
      <MobileNavbar />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden md:ml-20 lg:ml-64 pt-16 md:pt-0">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-black">Create Invoice</h1>
                <p className="text-zinc-500 mt-1">Fill details to generate your professional invoice.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/apps/invoice-generator/history">
                  <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"><History className="size-4" /> History</Button>
                </Link>
                <Link href="/apps/invoice-generator/creator-details">
                  <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm"><Settings className="size-4" /> Creator Details</Button>
                </Link>
              </div>
            </div>

            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <LayoutTemplate className="size-5 text-indigo-500" /> Settings
                </CardTitle>
                <CardDescription>Choose layout and currency.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Template</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                    value={formData.templateId}
                    onChange={(e) => setFormData({...formData, templateId: parseInt(e.target.value)})}
                  >
                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Currency</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                    <Building className="size-5 text-green-500" /> Brand / Client Details
                  </CardTitle>
                  <CardDescription className="mt-1.5">Who are you billing this to?</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isNewBrand && (
                    <Button 
                      onClick={saveNewBrand} 
                      disabled={isSavingBrand || !formData.brandName}
                      className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-3 shadow-sm"
                    >
                      {isSavingBrand ? <Loader2 className="animate-spin size-3 mr-1" /> : <Check className="size-3 mr-1" />}
                      Save Brand
                    </Button>
                  )}
                  <select 
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 outline-none shadow-sm"
                    value={isNewBrand ? "new" : selectedBrandId}
                    onChange={(e) => handleBrandSelect(e.target.value)}
                  >
                    <option value="new">+ Add New Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Brand Name</label>
                  <Input placeholder="Acme Corp" className="text-zinc-900" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} disabled={!isNewBrand && selectedBrandId !== ""} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Billing Address</label>
                  <Input placeholder="123 Business St, City" className="text-zinc-900" value={formData.billingAddress} onChange={(e) => setFormData({...formData, billingAddress: e.target.value})} disabled={!isNewBrand && selectedBrandId !== ""} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">GSTIN (Optional)</label>
                    <Input placeholder="22AAAAA0000A1Z5" className="text-zinc-900" value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value})} disabled={!isNewBrand && selectedBrandId !== ""} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">PAN (Optional)</label>
                    <Input placeholder="ABCDE1234F" className="text-zinc-900" value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value})} disabled={!isNewBrand && selectedBrandId !== ""} />
                  </div>
                </div>


              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <Megaphone className="size-5 text-purple-500" /> Campaign Details
                </CardTitle>
                <CardDescription>Specify the Instagram handle and deliverables.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block text-black">Campaign Name</label>
                    <Input placeholder="Summer Sale 2026" className="text-zinc-900" value={formData.campaignName} onChange={(e) => setFormData({...formData, campaignName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Instagram Username</label>
                    <Input placeholder="username" className="text-zinc-900" value={formData.igUserName} onChange={(e) => setFormData({...formData, igUserName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Live Date</label>
                    <Input type="date" className="text-zinc-900" value={formData.liveDate} onChange={(e) => setFormData({...formData, liveDate: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-black">Deliverables</label>
                  
                  {/* Selected Tags */}
                  {selectedDeliverables.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedDeliverables.map(deliv => (
                        <div key={deliv} className="flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200">
                          {deliv}
                          <button onClick={() => toggleDeliverable(deliv)} className="hover:bg-red-200 rounded-full p-0.5"><X className="size-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Options */}
                  <div className="flex flex-wrap gap-2">
                    {DELIVERABLE_OPTIONS.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => toggleDeliverable(opt)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${selectedDeliverables.includes(opt) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
                      >
                        {selectedDeliverables.includes(opt) ? <Check className="size-3 inline mr-1" /> : <Plus className="size-3 inline mr-1" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200/60 bg-white overflow-hidden">
              <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <List className="size-5 text-orange-500" /> Line Items
                </CardTitle>
                <CardDescription className="mt-1.5">Add your services and pricing.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop Header Row */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2.5 bg-white border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                  <div className="col-span-8">Item Details</div>
                  <div className="col-span-4 text-right pr-4">Amount</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col divide-y divide-zinc-100">
                  {lineItems.map((item, index) => (
                    <div key={index} className="group flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-4 px-4 sm:px-6 py-4 items-start hover:bg-zinc-50/50 transition-colors">
                      
                      {/* Item Details (Type & Name) */}
                      <div className="col-span-8 flex flex-col sm:flex-row gap-0 sm:gap-2 w-full border border-zinc-200/60 rounded-md p-1 bg-white focus-within:border-zinc-300 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all shadow-sm">
                        <div className="relative border-b sm:border-b-0 sm:border-r border-zinc-100">
                          <select 
                            className="h-9 w-full sm:w-32 text-sm font-medium text-zinc-600 bg-transparent border-none pl-3 pr-8 outline-none focus:ring-0 cursor-pointer appearance-none hover:text-zinc-900 transition-colors"
                            value={item.type}
                            onChange={(e) => updateLineItem(index, "type", e.target.value)}
                          >
                            {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-3 size-3.5 text-zinc-400 pointer-events-none" />
                        </div>
                        <Input 
                          placeholder="Item description..." 
                          value={item.name} 
                          onChange={(e) => updateLineItem(index, "name", e.target.value)} 
                          className="flex-1 h-9 text-sm font-medium text-zinc-900 bg-transparent border-none px-3 shadow-none outline-none focus-visible:ring-0 placeholder:text-zinc-300"
                          disabled={item.type !== "Product"} 
                        />
                      </div>

                      {/* Qty & Amount Stack */}
                      <div className="col-span-4 flex flex-col items-end w-full relative sm:pr-4">
                        
                        {/* Amount Input */}
                        <div className="flex items-center justify-end w-full gap-1.5 h-10">
                          <span className="text-zinc-400 text-sm font-medium">
                            {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₹'}
                          </span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            value={item.price || ''} 
                            onChange={(e) => updateLineItem(index, "price", parseFloat(e.target.value) || 0)} 
                            className="w-32 text-right bg-transparent border-none px-0 text-lg font-semibold text-zinc-900 shadow-none outline-none focus-visible:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none placeholder:font-normal" 
                          />
                        </div>
                        
                        {/* Qty & Trash Row */}
                        <div className="flex items-center justify-end gap-3 mt-1">
                          <div className="flex items-center text-xs text-zinc-500 font-medium">
                            <span className="mr-2">Qty:</span>
                            <div className="relative border border-zinc-200 rounded-md bg-white hover:border-zinc-300 transition-colors shadow-sm">
                              <select 
                                className="h-7 pl-2.5 pr-7 text-xs text-zinc-700 outline-none focus:ring-0 cursor-pointer appearance-none font-medium bg-transparent"
                                value={item.quantity || 1}
                                onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 100].map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2 top-2 size-3 text-zinc-400 pointer-events-none" />
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLineItem(index)} 
                            className="text-zinc-300 hover:text-red-500 hover:bg-red-50 size-7 rounded-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Footer / Summary Area */}
                <div className="p-4 sm:px-6 sm:py-5 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={addLineItem} className="h-8 gap-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium rounded-md px-2 -ml-2">
                    <Plus className="size-3.5" /> Add Item
                  </Button>
                  
                  <div className="bg-zinc-900 text-white px-6 py-3.5 rounded-xl shadow-md flex items-center gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className="text-zinc-400 font-semibold text-[10px] uppercase tracking-widest">Total Amount</span>
                    <span className="text-2xl font-bold tracking-tight">
                      {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₹'}
                      {lineItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                size="lg" 
                onClick={() => handleGenerate('preview')} 
                disabled={isPreviewLoading || isGenerating || isSaving} 
                className="w-full sm:w-1/3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium shadow-sm border border-indigo-200 rounded-xl h-12 transition-all"
              >
                {isPreviewLoading ? <Loader2 className="animate-spin size-5 mr-2" /> : <RefreshCw className="size-5 mr-2" />} 
                Render Preview
              </Button>
              <Button 
                size="lg" 
                onClick={() => handleGenerate('save')} 
                disabled={isSaving || isGenerating || !formData.brandName} 
                className="w-full sm:w-1/3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-md rounded-xl h-12 transition-all"
              >
                {isSaving ? <Loader2 className="animate-spin size-5 mr-2" /> : <Save className="size-5 mr-2" />} 
                Save
              </Button>
              <Button 
                size="lg" 
                onClick={() => handleGenerate('saveAndDownload')} 
                disabled={isGenerating || isSaving || !formData.brandName} 
                className="w-full sm:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-600/20 rounded-xl h-12 transition-all"
              >
                {isGenerating ? <Loader2 className="animate-spin size-5 mr-2" /> : <FileDown className="size-5 mr-2" />} 
                Save & Download
              </Button>
            </div>
            
            <Button 
              size="lg" 
              onClick={() => setIsPreviewModalOpen(true)} 
              className="w-full lg:hidden font-medium rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            >
              View Live Preview
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div id="preview-section" className={`
          ${isPreviewModalOpen ? 'fixed inset-0 z-50 bg-zinc-100 flex' : 'hidden lg:flex'}
          w-full lg:static lg:w-1/2 lg:bg-zinc-200/50 lg:border-l lg:border-zinc-200 flex-col relative h-[100dvh] lg:h-auto
        `}>
          {/* Mobile Modal Header */}
          <div className="lg:hidden p-4 flex items-center justify-between bg-white border-b border-zinc-200 shrink-0">
            <h3 className="font-semibold text-black">Live Preview</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleGenerate('saveAndDownload')} disabled={isGenerating || !formData.brandName} className="bg-blue-600 hover:bg-blue-700 text-white">
                 {isGenerating ? <Loader2 className="animate-spin size-4" /> : <FileDown className="size-4 mr-1.5" />} Save & Download
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsPreviewModalOpen(false)}><X className="size-5 text-black" /></Button>
            </div>
          </div>

          <div className="hidden lg:flex w-full p-3 items-center justify-between bg-white border-b border-zinc-200 z-10 shrink-0 shadow-sm">
            <h3 className="text-sm font-semibold text-black flex items-center gap-2">
              Live Preview
              {isPreviewLoading && <Loader2 className="size-3.5 animate-spin text-zinc-500" />}
            </h3>
            <span className="text-xs text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded-md">Updates on Render</span>
          </div>
          
          <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
            {previewPdfUrl ? (
              <div className="w-full h-full max-w-3xl rounded-lg shadow-xl overflow-hidden border border-zinc-300 bg-white">
                <iframe src={`${previewPdfUrl}#view=FitH`} className="w-full h-full border-0" />
              </div>
            ) : (
              <div className="text-center text-zinc-400 flex flex-col items-center">
                <FileDown className="size-12 mb-3 opacity-20" />
                <p>Click <b>Render Preview</b> to see the PDF</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Saved Success Popup */}
      {savedInvoiceNumber !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSavedInvoiceNumber(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 size-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="size-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Invoice Saved!</h3>
            {savedInvoiceNumber && <p className="text-sm text-zinc-500 mt-1">Invoice <span className="font-semibold text-zinc-700">{savedInvoiceNumber}</span> has been saved.</p>}
            <div className="flex gap-2 mt-6">
              <Link href="/apps/invoice-generator/history" className="flex-1">
                <Button variant="outline" className="w-full">View History</Button>
              </Link>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => setSavedInvoiceNumber(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      <BottomDock />
    </div>
  );
}
