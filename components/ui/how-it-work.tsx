import { FocusIcon, MessageSquareDashed, Rocket } from "lucide-react";
// Adjust this import path based on where you saved the BorderGlow file!
import BorderGlow from "@/components/BorderGlow"; 

export default function AutomationSteps() {
  const steps = [
    {
      id: 1,
      title: "Select Post",
      description: "Choose the specific Instagram post or Reel you want to automate.",
      icon: <FocusIcon className="size-6 text-blue-600" />,
      badgeTheme: "bg-blue-100 text-blue-700",
      // Custom Blue Glow
      glowColors: ['#93c5fd', '#3b82f6', '#1d4ed8'],
      glowHsl: '217 91 60', 
    },
    {
      id: 2,
      title: "Set Keyword",
      description: "Define the trigger word (e.g., 'LINK') users need to comment.",
      icon: <MessageSquareDashed className="size-6 text-amber-600" />,
      badgeTheme: "bg-amber-100 text-amber-700",
      // Custom Amber Glow
      glowColors: ['#fde68a', '#f59e0b', '#b45309'],
      glowHsl: '38 92 50',
    },
    {
      id: 3,
      title: "Auto-DM",
      description: "Loomin instantly sends your custom message directly to their inbox.",
      icon: <Rocket className="size-6 text-green-600" />,
      badgeTheme: "bg-green-100 text-green-700",
      // Custom Green Glow
      glowColors: ['#bbf7d0', '#22c55e', '#15803d'],
      glowHsl: '142 71 45',
    },
  ];

  return (
    <section className="py-16 px-4 w-full flex justify-center">
      {/* NEW WRAPPER SECTION:
        - rounded-[2.5rem] gives it a very smooth, modern curve
        - border border-border/50 adds the ultra-thin gray line
        - bg-muted/30 gives it a very subtle background tint that adapts to light/dark mode
      */}
      <div className="max-w-6xl w-full border border-border/50 bg-muted/30 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How to automate a post</h2>
          <p className="text-muted-foreground text-lg">Set up your first automation in under 60 seconds.</p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-stretch justify-center">
          
          {/* --- DOTTED LINES --- */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0 border-t-2 border-dashed border-muted-foreground/40 -translate-y-1/2 -z-10" />
          <div className="block md:hidden absolute left-1/2 top-[5%] bottom-[5%] w-0 border-l-2 border-dashed border-muted-foreground/40 -translate-x-1/2 -z-10" />

          {/* --- BORDER GLOW CARDS --- */}
          {steps.map((step) => (
            <BorderGlow 
              key={step.id} 
              // FIX: Removed border-t-4 and colorTheme. Kept it clean and symmetrical.
              className="relative z-10 w-full max-w-sm flex flex-col shadow-sm"
              colors={step.glowColors}
              glowColor={step.glowHsl}
              backgroundColor="hsl(var(--card))" 
              borderRadius={24} // Creates a perfectly smooth, slightly rounded edge on all 4 sides
              animated={false} 
            >
              {/* Custom Card Header */}
              <div className="flex flex-row items-center justify-between p-6 pb-4">
                <div className="p-3 bg-muted/50 rounded-xl">
                  {step.icon}
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${step.badgeTheme}`}>
                  STEP {step.id}
                </span>
              </div>
              
              {/* Custom Card Content */}
              <div className="p-6 pt-0 flex-1">
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
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