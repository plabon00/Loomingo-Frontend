import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuickActionCTA() {
  return (
    <div className="w-full mt-4">
      <Link href="/auto-dm" className="w-full block">
        <Button className="w-full rounded-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-[0_4px_24px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_32px_rgba(220,38,38,0.50)] h-14 text-sm font-semibold transition-all duration-300 active:scale-[0.98] group">
          <Plus className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-300" />
          Create New Automation
        </Button>
      </Link>
    </div>
  );
}