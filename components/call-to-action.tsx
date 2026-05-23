import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SignupForm } from "@/components/signup-form";
import { useState } from 'react';
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import AnimatedButton from "./shadcn-space/radix/button/button-01";

export default function CallToAction() {

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  return (
    <div className="text-center mb-15 px-4">
      <AnimatedShinyText
        shimmerDuration="10s"
        shimmerWidth={500}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center mx-auto md:whitespace-nowrap leading-tight"
      >
        Try Loomingo Today
      </AnimatedShinyText>

      <p className="mt-4 text-sm sm:text-base md:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto">
        Free to start . No commitments.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {/* FIX: Added the onClick handler right here! */}
        <AnimatedButton onClick={() => setIsSignInOpen(true)}>
          Get Started
        </AnimatedButton>
      </div>
      
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
          <DialogTitle className="sr-only">Sign In to Loomingo</DialogTitle>
          
          {/* Notice the correct closing tag here! */}
          <DialogDescription className="sr-only">
            Fill out the form below to get started.
          </DialogDescription>
          
          <SignupForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}