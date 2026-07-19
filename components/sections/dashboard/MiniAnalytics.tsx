import { Send, MessageCircle, MousePointerClick } from "lucide-react";

export default function MiniAnalytics() {
  return (
    <div className="flex flex-wrap gap-3 w-full">
      {/* Pill 1 */}
      <div className="gsap-pill-item flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] transition-all duration-200 min-w-[160px] flex-1">
        <div className="p-2 bg-red-50 rounded-full">
          <Send className="size-4 md:size-5 text-red-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">DMs Sent (7d)</span>
          <span className="text-xl md:text-2xl font-semibold text-red-950">1,248</span>
        </div>
      </div>

      {/* Pill 2 */}
      <div className="gsap-pill-item flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] transition-all duration-200 min-w-[160px] flex-1">
        <div className="p-2 bg-blue-50 rounded-full">
          <MessageCircle className="size-4 md:size-5 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Comments Replied</span>
          <span className="text-xl md:text-2xl font-semibold text-red-950">892</span>
        </div>
      </div>

      {/* Pill 3 */}
      <div className="gsap-pill-item flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] transition-all duration-200 min-w-[160px] flex-1 hidden sm:flex">
        <div className="p-2 bg-green-50 rounded-full">
          <MousePointerClick className="size-4 md:size-5 text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Link Clicks</span>
          <span className="text-xl md:text-2xl font-semibold text-red-950">435</span>
        </div>
      </div>
    </div>
  );
}