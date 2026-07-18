import { Loader2, Zap } from "lucide-react";
import AutomationMediaCard from "@/components/ui/automation-card";
import { AutomationCardDTO } from "../types";

// ————— Theme tokens —————
const INK = "#19152b";
const PRIMARY = "#5742f5";

interface AutomationGridProps {
  automations: AutomationCardDTO[];
  filteredAutomations: AutomationCardDTO[];
  isLoading: boolean;
  filterTab: "all" | "active" | "inactive";
  setFilterTab: (tab: "all" | "active" | "inactive") => void;
  onOpenCreationModal: () => void;
  onOpenSettings: () => void;
  onEdit: (automation: AutomationCardDTO) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export function AutomationGrid({
  automations,
  filteredAutomations,
  isLoading,
  filterTab,
  setFilterTab,
  onEdit,
  onDelete,
  onToggleStatus,
}: AutomationGridProps) {
  return (
    <>
      {/* --- AUTOMATIONS GRID SECTION WITH TABS --- */}
      <div className="mt-12 mb-8 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-semibold flex items-center gap-2 tracking-tight" style={{ color: INK }}>
            Your Automations
            <span className="text-zinc-400 text-xl font-normal">
              ({automations.length})
            </span>
          </h2>

          <div className="flex items-center p-1.5 rounded-xl border shadow-sm w-fit bg-[#f6f4ef] border-[#e6e1d6]">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                filterTab === "all" ? "bg-white shadow text-[#19152b]" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab("active")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                filterTab === "active" ? "bg-white shadow text-[#19152b]" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterTab("inactive")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                filterTab === "inactive" ? "bg-white shadow text-[#19152b]" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-zinc-400">
            <Loader2 className="size-8 animate-spin" style={{ color: PRIMARY }} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredAutomations.map((automation) => (
              <AutomationMediaCard
                key={automation.id}
                id={automation.id}
                thumbnailUrl={automation.thumbnailUrl}
                caption={automation.caption}
                username={automation.username}
                isActive={automation.isActive}
                followersGained={automation.followersGained || 0}
                dmsSent={automation.dmsSent || 0}
                mediaType={automation.mediaType || "POST"}
                triggerKeyword={automation.triggerKeyword || []}
                onEdit={() => onEdit(automation)}
                onDelete={() => onDelete(automation.id)}
                onToggle={() => onToggleStatus(automation.id, automation.isActive)}
              />
            ))}

            {filteredAutomations.length === 0 && (
              <div className="col-span-full py-20 text-center text-zinc-500 bg-white rounded-3xl border border-dashed flex flex-col items-center justify-center gap-3 border-[#e6e1d6]">
                <Zap className="size-10 opacity-20" style={{ color: PRIMARY }} />
                <p className="font-medium text-zinc-500">No automations found in this tab.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
