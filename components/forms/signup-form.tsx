"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
        "flex flex-col gap-6 w-full max-w-sm mx-auto bg-white border border-zinc-100 rounded-[2rem] shadow-xl shadow-zinc-500/5", 
        className
      )} 
      {...props}
    >
      {/* Container for content with internal padding */}
      <div className="flex flex-col items-center gap-6 px-8 pt-8 pb-6">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl">
          <img src="/icon.png" alt="Loomingo Logo" className="size-full object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Welcome to Loomingo</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to manage your automations</p>
        </div>

        <Button 
          variant="default" 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium transition-all"
        >
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : (
            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          )}
          {isLoading ? "Authenticating..." : "Continue with Google"}
        </Button>
      </div>

      {/* Footer area sits flush with the bottom */}
      <p className="px-8 pb-8 text-[11px] text-zinc-400 text-center leading-relaxed">
        By continuing, you agree to our <a href="#" className="underline hover:text-zinc-600">Terms</a> and <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>.
      </p>
    </div>
  );
}