import { Send, MessageCircle, MousePointerClick } from "lucide-react";

export default function MiniAnalytics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {/* Card 1 */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">DMs Sent (7d)</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-2xl md:text-3xl font-semibold text-red-950">1,248</span>
          <div className="p-2 bg-red-50 rounded-xl"><Send className="size-4 md:size-5 text-red-600" /></div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Comments Replied</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-2xl md:text-3xl font-semibold text-red-950">892</span>
          <div className="p-2 bg-blue-50 rounded-xl"><MessageCircle className="size-4 md:size-5 text-blue-600" /></div>
        </div>
      </div>

      {/* Card 3 - Hidden on smallest mobile screens to keep layout clean, or you can remove the hidden class */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex-col justify-between hover:shadow-md transition-shadow hidden sm:flex">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Total Link Clicks</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-2xl md:text-3xl font-semibold text-red-950">435</span>
          <div className="p-2 bg-green-50 rounded-xl"><MousePointerClick className="size-4 md:size-5 text-green-600" /></div>
        </div>
      </div>
    </div>
  );
}