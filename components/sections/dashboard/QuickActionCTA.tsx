import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuickActionCTA() {
  return (
    <div className="font-apple w-full mt-4">
      <Link href="/autodm" className="w-full block">
        <Button className="w-full rounded-full bg-[var(--apple-blue)] hover:bg-[var(--apple-blue-hover)] text-white h-14 text-[17px] font-medium shadow-none transition-colors duration-[240ms] group">
          <Plus className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-[320ms]" />
          Create New Automation
        </Button>
      </Link>
    </div>
  );
}
