import { Award, Store, TreeDeciduous, Lock } from "lucide-react";

export default function UpcomingFeatures() {
  const upcomingFeatures = [
    {
      id: 1,
      title: "Winner Selector",
      description: "Pick a random winner from comments based on rules you set.",
      icon: <Award className="size-5 text-zinc-400" />,
    },
    {
      id: 2,
      title: "Link in Bio Store",
      description: "Turn your Instagram traffic into sales with a beautiful bio link.",
      icon: <Store className="size-5 text-zinc-400" />,
    },
    {
      id: 3,
      title: "Link Tree",
      description: "A gorgeous, custom landing page to host all your important links.",
      icon: <TreeDeciduous className="size-5 text-zinc-400" />,
    },
  ];

  return (
    <section className="py-16 px-4 w-full flex justify-center relative overflow-hidden bg-white">
      
      {/* Signature Red Glow Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-400 rounded-full opacity-[0.12] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* WRAPPER SECTION: Glassmorphic premium container */}
      <div className="max-w-6xl w-full border border-zinc-200 bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 md:p-16 relative z-10 shadow-sm">
        
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Brand Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white/80 text-red-950 text-sm font-medium mb-6 shadow-sm">
            Roadmap
          </div>
          
          <h2 className="text-4xl md:text-5xl font-medium text-red-950 tracking-tight mb-4 leading-[1.1]">
            Upcoming <span className="text-red-600 italic font-serif">features</span>
          </h2>
          <p className="text-red-950/70 text-lg max-w-md">
            We&apos;re building more tools to boost your social media growth.
          </p>
        </div>

        {/* --- HORIZONTAL PILL ROW --- */}
        <div className="relative flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center gsap-pill-row">
          
          {upcomingFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="gsap-pill-item inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/60 backdrop-blur-md border border-zinc-200/50 opacity-50 cursor-not-allowed select-none w-full sm:w-auto"
            >
              {/* Icon */}
              <div className="p-2 bg-zinc-100/80 rounded-full shrink-0">
                {feature.icon}
              </div>
              
              {/* Text */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-zinc-700 truncate">{feature.title}</span>
                <span className="text-xs text-zinc-400 truncate hidden sm:block">{feature.description}</span>
              </div>

              {/* Lock Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[9px] font-bold uppercase tracking-wider shrink-0 ml-auto">
                <Lock className="size-2.5" />
                Soon
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}