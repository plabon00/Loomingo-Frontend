"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

// 1. Added a TypeScript interface to fix any 'any' type warnings
interface CardType {
  id: number;
  title: string;
  subtext: string;
  images: string[];
}

const cards: CardType[] = [
  {
    id: 1,
    title: "Maximise Link Clicks",
    subtext: "Stop relying on bio links. Instantly send clickable links via DM, amplifying clicks and conversion rates.",
    images: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Maximise Engagement",
    subtext: "Build deeper connections automatically. Reply to comments instantly and keep the conversation going in the DMs.",
    images: [
      "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Maximise Revenue",
    subtext: "Turn followers into buyers. Deliver targeted offers exactly when purchase intent is highest.",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
    ]
  }
];

const ScrollCard = ({ card, index, scrollYProgress }: { card: CardType, index: number, scrollYProgress: MotionValue<number> }) => {
  const isFirst = index === 0;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % card.images.length);
    }, 3000); 
    
    return () => clearInterval(timer);
  }, [card.images.length]);

  const opacity = isFirst 
    ? useTransform(scrollYProgress, [0, 0.1], [0, 1]) 
    : 1;

  let yScrollRange = [0, 1];
  let yPositions = [0, 0];

  if (isFirst) {
    yScrollRange = [0, 0.1];
    yPositions = [0, 0]; 
  } else if (index === 1) {
    yScrollRange = [0.2, 0.4];
    yPositions = [600, 20]; 
  } else if (index === 2) {
    yScrollRange = [0.5, 0.7];
    yPositions = [600, 40]; 
  }

  const y = useTransform(scrollYProgress, yScrollRange, yPositions);
  
  const scaleTarget = isFirst ? 0.94 : index === 1 ? 0.97 : 1;
  const scale = useTransform(scrollYProgress, yScrollRange, [0.9, scaleTarget]);

  return (
    <motion.div 
      style={{ opacity, y, scale, zIndex: index + 10 }}
      className="absolute top-0 left-0 w-full aspect-[4/5] sm:aspect-[4/4] bg-white border border-zinc-200 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-xl flex flex-col origin-top"
    >
      <div className="mb-4 shrink-0">
        <h3 className="text-xl sm:text-2xl font-bold text-red-950 mb-1.5 tracking-tight">
          {card.title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          {card.subtext}
        </p>
      </div>
      
      <div className="w-full flex-1 bg-zinc-100 rounded-xl sm:rounded-2xl border border-zinc-200/50 overflow-hidden relative">
        {card.images.map((imgUrl: string, idx: number) => (
          <motion.img 
            key={idx}
            src={imgUrl} 
            alt={`${card.title} screenshot ${idx + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentImageIndex === idx ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
      </div>
    </motion.div>
  );
};

const SuperchargeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. FIX: Removed the invalid JSX comment from the return statement
  return (
    <section ref={containerRef} className="relative w-full bg-white h-[200vh]">
      
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">

        <div 
          className="absolute top-1/2 left-1/2 md:left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-400 rounded-full opacity-[0.15] md:opacity-10 blur-[100px] md:blur-[140px] pointer-events-none z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 h-full pt-12 pb-8 md:py-20">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-5/12 shrink-0 md:pt-0">
            <div className="inline-flex items-center px-3 py-1.5 md:px-4 rounded-full border border-zinc-200 bg-white/80 text-red-950 text-xs md:text-sm font-semibold mb-4 md:mb-6 backdrop-blur-sm shadow-sm tracking-wider uppercase">
              Scalable Growth
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-red-950 leading-[1.1] mb-4 md:mb-6 tracking-tight">
              Skyrocket Your <br className="hidden sm:block" />
              Social Reach <br className="hidden sm:block" />
              <span className="text-red-600 italic font-serif tracking-tight drop-shadow-sm">
                by 10X
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-medium max-w-[320px] sm:max-w-md leading-relaxed">
              Stop losing leads in your comments section. Turn every interaction into a high-converting conversation.
            </p>
          </div>

          <div className="w-full md:w-6/12 relative h-[420px] sm:h-[480px] max-w-[340px] md:max-w-md mx-auto md:mx-0 flex justify-center perspective-[1000px]">
            <div className="relative w-full h-full">
              {cards.map((card, index) => (
                <ScrollCard 
                  key={card.id} 
                  card={card} 
                  index={index} 
                  scrollYProgress={scrollYProgress} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SuperchargeSection;