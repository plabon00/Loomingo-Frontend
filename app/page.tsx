import Navbar from '@/components/shadcn-space/radix/blocks/navbar-01/navbar';
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { ScrollProgressBar, StatementDivider } from '@/components/home/home-scroll-fx';
import { SectionReveal } from '@/components/home/section-reveal';

import SuperchargeSection from '@/components/sections/marketing/SuperchargeSection';
import PotentialSection from '@/components/sections/marketing/PotentialSection';
import AutoDMFeatureSection from '@/components/sections/marketing/AutoDMFeatureSection';
import StoreFrontFeatureSection from '@/components/sections/marketing/StoreFrontFeatureSection';
import InvoiceGeneratorFeatureSection from '@/components/sections/marketing/InvoiceGeneratorFeatureSection';
import ProcessSection from '@/components/sections/process/ProcessSection';
import TestimonialSection from '@/components/sections/testimonial/TestimonialSection';
import CallToActionSection from '@/components/sections/marketing/CallToActionSection';
import FAQs from '@/components/sections/help/faqs-section-two';
import FooterSection from '@/components/layout/footer-one';

export default function Page() {
  return (
    <main className="relative flex flex-col min-h-screen w-full bg-[#0A0C10] overflow-x-hidden">

      {/* Dark theme graph-paper grid globally visible */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            /* Mask just to slightly soften the extreme edges, but mostly fully visible everywhere */
            maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
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



      {/* 1. High-Level Benefits - Why you need this */}
      <SectionReveal still>
        <SuperchargeSection />
      </SectionReveal>

      {/* 2. How It Works - Show them it's easy */}
      <SectionReveal>
        <ProcessSection />
      </SectionReveal>

      {/* 3. Editorial statement & Stats - Build authority before features */}
      <StatementDivider />

      {/* 4. Features Overview - 4 Pillars */}
      <SectionReveal>
        <PotentialSection />
      </SectionReveal>

      {/* 5. Deep Dive 1: Auto DM */}
      <SectionReveal>
        <AutoDMFeatureSection />
      </SectionReveal>

      {/* 6. Deep Dive 2: Storefront */}
      <SectionReveal>
        <StoreFrontFeatureSection />
      </SectionReveal>

      {/* 7. Deep Dive 3: Invoicing */}
      <SectionReveal>
        <InvoiceGeneratorFeatureSection />
      </SectionReveal>

      {/* 8. Social Proof / Testimonials */}
      <SectionReveal>
        <TestimonialSection />
      </SectionReveal>

      {/* 9. Objection Handling (FAQs) */}
      <SectionReveal>
        <FAQs />
      </SectionReveal>

      {/* 10. Final Push (CTA) */}
      <SectionReveal>
        <CallToActionSection />
      </SectionReveal>

      <footer>
        <FooterSection />
      </footer>

      {/* GLOBAL SCROLL INDICATOR */}
      <ScrollIndicator />

    </main>
  );
}

