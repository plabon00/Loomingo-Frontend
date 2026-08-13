"use client";

import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { MousePointerClick, MessageCircleHeart, TrendingUp } from "lucide-react";

interface CardType {
  id: number;
  title: string;
  subtext: string;
  icon: React.ElementType;
}

const cards: CardType[] = [
  {
    id: 1,
    title: "Maximise Link Clicks",
    subtext: "Stop relying on bio links. Instantly send clickable links via DM, amplifying clicks and conversion rates.",
    icon: MousePointerClick
  },
  {
    id: 2,
    title: "Maximise Engagement",
    subtext: "Build deeper connections automatically. Reply to comments instantly and keep the conversation going in the DMs.",
    icon: MessageCircleHeart
  },
  {
    id: 3,
    title: "Maximise Revenue",
    subtext: "Turn followers into buyers. Deliver targeted offers exactly when purchase intent is highest.",
    icon: TrendingUp
  }
];

const SuperchargeSection: React.FC = () => {

  return (
    <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20 flex flex-col">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">

          {/* HEADER SECTION */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs md:text-sm font-medium mb-6">
              SCALABLE GROWTH
            </div>
            
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Skyrocket Your Social Reach by <span className="text-red-500">10X</span>
            </h2>
          </div>

          {/* CARDS GRID */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 w-full border-t border-l border-white/10 rounded-tl-3xl rounded-bl-none lg:rounded-bl-3xl overflow-hidden bg-transparent"
          >
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
              <div
                key={card.id}
                className="flex flex-col p-6 lg:p-8 border-b border-r border-white/10 hover:bg-white/[0.02] transition-colors relative group min-h-[300px]"
              >
                {/* ICON AREA */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                    <Icon className="w-7 h-7 text-red-500" />
                  </div>
                </div>

                {/* TEXT AREA */}
                <div className="mt-auto flex flex-col">
                  <h3 className="text-lg font-medium text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {card.subtext}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default SuperchargeSection;