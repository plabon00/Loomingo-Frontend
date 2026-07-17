import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/ui/transition-link";
import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import FooterSection from '@/components/layout/footer-one';

export default function NotFound() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-white">
      <Navbar forceSticky />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-20 mb-20">
        <div className="w-full max-w-md md:max-w-lg mb-6 animate-in fade-in zoom-in-95 duration-700">
          <img 
            src="/annimation/404 error page with cat.svg" 
            alt="404 Not Found" 
            className="w-full h-auto drop-shadow-sm pointer-events-none"
          />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150">
          Oops! Page Not Found
        </h2>
        
        <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm md:text-base animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
          It looks like this page took a nap or ran away. Let's get you back to safety.
        </p>

        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
          <TransitionLink href="/home-page">
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl hover:shadow-2xl h-12 px-8 text-base font-semibold transition-all hover:scale-[1.02]">
              Return Home
            </Button>
          </TransitionLink>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
