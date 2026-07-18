import { useState } from "react";
import {
  Plus,
  Send,
  UserPlus,
  Zap,
  Settings,
  Search,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutomationStatsDTO } from "../types";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

// ————— Theme tokens —————
const INK = "#19152b"; // Deep dark purple/navy
const PRIMARY = "#5742f5";
const PAPER = "#f6f4ef";

const cardCls = "bg-white border border-[#e6e1d6] rounded-2xl shadow-[0_1px_2px_rgb(25,21,43,0.04),0_12px_28px_-16px_rgb(25,21,43,0.10)]";
const kickerCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#5742f5]";

const sectionReveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

interface AutomationHeaderProps {
  stats: AutomationStatsDTO;
  onOpenSettings: () => void;
  onOpenCreationModal: () => void;
}

export function AutomationHeader({
  stats,
  onOpenSettings,
  onOpenCreationModal,
}: AutomationHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <>
      {/* DESKTOP MASTHEAD */}
      <div className="relative w-full pb-28 pt-8 px-4 lg:px-8 overflow-hidden max-md:hidden" style={{ backgroundColor: INK }}>
        {/* Fine ruled-paper lines */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #fff 27px, #fff 28px)" }}
          aria-hidden="true"
        />
        {/* Purple glow */}
        <div
          className="absolute -top-24 right-[10%] w-[500px] h-[300px] rounded-full opacity-[0.2] blur-[100px] pointer-events-none"
          style={{ backgroundColor: PRIMARY }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
          <div className="hidden md:flex items-center justify-end w-full gap-3">
            
            {/* Expandable Search */}
            <motion.div 
              initial={false}
              animate={{ width: isSearchExpanded ? 300 : 40 }}
              className="relative flex items-center h-10 overflow-hidden rounded-full bg-white/5 border border-white/20 backdrop-blur focus-within:bg-white/10 focus-within:border-white/30 transition-colors"
            >
              <button 
                onClick={() => setIsSearchExpanded(true)}
                className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-white z-10"
              >
                <Search className="size-4" />
              </button>
              <input
                type="search"
                placeholder="Search automations..."
                className="w-full h-full bg-transparent pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={(e) => {
                  if (!e.target.value) setIsSearchExpanded(false);
                }}
              />
            </motion.div>

            <Button
              onClick={onOpenSettings}
              variant="outline"
              className="h-10 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white px-5 backdrop-blur transition-colors"
            >
              <Settings className="mr-2 size-4" /> Settings
            </Button>

            <Button
              onClick={onOpenCreationModal}
              className="rounded-full text-white shadow-lg h-10 px-6 text-sm font-semibold transition-all hover:brightness-110"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus className="mr-2 size-4" /> Create Automation
            </Button>
          </div>

          <motion.div {...sectionReveal} className="flex flex-col items-start justify-center mt-10 mb-2 text-left">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "#a597fa" }}>
              <Zap className="size-3.5" /> Automation Engine
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 tracking-tight">
              Automate <span className="font-editorial font-normal" style={{ color: "#c4bcff" }}>growth.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 font-normal max-w-xl">
              Capture leads and reply to comments instantly with smart Instagram DMs. Designed to run completely on autopilot.
            </p>
          </motion.div>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden px-4 pt-6 pb-2">
        <div className="flex flex-col gap-4">
          <div>
            <p className={kickerCls}>Automation Engine</p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mt-1.5">
              Automate <span className="font-editorial font-normal" style={{ color: PRIMARY }}>growth.</span>
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm font-medium">Smart Instagram DMs, running entirely on autopilot.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <Button onClick={onOpenCreationModal} size="sm" className="rounded-full text-white h-11 px-5 font-semibold shadow-md flex-1" style={{ backgroundColor: PRIMARY }}>
              <Plus className="size-4 mr-1.5" /> New Automation
            </Button>
            <Button onClick={onOpenSettings} variant="outline" size="sm" className="rounded-full border-[#e6e1d6] bg-white text-zinc-800 h-11 px-4 shadow-sm">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 md:-mt-14 relative z-20 pb-8 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          <div className={`${cardCls} p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5742f5]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className={kickerCls}>Total DMs Sent</div>
            <div className="flex items-center justify-between mt-4 md:mt-6 relative z-10">
              <span className="text-3xl md:text-5xl font-medium text-zinc-900 tracking-tighter">
                {stats.totalDmsSent}
              </span>
              <div className="p-3 rounded-2xl bg-[#5742f5]/10">
                <Send className="size-5 md:size-6" style={{ color: PRIMARY }} />
              </div>
            </div>
          </div>

          <div className={`${cardCls} p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5742f5]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 relative z-10">
              <span className={kickerCls}>Followers Gained</span>
              <div className="relative group/tooltip flex items-center">
                <div className="cursor-help text-zinc-400 hover:text-zinc-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-64 text-white text-xs font-normal p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none" style={{ backgroundColor: INK }}>
                  Calculated as total account growth since automations were first activated.
                  <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent" style={{ borderTopColor: INK }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 md:mt-6 relative z-10">
              <span className="text-3xl md:text-5xl font-medium text-zinc-900 tracking-tighter">
                {stats.totalFollowersGained}
              </span>
              <div className="p-3 rounded-2xl bg-[#5742f5]/10">
                <UserPlus className="size-5 md:size-6" style={{ color: PRIMARY }} />
              </div>
            </div>
          </div>

          <div className={`${cardCls} p-5 md:p-6 flex flex-col justify-between col-span-2 md:col-span-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5742f5]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className={kickerCls}>Total Comments Triggered</div>
            <div className="flex items-center justify-between mt-4 md:mt-6 relative z-10">
              <span className="text-3xl md:text-5xl font-medium text-zinc-900 tracking-tighter">
                {stats.totalCommentsTriggered}
              </span>
              <div className="p-3 rounded-2xl bg-[#5742f5]/10">
                <MessageCircle className="size-5 md:size-6" style={{ color: PRIMARY }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
