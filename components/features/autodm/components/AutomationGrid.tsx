import { Plus, Settings, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import AutomationMediaCard from "@/components/ui/automation-card";
import { AutomationCardDTO } from "../types";

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
  onOpenCreationModal,
  onOpenSettings,
  onEdit,
  onDelete,
  onToggleStatus,
}: AutomationGridProps) {
  return (
    <>
      {/* Mobile Actions */}
      <div className="mt-6 flex gap-3 md:hidden w-full items-center px-4 sm:px-6">
        <Button
          onClick={onOpenCreationModal}
          className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white h-11 px-4 text-sm font-semibold shadow-md transition-colors"
        >
          <Plus className="mr-1.5 size-4" /> Create Automation
        </Button>

        <Button
          onClick={onOpenSettings}
          variant="outline"
          size="icon"
          className="rounded-xl h-11 w-11 bg-white border border-zinc-200 text-zinc-900 shadow-sm shrink-0"
        >
          <Settings className="size-5" />
        </Button>
      </div>

      {/* --- AUTOMATIONS GRID SECTION WITH TABS --- */}
      <div className="mt-12 mb-8 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-medium text-zinc-900 flex items-center gap-2">
            Your Automations
            <span className="text-zinc-400 text-xl font-normal">
              ({automations.length})
            </span>
          </h2>

          <div className="flex items-center bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-sm w-fit">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                filterTab === "all" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab("active")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                filterTab === "active" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterTab("inactive")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                filterTab === "inactive" ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-zinc-400">
            <Loader2 className="size-8 animate-spin" />
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
              <div className="col-span-full py-20 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200 border-dashed flex flex-col items-center justify-center gap-3">
                <Zap className="size-10 text-zinc-300" />
                <p>No automations found in this tab.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
