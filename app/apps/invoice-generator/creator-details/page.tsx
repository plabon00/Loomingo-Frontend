"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DesktopSidebar, MobileNavbar, BottomDock } from "@/components/layout/AppNavigation";
import Link from "next/link";

// Form and Validation
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, User as UserIcon, Building, QrCode, UploadCloud, CheckCircle2, Eye, EyeOff } from "lucide-react";

// 1. Zod Schema
const settingsSchema = z.object({
  creatorName: z.string().min(2, "Name must be at least 2 characters."),
  creatorEmail: z.string().email("Please enter a valid email address."),
  creatorAddress: z.string().min(5, "Please enter your full address."),
  bankName: z.string().min(2, "Bank Name is required."),
  accountNumber: z.string().min(5, "Account Number is required."),
  ifscCode: z.string().min(2, "IFSC code is required."),
  accountType: z.enum(["Savings", "Current"]),
  upiId: z.string().optional(),
  signatureUrl: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function CreatorSettings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Custom states for UI
  const [showAccountNum, setShowAccountNum] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      creatorName: "",
      creatorEmail: "",
      creatorAddress: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "Savings",
      upiId: "",
      signatureUrl: "",
    },
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load existing settings
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/creator/settings?userId=${currentUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              const s = data.data;
              const payout = s.payoutDetails || {};
              reset({
                creatorName: s.creatorName || "",
                creatorEmail: s.creatorEmail || "",
                creatorAddress: s.creatorAddress || "",
                bankName: payout.bankName || "",
                accountNumber: payout.accountNumber || "",
                ifscCode: payout.ifscCode || "",
                accountType: payout.accountType === "Current" ? "Current" : "Savings",
                upiId: payout.upiId || "",
                signatureUrl: payout.signatureUrl || payout.qrCodeUrl || "",
              });
              if (payout.signatureUrl || payout.qrCodeUrl) setPreviewImage(payout.signatureUrl || payout.qrCodeUrl);
              if (s.creatorName) setIsEditing(false); // Lock form if data exists
            }
          }
        } catch (err) {
          console.error("Failed to load settings", err);
        }
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [router, reset]);

  // ImgBB Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setValue("signatureUrl", base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error reading image file.");
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    
    // 2. (Optional) Save to backend
    if (user) {
      try {
        const payload = {
          userId: user.uid,
          creatorName: data.creatorName,
          creatorEmail: data.creatorEmail,
          creatorAddress: data.creatorAddress,
          payoutDetails: {
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            accountType: data.accountType,
            upiId: data.upiId,
            signatureUrl: data.signatureUrl,
          }
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL}/api/creator/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert("Creator Details Saved Successfully!");
          setIsEditing(false); // Lock form after successful save
        } else {
          alert("Failed to save to database.");
        }
      } catch (err) {
        console.error("Save error", err);
      }
    }

    setIsSaving(false);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-red-600 size-8" /></div>;
  }

  return (
    <div className="flex bg-zinc-50 min-h-screen">
      <DesktopSidebar />
      <MobileNavbar />

      <main className="flex-1 md:ml-20 lg:ml-64 pt-16 md:pt-8 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pb-20">
          
          <div className="flex items-center gap-3 mb-2">
            <Link href="/apps/invoice-generator">
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900"><ArrowLeft className="size-5" /></Button>
            </Link>
            <div className="flex w-full items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-black">Creator Details</h1>
                <p className="text-zinc-500 mt-1">Manage your billing and bank information.</p>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-zinc-900 hover:bg-zinc-800 text-white">
                  Edit Details
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* SECTION 1: BASIC INFORMATION */}
            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <UserIcon className="size-5 text-indigo-500" /> Basic Information
                </CardTitle>
                <CardDescription>This information will appear on the "From" section of your invoices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Creator / Brand Name</label>
                    <Input {...register("creatorName")} placeholder="John Doe" className="text-black bg-zinc-50" disabled={!isEditing} />
                    {errors.creatorName && <p className="text-red-500 text-xs mt-1">{errors.creatorName.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Email Address</label>
                    <Input type="email" {...register("creatorEmail")} placeholder="john@example.com" className="text-black bg-zinc-50" disabled={!isEditing} />
                    {errors.creatorEmail && <p className="text-red-500 text-xs mt-1">{errors.creatorEmail.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Full Address</label>
                  <textarea 
                    {...register("creatorAddress")}
                    className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950" 
                    placeholder="123 Creator Studio, City, PIN" 
                    disabled={!isEditing}
                  />
                  {errors.creatorAddress && <p className="text-red-500 text-xs mt-1">{errors.creatorAddress.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: BANK DETAILS */}
            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <Building className="size-5 text-green-500" /> Bank Details
                </CardTitle>
                <CardDescription>Primary bank account for wire transfers (NEFT/RTGS/IMPS).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Bank Name</label>
                  <Input {...register("bankName")} placeholder="HDFC Bank" className="text-black bg-zinc-50" disabled={!isEditing} />
                  {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Account Number</label>
                    <div className="relative">
                      <Input 
                        type={showAccountNum ? "text" : "password"} 
                        {...register("accountNumber")} 
                        placeholder="000000000000" 
                        className="text-black bg-zinc-50 pr-10" 
                        disabled={!isEditing}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowAccountNum(!showAccountNum)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                      >
                        {showAccountNum ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">IFSC Code</label>
                    <Input {...register("ifscCode")} placeholder="HDFC0001234" className="text-black bg-zinc-50 uppercase" disabled={!isEditing} />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-black">Account Type</label>
                  <Controller
                    control={control}
                    name="accountType"
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                        disabled={!isEditing}
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">UPI ID</label>
                  <Input {...register("upiId")} placeholder="username@upi" className="text-black bg-zinc-50" disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: DIGITAL SIGNATURE */}
            <Card className="shadow-sm border-zinc-200/60 bg-white">
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <UploadCloud className="size-5 text-purple-500" /> Digital Signature
                </CardTitle>
                <CardDescription>Upload your signature to automatically sign your invoices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-black">Signature Image (Optional)</label>
                  
                  <div className={`mt-2 flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-zinc-50 transition-colors ${!isEditing ? 'border-zinc-200 opacity-70 cursor-not-allowed' : 'border-zinc-300 hover:bg-zinc-100 hover:border-blue-400'}`}>
                    {previewImage ? (
                      <div className="relative w-full h-full p-2 group">
                        <img src={previewImage} alt="Signature Preview" className="w-full h-full object-contain mix-blend-multiply" />
                        {isEditing && (
                          <button 
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setValue("signatureUrl", "");
                            }}
                            className="absolute top-2 right-2 bg-red-100 text-red-600 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center w-full h-full ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploading ? (
                            <Loader2 className="size-8 text-blue-500 animate-spin mb-2" />
                          ) : (
                            <UploadCloud className="size-8 text-zinc-400 mb-2" />
                          )}
                          <p className="text-sm text-zinc-600"><span className="font-semibold text-blue-600">Click to upload</span> signature</p>
                          <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 5MB (Transparent PNG preferred)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!isEditing || isUploading} />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-600/20"
                disabled={isSaving || isUploading}
              >
                {isSaving ? <><Loader2 className="animate-spin size-5 mr-2" /> Saving...</> : <><Save className="size-5 mr-2" /> Save All Details</>}
              </Button>
            )}
          </form>
        </div>
      </main>

      <BottomDock />
    </div>
  );
}
