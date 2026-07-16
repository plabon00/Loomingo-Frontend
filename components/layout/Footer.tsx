import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-zinc-200/60 bg-zinc-50/50 text-center">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-6">
        
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
          <Link href="/about" className="hover:text-zinc-900 transition-colors">About Us</Link>
          <Link href="/help" className="hover:text-zinc-900 transition-colors">Help & Support</Link>
          <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5">
          <p className="text-zinc-500 text-sm font-medium">
            Powered by <span className="font-bold text-zinc-900 tracking-tight">Loomingo</span>
          </p>
          <p className="text-zinc-400 text-xs">
            © {new Date().getFullYear()} Loomingo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
