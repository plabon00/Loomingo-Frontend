"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const idToken = await user.getIdToken();

      // Fire-and-forget background sync to drastically speed up login
      fetch("/api/users/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL
        }),
      }).catch(err => console.error("Background sync error:", err));
      
      toast.success("Welcome back to Loomingo!");
      router.push("/home-page");

    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Could not verify your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full max-w-[400px] mx-auto overflow-hidden bg-white/70 backdrop-blur-3xl rounded-[32px] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-10", 
        className
      )} 
      {...props}
    >
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-400/20 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-400/20 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo with slight animation */}
        <div className="relative mb-6 group cursor-default">
          <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl group-hover:bg-red-500/30 transition-all duration-500" />
          <div className="relative flex size-20 items-center justify-center bg-white rounded-3xl shadow-sm border border-zinc-100 group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-500">
            <img src="/icon.png" alt="Loomingo Logo" className="size-12 object-contain" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-zinc-900 tracking-tight leading-tight flex items-center justify-center gap-2">
            Welcome back <Sparkles className="size-5 text-red-500 animate-pulse" />
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Log in or sign up in seconds.</p>
        </div>

        {/* Fancy Google Button */}
        <button 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="group relative w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] overflow-hidden flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-80 disabled:pointer-events-none"
        >
          {/* Button inner shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-full">
                <svg className="size-4" viewBox="0 0 24 24" fill="#000">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </div>
              <span className="tracking-wide">Continue with Google</span>
              <ArrowRight className="size-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          )}
        </button>

        {/* Footer */}
        <p className="mt-8 text-xs font-medium text-zinc-400 text-center leading-relaxed">
          By continuing, you agree to Loomingo's <br/>
          <a href="/terms" className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors">Terms of Service</a> and <a href="/privacy-policy" className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
