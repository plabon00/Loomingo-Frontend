import React from 'react';
import { AppleHelloEffectEnglish } from "@/components/features/misc/apple-hello-effect-english";
import AnimatedName from "@/components/features/misc/animated-name"; // Adjust this import path to wherever you saved it!

export interface UserGreetingProps {
  name: string;
  className?: string;
}

export default function UserGreeting({ name, className = "" }: UserGreetingProps) {
  return (
    <div className={`my-4 ${className}`}>
      {/* Used flex and items-center to keep the animation and text perfectly aligned */}
      <div className="flex items-center justify-start flex-wrap text-3xl gap-3 font-medium">

        {/* 1. The Apple Hello SVG (scaled down to fit the text) */}
        <AppleHelloEffectEnglish className="h-10 text-red-950" />

        {/* 2. The new Animated Name component passed right in! */}
        <AnimatedName name={name} className="mx-2 text-red-950 font-medium tracking-tight text-5xl" />

      </div>
    </div>
  );
}