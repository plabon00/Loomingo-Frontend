import { Award, Store, TreeDeciduous, Lock } from "lucide-react";

export default function UpcomingFeatures() {
  const upcomingFeatures = [
    {
      id: 1,
      title: "Winner Selector",
      description: "Pick a random winner from comments based on rules you set.",
      icon: <Award className="size-6 text-zinc-400" />,
    },
    {
      id: 2,
      title: "Link in Bio Store",
      description: "Turn your Instagram traffic into sales with a beautiful bio link.",
      icon: <Store className="size-6 text-zinc-400" />,
    },
    {
      id: 3,
      title: "Link Tree",
      description: "A gorgeous, custom landing page to host all your important links.",
      icon: <TreeDeciduous className="size-6 text-zinc-400" />,
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
            We’re building more tools to boost your social media growth.
          </p>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-stretch justify-center">
          
          {upcomingFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="relative w-full max-w-sm flex flex-col border border-zinc-200 bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              
              {/* Central Locked Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-lg ring-4 ring-zinc-50/80">
                  <Lock className="size-5 text-zinc-400" />
                </div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 shadow-sm uppercase">
                  Coming Soon
                </span>
              </div>
              
              {/* --- BLURRED & DIMMED LAYER --- */}
              <div className="p-6 relative z-10 blur-[3px] opacity-40 flex-1 flex flex-col pointer-events-none select-none bg-zinc-50/50">
                
                {/* Feature Header */}
                <div className="flex flex-row items-center justify-between pb-4">
                  <div className="p-3 bg-zinc-100 border border-zinc-200/50 rounded-xl shadow-inner">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Feature Content */}
                <div className="pt-0 flex-1">
                  <h3 className="text-xl font-semibold text-red-950 tracking-tight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
              
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}