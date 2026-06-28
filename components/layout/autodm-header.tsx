import { Plus, Play, BookOpen, Send, UserPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AutoDMHeader() {
  return (
    <div className="w-full relative bg-background min-h-screen">
      
      {/* --- HEADER BACKGROUND SECTION --- */}
      <div className="relative w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-900 pb-28 pt-6 px-4 lg:px-8 overflow-hidden">
        
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-300 to-transparent mix-blend-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Top Right Button */}
          <div className="flex justify-end w-full">
            <Button 
              className="rounded-full bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 shadow-md h-9 px-5 text-sm"
            >
              <Plus className="mr-2 size-4" /> 
              Create Automation
            </Button>
          </div>

          {/* Center Title & Links */}
          <div className="flex flex-col items-center justify-center mt-4 mb-6 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-semibold mb-5 tracking-wide">
              Auto-DM
            </h1>
            
            <div className="flex items-center gap-6 text-sm font-medium text-white/90">
              <button className="flex items-center hover:text-white hover:underline underline-offset-4 transition-all">
                <Play className="mr-2 size-4" /> 
                View Demo
              </button>
              
              <span className="w-[1px] h-4 bg-white/30" />
              
              <button className="flex items-center hover:text-white hover:underline underline-offset-4 transition-all">
                <BookOpen className="mr-2 size-4" /> 
                Resources
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* --- COMPACT STAT CARDS --- */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-14 relative z-20 pb-12">
        {/* grid-cols-2 forces 2 columns on mobile. md:grid-cols-3 makes it 3 on desktop. */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          
          {/* Card 1: Total DMs Sent */}
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 line-clamp-1">
              Total DM Sent
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">0</span>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Send className="size-4 md:size-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Card 2: Followers Gained */}
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 line-clamp-1">
              Followers Gained
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">0</span>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserPlus className="size-4 md:size-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          {/* Card 3: Active Automations 
              col-span-2 makes it stretch across the whole bottom row on mobile. 
              md:col-span-1 puts it back in the 3rd column on desktop. 
          */}
          <Card className="p-4 shadow-sm border-border/50 rounded-xl bg-card flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="text-[10px] md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 line-clamp-1">
              Active Automations
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">0</span>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Zap className="size-4 md:size-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
}