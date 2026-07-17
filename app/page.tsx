import dynamic from 'next/dynamic';

// STATIC IMPORTS (Above the fold - Loads instantly)
import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';

// Scroll Indicator
import ScrollIndicator from '@/components/ui/ScrollIndicator';

// DYNAMIC IMPORTS (Below the fold)
const SuperchargeSection = dynamic(() => import('@/components/sections/marketing/SuperchargeSection'), {
  loading: () => <div className="min-h-[200vh] w-full bg-white" /> 
});

const PotentialSection = dynamic(() => import('@/components/sections/marketing/PotentialSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const ProcessSection = dynamic(() => import('@/components/sections/process/ProcessSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const TestimonialSection = dynamic(() => import('@/components/sections/testimonial/TestimonialSection'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const FAQs = dynamic(() => import('@/components/sections/help/faqs-section-two'), {
  loading: () => <div className="min-h-screen w-full bg-transparent" />
});

const FooterSection = dynamic(() => import('@/components/layout/footer-one'));

export default function Page() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-white">
      {/* Graph paper style major/minor grid background with faded corners */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(156, 163, 175, 0.20) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.20) 1px, transparent 1px),
              linear-gradient(to right, rgba(156, 163, 175, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)'
          }}
        ></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
      </div>

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
        <ScrollIndicator />

    </main>
  );
}