import dynamic from 'next/dynamic'; 

// STATIC IMPORTS (Above the fold - Loads instantly)
import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';

// Client Wrapper for Auth
import ClientAuthRedirect from '@/components/features/auth/ClientAuthRedirect';

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
    <ClientAuthRedirect>
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
          <ScrollIndicator />

      </main>
    </ClientAuthRedirect>
  );
}