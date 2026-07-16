import React from "react";

export function GridBackground({ 
  children, 
  className = "",
  themeColor
}: { 
  children?: React.ReactNode; 
  className?: string;
  themeColor?: string;
}) {
  return (
    <div className={`relative min-h-screen w-full text-zinc-900 overflow-hidden bg-zinc-100 ${className}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        
        {/* Soft Ambient Brand Glow */}
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] blur-[120px] rounded-[100%]" 
          style={{ backgroundColor: themeColor ? `${themeColor}20` : 'rgba(220, 38, 38, 0.1)' }}
        />
        
        {/* Grid Pattern with Radial Fade Mask */}
        <div 
          className="absolute inset-0" 
          style={{
            maskImage: "radial-gradient(ellipse 150% 150% at 50% 30%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 150% 150% at 50% 30%, black 20%, transparent 100%)"
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ color: themeColor || '#a1a1aa', opacity: 0.15 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="scatter-pattern"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                {/* Heart */}
                <svg x="15" y="20" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {/* Star */}
                <svg x="70" y="15" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {/* Zap */}
                <svg x="40" y="70" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {/* Smile */}
                <svg x="90" y="75" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                {/* Shopping Bag */}
                <svg x="10" y="100" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scatter-pattern)" />
          </svg>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
