"use client";

import { Instrument_Serif } from "next/font/google";
import { motion } from "motion/react";
import AnimatedButton from "../../radix/button/button-01";
import { SignupForm } from "@/components/signup-form";
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
  const handleGetStartedClick = () => {
    // Add your logic here, e.g., redirecting to a signup page or opening a modal
    console.log("Get Started button clicked!");
  };

  return (
    <section>
      <div className="w-full h-full relative">
        <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4 px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  // 1. Scaled down starting at 4xl for mobile, growing up to 8xl on massive screens
                  // 2. Used leading-[1.1] which perfectly and automatically adjusts line-height for ANY text size
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.1]"
                >
                  Built for real{" "}
                  <span
                    className={`${instrumentSerif.className} tracking-tight`}
                  >
                    Growth
                  </span>
                  , Loved by{" "}
                  <span
                    className={`${instrumentSerif.className} tracking-tight`}
                  >
                    Creators
                  </span>{" "}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  // 3. Scaled the paragraph to start at text-sm on mobile and grow to text-xl on desktop
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-normal max-w-2xl text-muted-foreground"
                >
                  Grow your reach, earn more, and save time,
                  {/* 4. Hide the break on mobile so it wraps naturally, but show it on sm screens and up */}
                  <br className="hidden sm:block" />
                  so you can focus on delivering real value to your audience.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col md:flex-row justify-center gap-8"
              >


              <AnimatedButton onClick={() => setIsSignInOpen(true)}>Get Started</AnimatedButton>




                <div className="flex items-center sm:gap-7 gap-3">
                  <ul className="avatar flex flex-row items-center">
                    {avatarList.map((avatar, index) => (
                      <li key={index} className="-mr-2 z-1 avatar-hover:ml-2">
                        <img
                          src={avatar.image}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-white"
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="gap-1 flex flex-col items-start">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={index}
                          src="https://images.shadcnspace.com/assets/svgs/icon-star.svg"
                          alt="star"
                          className="h-4 w-4"
                        />
                      ))}
                    </div>
                    <p className="sm:text-sm text-xs font-normal text-muted-foreground">
                      Trusted by 1000+ clients
                    </p>
                  </div>
                </div>
              </motion.div>
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
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
