import { Award, Store, TreeDeciduous, Lock } from "lucide-react";

export default function UpcomingFeatures() {
  const upcomingFeatures = [
    {
      id: 1,
      title: "Winner Selector from Comments",
      description: "Pick a random winner from comments based on rules you set.",
      // Using FocusIcon (Focus) as a placeholder for award/selection
      icon: <Award className="size-6 text-muted-foreground/70" />,
    },
    {
      id: 2,
      title: "Link in Bio Store",
      description: "Turn your Instagram traffic into sales with a beautiful bio link.",
      icon: <Store className="size-6 text-muted-foreground/70" />,
    },
    {
      id: 3,
      title: "Link Tree",
      description: "A gorgeous, custom landing page to host all your important links.",
      icon: <TreeDeciduous className="size-6 text-muted-foreground/70" />,
    },
  ];

  return (
    <section className="pb-16 px-4 w-full flex justify-center">
      {/* WRAPPER SECTION: Maintained consistency with the previous section */}
      <div className="max-w-6xl w-full border border-border/50 bg-muted/30 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Upcoming Features</h2>
          <p className="text-muted-foreground text-lg">We’re building more tools to boost your social media growth.</p>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-stretch justify-center">
          
          {upcomingFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="relative w-full max-w-sm flex flex-col border border-border bg-card rounded-[24px] shadow-inner"
            >
              
              {/* Central Locked Badge: This is not blurred and stands out */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg ring-4 ring-card">
                  <Lock className="size-6 text-muted-foreground" />
                </div>
                <span className="px-3 py-1 text-[11px] font-bold tracking-wider rounded-full bg-muted text-muted-foreground border border-border shadow-md">
                  COMING SOON
                </span>
              </div>
              
              {/* --- BLURRED & DIMMED LAYER ---
                - blur-[2px]: Blurs the background content slightly
                - opacity-60: Makes content "slightly visible"
              */}
              <div className="p-6 relative z-10 blur-[2px] opacity-60 flex-1 flex flex-col pointer-events-none select-none">
                
                {/* Feature Header */}
                <div className="flex flex-row items-center justify-between pb-4">
                  <div className="p-3 bg-muted/50 rounded-xl">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Feature Content */}
                <div className="pt-0 flex-1">
                  <h3 className="text-xl font-semibold tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
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