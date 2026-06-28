import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuickActionCTA() {
  return (
    <div className="w-full mt-4">
      <Link href="/auto-dm" className="w-full block">
        <Button className="w-full rounded-2xl bg-red-950 hover:bg-red-900 text-white shadow-md hover:shadow-lg h-14 text-sm font-semibold transition-all group">
          <Plus className="mr-2 size-5 transition-transform group-hover:rotate-90" /> 
          Create New Automation
        </Button>
      </Link>
    </div>
  );
}