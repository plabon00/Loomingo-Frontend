import Link from "next/link";
import HowItWorks from "@/components/ui/how-it-work";
import UpcomingFeatures from "@/components/upcoming-featurs";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import GettingStartedGuide from "@/components/Dashboard/TutorialCard";

import { 
  MobileNavbar, 
  BottomDock, 
  DesktopSidebar 
} from "@/components/AppNavigation"; 

export default function HomePage() {
  type FooterLink = {
    title: string;
    href: string;
    disabled: boolean;
    badge?: string;
  };

  const footerLinks: Record<string, FooterLink[]> = {
    Product: [
        { title: 'DM Automation', href: '#', disabled: false },
        { title: 'Follow Gate Links', href: '#', disabled: false },
        { title: 'Lead Capture Forms', href: '#', disabled: true ,badge: 'Coming Soon'},
        { title: 'AI Sales Assistant', href: '#', disabled: true, badge: 'Coming Soon' },
        { title: 'Advanced Analytics', href: '#', disabled: true, badge: 'Coming Soon' },
    ],
    Company: [
        { title: 'About Us', href: '#', disabled: false },
        { title: 'Pricing', href: '#', disabled: false },
        { title: 'Help Center', href: '#', disabled: false },
        { title: 'Careers', href: '#', disabled: true, badge: 'Hiring' },
    ],
    Legal: [
        { title: 'Privacy Policy', href: '#', disabled: false },
        { title: 'Terms & Conditions', href: '#', disabled: false },
        { title: 'Cookie Policy', href: '#', disabled: false },
    ]
  };

  return (
    <div className="w-full relative flex flex-col items-center bg-white min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 font-sans overflow-x-hidden">
      
      {/* Signature Red Glow Background */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-red-400 rounded-full opacity-[0.15] blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* LAYOUT COMPONENTS */}
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      {/* Main Page Content */}
      <div className="w-full flex flex-col items-center justify-start max-w-6xl mx-auto px-4 relative z-10">
        
        {/* INTERACTIVE DASHBOARD SECTION */}
        <DashboardContent />

        {/* GUIDES & ROADMAP (Tighter spacing) */}
        <div className="w-full flex flex-col gap-8 mt-2 pb-8">
          <GettingStartedGuide />
          <HowItWorks />
          <UpcomingFeatures />
        </div>

      </div>

      <footer className="relative bg-white pt-24 pb-8 overflow-hidden w-full border-t border-zinc-100 flex flex-col items-center">
          
          {/* Subtle Brand Glow */}
          <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-200 h-100 bg-red-400 rounded-full opacity-[0.15] blur-[160px] pointer-events-none z-0"
              aria-hidden="true"
          />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 relative z-10 flex flex-col items-center">
              
              {/* Main Footer Content Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 border-b border-zinc-200 pb-12">
                  
                  {/* Brand & Social Column */}
                  <div className="md:col-span-4 flex flex-col items-start text-left">
                      <Link
                          href="/"
                          aria-label="go home"
                          className="block shrink-0 transition-transform hover:scale-105 active:scale-95 mb-6"
                      >
                          <img 
                              src="/icon.png" 
                              alt="Loomingo Logo" 
                              className="h-10 md:h-12 w-auto object-contain" 
                          />
                      </Link>
                      <p className="text-sm text-red-950/60 leading-relaxed max-w-xs mb-8">
                          Automate your Instagram growth, turn comments into conversations, and scale your revenue effortlessly.
                      </p>
                      
                      {/* Social Icons */}
                      <div className="flex gap-4 text-red-950/40">
                          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-red-600 transition-colors duration-200">
                              <svg className="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                              </svg>
                          </Link>
                          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-red-600 transition-colors duration-200">
                              <svg className="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
                              </svg>
                          </Link>
                          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-red-600 transition-colors duration-200">
                              <svg className="size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                              </svg>
                          </Link>
                      </div>
                  </div>

                  {/* Links Columns */}
                  <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-4">
                      {Object.entries(footerLinks).map(([category, links]) => (
                          <div key={category} className="flex flex-col">
                              <h3 className="font-semibold text-red-950 mb-4">{category}</h3>
                              <ul className="flex flex-col gap-3">
                                  {links.map((link, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                          <Link
                                              href={link.disabled ? "#" : link.href}
                                              aria-disabled={link.disabled}
                                              tabIndex={link.disabled ? -1 : 0}
                                              className={`text-sm font-medium transition-colors duration-200 
                                                  ${link.disabled 
                                                      ? "text-red-950/30 pointer-events-none cursor-not-allowed" 
                                                      : "text-red-950/70 hover:text-red-600"
                                                  }`}
                                          >
                                              {link.title}
                                          </Link>
                                          
                                          {/* Badge for "Coming Soon" or "Hiring" */}
                                          {link.badge && (
                                              <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm 
                                                  ${link.disabled ? "bg-zinc-100 text-zinc-400" : "bg-red-100 text-red-600"}
                                              `}>
                                                  {link.badge}
                                              </span>
                                          )}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>
              </div>
              
              {/* Copyright */}
              <div className="text-red-950/50 font-medium text-xs sm:text-sm mt-8 mb-4 sm:mb-12"> 
                  © 2026 Loomingo, All rights reserved 
              </div>
          </div>

          {/* GIANT BACKGROUND TEXT */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0">
              <span className="text-[18vw] font-black text-red-500/10 leading-[0.75] tracking-tighter">
                  LOOMINGO
              </span>
          </div>
          
      </footer>
    </div>
  );
}