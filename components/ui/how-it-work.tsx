import { FocusIcon, MessageSquareDashed, Rocket } from "lucide-react";
// Adjust this import path based on where you saved the BorderGlow file!
import BorderGlow from "@/components/features/misc/BorderGlow"; 

export default function AutomationSteps() {
  const steps = [
    {
      id: 1,
      title: "Select Post",
      description: "Choose the specific Instagram post or Reel you want to automate.",
      icon: <FocusIcon className="size-6 text-red-600" />,
      badgeTheme: "bg-red-50 text-red-700 border border-red-100",
      // Brand-aligned Red Glow
      glowColors: ['#fca5a5', '#dc2626', '#7f1d1d'], // red-300, red-600, red-900
      glowHsl: '0 72 51', // HSL for red-600
    },
    {
      id: 2,
      title: "Set Keyword",
      description: "Define the trigger word (e.g., 'LINK') users need to comment.",
      icon: <MessageSquareDashed className="size-6 text-red-600" />,
      badgeTheme: "bg-red-50 text-red-700 border border-red-100",
      glowColors: ['#fca5a5', '#dc2626', '#7f1d1d'],
      glowHsl: '0 72 51',
    },
    {
      id: 3,
      title: "Auto-DM",
      description: "Loomin instantly sends your custom message directly to their inbox.",
      icon: <Rocket className="size-6 text-red-600" />,
      badgeTheme: "bg-red-50 text-red-700 border border-red-100",
      glowColors: ['#fca5a5', '#dc2626', '#7f1d1d'],
      glowHsl: '0 72 51',
    },
  ];

  return (
    <section className="py-16 px-4 w-full flex justify-center relative overflow-hidden bg-white">
      
      {/* Signature Red Glow Background for the Section */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-400 rounded-full opacity-[0.12] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* NEW WRAPPER SECTION:
        - rounded-[2.5rem] matches your CTA and Profile Card curves
        - border border-zinc-200 adds the clean, premium thin line
        - bg-white/60 with backdrop-blur gives it the glassmorphic depth
      */}
      <div className="max-w-6xl w-full border border-zinc-200 bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 md:p-16 relative z-10 shadow-sm">
        
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Brand Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/80 text-red-950 text-sm font-medium mb-6 shadow-sm">
            Simple Setup
          </div>
          
          <h2 className="text-4xl md:text-5xl font-medium text-red-950 tracking-tight mb-4 leading-[1.1]">
            How to automate a <br className="md:hidden" />
            <span className="text-red-600 italic font-serif">post</span>
          </h2>
          <p className="text-red-950/70 text-lg max-w-md">
            Set up your first automation in under 60 seconds.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-stretch justify-center">
          
          {/* --- DOTTED LINES (Updated to blend with the white/zinc aesthetic) --- */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0 border-t-2 border-dashed border-red-900/15 -translate-y-1/2 -z-10" />
          <div className="block md:hidden absolute left-1/2 top-[5%] bottom-[5%] w-0 border-l-2 border-dashed border-red-900/15 -translate-x-1/2 -z-10" />

          {/* --- BORDER GLOW CARDS --- */}
          {steps.map((step) => (
            <BorderGlow 
              key={step.id} 
              className="relative z-10 w-full max-w-sm flex flex-col shadow-sm"
              colors={step.glowColors}
              glowColor={step.glowHsl}
              backgroundColor="#ffffff" // Ensures the inside of the card is pure white
              borderRadius={24} 
              animated={false} 
            >
              {/* Custom Card Header */}
              <div className="flex flex-row items-center justify-between p-6 pb-4">
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl shadow-inner">
                  {step.icon}
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm ${step.badgeTheme}`}>
                  STEP {step.id}
                </span>
              </div>
              
              {/* Custom Card Content */}
              <div className="p-6 pt-0 flex-1">
                <h3 className="text-xl font-semibold text-red-950 tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </BorderGlow>
          ))}

        </div>
      </div>
    </section>
  );
}