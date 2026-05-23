'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ensure this path matches your setup

import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';
import FooterSection from '@/components/footer-one';
import FAQs from '@/components/faqs-section-two';

export default function Page() {
  const router = useRouter();
  
  // State to hide the page until we know if the user is logged in or not
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // This Firebase listener fires immediately when the app loads
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is found, instantly redirect them to the Dashboard
        router.push('/home-page');
      } else {
        // If no user is found, stop checking and render the landing page
        setIsChecking(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [router]);

  // While Firebase is checking the auth state, render nothing (or you could put a spinner here)
  if (isChecking) {
    return null; 
  }

  return (
    <main className="relative flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
        <Navbar />
        
        <div className='mt-20'>
          <AgencyHeroSection />
        </div>

        <div className='Question Serction'>
          <FAQs/>
        </div>

        <footer>
          <FooterSection/>
        </footer>
    </main>
  );
}