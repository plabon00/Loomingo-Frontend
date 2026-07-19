import { FocusIcon, MessageSquareDashed, Rocket } from "lucide-react";

export default function AutomationSteps() {
  const steps = [
    {
      id: 1,
      title: "Select Post",
      description: "Choose the specific Instagram post or Reel you want to automate.",
      icon: <FocusIcon className="size-6 text-red-600" />,
    },
    {
      id: 2,
      title: "Set Keyword",
      description: "Define the trigger word (e.g., 'LINK') users need to comment.",
      icon: <MessageSquareDashed className="size-6 text-red-600" />,
    },
    {
      id: 3,
      title: "Auto-DM",
      description: "Loomin instantly sends your custom message directly to their inbox.",
      icon: <Rocket className="size-6 text-red-600" />,
    },
  ];

  return (
    <section className="py-16 px-4 w-full flex justify-center relative overflow-hidden bg-white">
      
      {/* Signature Red Glow Background for the Section */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-400 rounded-full opacity-[0.12] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Glassmorphic Section Wrapper */}
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

        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-stretch justify-center gsap-pill-row">
          
          {/* --- DOTTED LINES --- */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0 border-t-2 border-dashed border-red-900/15 -translate-y-1/2 -z-10" />
          <div className="block md:hidden absolute left-1/2 top-[5%] bottom-[5%] w-0 border-l-2 border-dashed border-red-900/15 -translate-x-1/2 -z-10" />

          {/* --- PILL-STYLE GLASS CARDS --- */}
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="gsap-pill-item relative flex flex-col items-center bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-[2rem] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.10)] transition-all duration-300 max-w-xs w-full"
            >
              {/* Card Header */}
              <div className="flex flex-row items-center justify-between w-full pb-4">
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-full shadow-inner">
                  {step.icon}
                </div>
                <span className="flex items-center justify-center size-6 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {step.id}
                </span>
              </div>
              
              {/* Card Content */}
              <div className="pt-0 flex-1 w-full">
                <h3 className="text-xl font-semibold text-red-950 tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}