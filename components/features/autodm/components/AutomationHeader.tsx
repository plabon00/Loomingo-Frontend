import {
  Plus,
  Send,
  UserPlus,
  Zap,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AutomationStatsDTO } from "../types";

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
  return (
    <>
      {/* BRAND CONSISTENT HEADER UI */}
      <div className="relative w-full bg-white border-b border-zinc-200 pb-24 pt-8 px-4 lg:px-8 overflow-hidden max-md:hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500 rounded-full opacity-[0.05] blur-[120px] pointer-events-none z-0"
          aria-hidden="true"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
          <div className="hidden md:flex items-center justify-end w-full gap-4">
            <Field
              orientation="horizontal"
              className="flex items-center gap-2 w-[350px]"
            >
              <Input
                type="search"
                placeholder="Search automations..."
                className="w-full bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-300 h-10 rounded-full px-4 shadow-sm"
              />
            </Field>

            <Button
              onClick={onOpenSettings}
              variant="outline"
              className="h-10 rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 px-5 shadow-sm transition-colors"
            >
              <Settings className="mr-2 size-4" /> Settings
            </Button>

            <Button
              onClick={onOpenCreationModal}
              className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md h-10 px-6 text-sm font-medium transition-colors"
            >
              <Plus className="mr-2 size-4" /> Create Automation
            </Button>
          </div>

          <div className="flex flex-col items-start justify-center mt-12 mb-4 text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-900 text-sm font-medium mb-4 shadow-sm">
              Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-zinc-900 mb-3 tracking-tight hidden md:block">
              Auto-DM <span className="text-red-600 italic font-serif tracking-tight">automations</span>
            </h1>
            <p className="text-sm md:text-lg text-zinc-500 font-normal max-w-xl hidden md:block">
              Automate your DMs, capture leads, and grow your audience effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* STATS & CARDS UI */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4 md:-mt-12 relative z-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Total DM Sent
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.totalDmsSent}
              </span>
              <div className="p-3 bg-zinc-100 rounded-xl">
                <Send className="size-5 md:size-6 text-zinc-700" />
              </div>
            </div>
          </Card>
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Followers Gained
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.totalFollowersGained}
              </span>
              <div className="p-3 bg-zinc-100 rounded-xl">
                <UserPlus className="size-5 md:size-6 text-zinc-700" />
              </div>
            </div>
          </Card>
          <Card className="p-6 shadow-sm border border-zinc-200 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col justify-between col-span-2 md:col-span-1 transition-shadow hover:shadow-md">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Active Automations
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight">
                {stats.activeAutomationsCount}
              </span>
              <div className="p-3 bg-red-50 rounded-xl">
                <Zap className="size-5 md:size-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
