"use client";

import { Instrument_Serif } from "next/font/google";
import { LazyMotion, domAnimation, m } from "motion/react";
import AnimatedButton from "../../radix/button/button-01";
import { SignupForm } from "@/components/forms/signup-form";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/use-auth-user";

// Import Radix UI primitives directly to control the background and close button
import * as DialogPrimitive from "@radix-ui/react-dialog";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export type AvatarList = {
  image: string;
};

type HeroSectionProps = {
  avatarList: AvatarList[];
};

function HeroSection({ avatarList }: HeroSectionProps) {
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
    <LazyMotion features={domAnimation}>
      <section className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col overflow-hidden bg-red-950 pt-20 lg:pt-0">
        {/* Deep Red Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-red-900 to-[#1a0000] z-0"></div>
        
        {/* Extra glow directly behind the character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-red-500 rounded-full blur-[100px] lg:blur-[140px] opacity-40 z-0 pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 flex-1 h-full">
            
            {/* LEFT COLUMN: Headings & Text */}
            <m.div 
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="lg:col-span-4 flex flex-col text-center lg:text-left items-center lg:items-start justify-center gap-4 lg:gap-6 order-1 relative z-20 h-full pt-10 lg:pt-0"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-medium leading-[1.1] text-white">
                Built for real{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-red-200`}>
                  Growth
                </span>
                ,<br className="hidden lg:block" /> Loved by{" "}
                <span className={`${instrumentSerif.className} tracking-tight text-red-200`}>
                  Creators
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-md">
                Grow your reach, earn more, and save time, so you can focus on delivering real value to your audience.
              </p>
            </m.div>

            {/* CENTER COLUMN: Hero Image */}
            <m.div 
              initial={{ opacity: 0, scale: 0.9, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-4 flex justify-center items-end order-2 relative z-10 mt-4 lg:mt-0 h-full"
            >
              <div className="relative flex flex-col items-center justify-end h-full w-full">
                
                {/* PERFORMANCE FIX: Using next/image for automatic optimization and LCP priority */}
                <div className="relative w-full h-[45vh] lg:h-[85vh] xl:h-[90vh] max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-none mx-auto z-10 flex justify-center">
                  {/* Mobile Image */}
                  <Image 
                    src="https://i.ibb.co/mVwPqKPK/Gemini-Generated-Image-4v0dha4v0dha4v0d-Photoroom-1.png" 
                    alt="Hero Character Mobile" 
                    priority
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-contain object-bottom drop-shadow-2xl lg:hidden"
                  />
                  {/* Desktop Image */}
                  <Image 
                    src="https://i.ibb.co/h3KPQsH/Gemini-Generated-Image-4v0dha4v0dha4v0d-Photoroom.png" 
                    alt="Hero Character Desktop" 
                    priority
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-contain object-bottom drop-shadow-2xl hidden lg:block"
                  />
                </div>

                <div className="absolute bottom-0 w-[60%] lg:w-[40%] h-[12px] lg:h-[20px] bg-black/80 blur-[8px] lg:blur-[12px] rounded-[100%] z-0 translate-y-1/2"></div>
              </div>
            </m.div>

            {/* RIGHT COLUMN: Call to Action & Social Proof */}
            <m.div 
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
              className="lg:col-span-4 flex flex-col items-center lg:items-start justify-center text-center lg:text-left gap-8 order-3 relative z-30 -mt-24 lg:mt-0 pb-10 lg:pb-0 h-full"
            >
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-3xl flex flex-col items-center lg:items-start gap-6 shadow-2xl w-full max-w-sm lg:ml-auto">
                
                <AnimatedButton onClick={handleGetStarted}>
                  Get Started
                </AnimatedButton>

                <div className="flex flex-col items-center lg:items-start gap-3 mt-2">
                  <ul className="flex flex-row items-center">
                    {avatarList.map((avatar, index) => (
                      <li key={index} className="-mr-3 z-10 hover:ml-2 transition-all duration-300">
                        {/* PERFORMANCE FIX: Replaced raw img with next/image */}
                        <Image
                          src={avatar.image}
                          alt="Avatar"
                          width={44}
                          height={44}
                          className="rounded-full border-2 border-red-900 object-cover shadow-lg"
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="gap-1 flex flex-col items-center lg:items-start">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                          key={index}
                          src="https://images.shadcnspace.com/assets/svgs/icon-star.svg"
                          alt="star"
                          width={16}
                          height={16}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-white/90">
                      Trusted by 1000+ clients
                    </p>
                  </div>
                </div>
              </div>
            </m.div>

          </div>
        </div>

        {/* Auth Modal using Radix Primitives */}
        <DialogPrimitive.Root open={isSignInOpen} onOpenChange={setIsSignInOpen}>
          <DialogPrimitive.Portal>
            
            <DialogPrimitive.Content 
              className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] p-0 border-none rounded-[2rem] shadow-2xl bg-white outline-none w-full max-w-sm"
            >
              <DialogPrimitive.Title className="sr-only">Sign In to Loomingo</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">Fill out the form below to get started.</DialogPrimitive.Description>
              
              {/* Custom positioned Close Icon */}
              <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none">
                <X size={18} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
              
              <SignupForm />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </section>
    </LazyMotion>
  );
}

export default HeroSection;