'use client';

import { SignupForm } from "@/components/forms/signup-form";
import { useState } from 'react';
import AnimatedButton from "@/components/shadcn-space/radix/button/button-01";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/use-auth-user";

// Import Radix UI primitives directly to control the background and close button
import * as DialogPrimitive from "@radix-ui/react-dialog";

export default function CallToAction() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthUser();

  // Logged-in users go straight to the dashboard instead of the signup modal
  const handleGetStarted = () => {
    if (user) {
      router.push("/home-page");
    } else {
      setIsSignInOpen(true);
    }
  };

  return (
    // Wrapped in a soft, glassmorphic card to make it pop at the bottom of the page
    <div className="relative w-full max-w-4xl mx-auto text-center px-4 py-16 md:py-24 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2.5rem] shadow-sm mb-8 overflow-hidden">
      
      {/* Subtle inner gradient to give the card depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/80 text-red-950 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
          Ready to scale?
        </div>

        {/* Brand Consistent Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-red-950 tracking-tight leading-[1.1] mb-6">
          Start automating <br className="hidden sm:block" />
          <span className="text-red-600 italic font-serif drop-shadow-sm">today</span>
        </h2>

        {/* Subtext updated with brand colors */}
        <p className="text-base md:text-lg text-red-950/70 max-w-md mx-auto mb-10">
          Join 60K+ creators and brands turning comments into customers. Free to start. No commitments.
        </p>

        {/* Button */}
        <div className="flex flex-wrap justify-center gap-4">
          <AnimatedButton onClick={handleGetStarted}>
            Get Started for Free
          </AnimatedButton>
        </div>

      </div>
      
      {/* Auth Modal using Radix Primitives */}
      <DialogPrimitive.Root open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogPrimitive.Portal>
          
          <DialogPrimitive.Content 
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] p-0 border-none rounded-[2rem] shadow-2xl bg-white outline-none w-full max-w-sm"
          >
            <DialogPrimitive.Title className="sr-only">Sign In to Loomingo</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Fill out the form below to get started.
            </DialogPrimitive.Description>
            
            {/* Custom positioned Close Icon (Inside the box) */}
            <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">
              <X size={18} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            
            <SignupForm />
          </DialogPrimitive.Content>
          
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}