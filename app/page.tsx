import dynamic from 'next/dynamic';

// STATIC IMPORTS (Above the fold - Loads instantly)
import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';

// Scroll Indicator
import ScrollIndicator from '@/components/ui/ScrollIndicator';

// GSAP ScrollTrigger effects (client components)
import { ScrollProgressBar, MarqueeBand, StatementDivider } from '@/components/home/home-scroll-fx';
import { SectionReveal } from '@/components/home/section-reveal';

// DYNAMIC IMPORTS (Below the fold)
const SuperchargeSection = dynamic(() => import('@/components/sections/marketing/SuperchargeSection'), {
  loading: () => <div className="min-h-[200vh] w-full bg-transparent" />
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
    <main className="relative flex flex-col min-h-screen w-full bg-[#faf7f2]">
      {/* Warm graph-paper grid — crimson-tinted lines on ivory, faded corners */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(153, 27, 27, 0.10) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(153, 27, 27, 0.10) 1px, transparent 1px),
              linear-gradient(to right, rgba(153, 27, 27, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(153, 27, 27, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 90%)'
          }}
        ></div>
      </div>

      {/* GSAP scroll progress bar */}
      <ScrollProgressBar />

      <div className="relative z-[100]">
        <Navbar />
      </div>

      <div>
        <AgencyHeroSection />
      </div>

      {/* Tilted counter-scrolling marquee — bridges hero into the page */}
      <MarqueeBand />

      {/* Sticky-pinned section: manages its own scroll, don't transform it */}
      <SectionReveal still>
        <SuperchargeSection />
      </SectionReveal>

      {/* Editorial statement with word-by-word ink reveal + count-up stats */}
      <StatementDivider />

      <SectionReveal still>
        <PotentialSection />
      </SectionReveal>

      <SectionReveal still>
        <ProcessSection />
      </SectionReveal>

      <SectionReveal>
        <TestimonialSection />
      </SectionReveal>

      <SectionReveal>
        <FAQs />
      </SectionReveal>

      <footer>
        <FooterSection />
      </footer>

      {/* GLOBAL SCROLL INDICATOR */}
      <ScrollIndicator />

    </main>
  );
}

