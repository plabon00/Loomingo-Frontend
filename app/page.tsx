'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import dynamic from 'next/dynamic'; 

import { motion, useScroll, useMotionValueEvent } from 'motion/react';

// STATIC IMPORTS (Above the fold - Loads instantly)
import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';

// DYNAMIC IMPORTS (Below the fold)
// Added a 'loading' state to prevent layout shift while downloading chunks
const SuperchargeSection = dynamic(() => import('@/components/SuperchargeSection/SuperchargeSection'), {
  ssr: false, 
  loading: () => <div className="min-h-[200vh] w-full bg-white" /> // Reserves space to prevent scroll jumping
});

const PotentialSection = dynamic(() => import('@/components/potential/PotentialSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const ProcessSection = dynamic(() => import('@/components/ProcessSection/ProcessSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const TestimonialSection = dynamic(() => import('@/components/TestimonialSection/TestimonialSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const FAQs = dynamic(() => import('@/components/faqs-section-two'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const FooterSection = dynamic(() => import('@/components/footer-one'));

export default function Page() {
  const router = useRouter();
  
  // Auth state
  const [isChecking, setIsChecking] = useState(true);
  
  // Scroll indicator state
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // Track global window scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();

  // Watch the scroll progress and hide the arrow when reaching the footer (~98% scrolled)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.98) {
      setIsAtBottom(true);
    } else if (isAtBottom && latest <= 0.98) {
      setIsAtBottom(false);
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home-page');
      } else {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return null; 
  }

  return (
    <main className="relative flex flex-col min-h-screen w-full">
        <Navbar />
        
        <div>
          <AgencyHeroSection />
        </div>

        <div>
          <SuperchargeSection />
        </div>

        <div>
          <PotentialSection />
        </div>

        <div>
          <ProcessSection />
        </div>

        <div>
          <TestimonialSection />
        </div>

        <div className='Question Section'>
          <FAQs />
        </div>

        <footer>
          <FooterSection />
        </footer>

        {/* GLOBAL SCROLL INDICATOR */}
        <motion.div 
          animate={{ 
            y: [0, 8, 0], 
            opacity: isAtBottom ? 0 : 1 
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 0.3 } 
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none text-red-950/40"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest mb-1">Scroll</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </motion.div>

    </main>
  );
}