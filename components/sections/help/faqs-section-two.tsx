"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, ShieldCheck, Settings, 
  Bot, Zap, Users, 
  ShoppingBag, CreditCard, Box, ChevronDown
} from 'lucide-react';

export default function FAQs() {
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const faqCategories = [
        {
            title: "General",
            items: [
                {
                    icon: Clock,
                    question: "How long does setup take?",
                    answer: "You can connect your Instagram account and launch your first automation in under 5 minutes. No coding required."
                },
                {
                    icon: ShieldCheck,
                    question: "Is this safe for my account?",
                    answer: "Absolutely. Loomingo operates entirely within Instagram’s official API guidelines. Your account security is our top priority."
                },
                {
                    icon: Settings,
                    question: "Can I customize the responses?",
                    answer: "Yes! You have full control. Create unlimited response templates and use dynamic placeholders to personalize every message."
                }
            ]
        },
        {
            title: "Automation Engine",
            items: [
                {
                    icon: Bot,
                    question: "How do the triggers work?",
                    answer: "You define specific keywords. When a user comments that keyword on your post or Reel, Loomingo instantly sends them a pre-configured DM."
                },
                {
                    icon: Zap,
                    question: "Does it run 24/7?",
                    answer: "Yes. Once configured, our cloud infrastructure handles your automations around the clock, even while you sleep."
                },
                {
                    icon: Users,
                    question: "Can I manage multiple accounts?",
                    answer: "Yes, our platform is built for creators and agencies. You can easily manage multiple Instagram accounts from a single dashboard."
                }
            ]
        },
        {
            title: "Store Front & Invoicing",
            items: [
                {
                    icon: ShoppingBag,
                    question: "How do users make a purchase?",
                    answer: "Your followers can browse your digital storefront and complete purchases directly through the link sent in their DMs."
                },
                {
                    icon: CreditCard,
                    question: "What payment methods are supported?",
                    answer: "We support all major payment gateways including Stripe and PayPal, allowing you to accept Credit Cards, Apple Pay, and Google Pay."
                },
                {
                    icon: Box,
                    question: "Are invoices generated automatically?",
                    answer: "Yes. The moment a transaction is completed, a professional, branded invoice is generated and sent directly to your customer."
                }
            ]
        }
    ];

    return (
        <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
            <div className="relative w-full">
                {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
                <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

                <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 px-6 md:px-12 rounded-[40px] overflow-hidden border border-white/20">
                
                {/* Header */}
                <div className="max-w-4xl mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                        FAQs
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg">
                        Discover quick and comprehensive answers to common questions about our platform, automations, and features.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-4">
                    {faqCategories.map((category, idx) => {
                        const isActive = activeCategory === idx;
                        
                        return (
                        <div key={idx} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                            {/* Category Title & Dropdown Toggle */}
                            <button 
                                onClick={() => setActiveCategory(isActive ? -1 : idx)}
                                className="w-full flex items-center justify-between p-6 md:px-8 md:py-6 cursor-pointer hover:bg-white/[0.02] transition-colors text-left"
                            >
                                <h3 className={`text-xl font-semibold transition-colors ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                    {category.title}
                                </h3>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-red-500/10 border-red-500/20 text-red-500 rotate-180' : 'border-white/10 text-zinc-500'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-8 md:px-8 pt-2">
                                            {/* 3-Column Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 border-t border-white/5 pt-8">
                                                {category.items.map((item, itemIdx) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <div key={itemIdx} className="flex flex-col">
                                                            <div className="size-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-5">
                                                                <Icon className="w-5 h-5 text-zinc-300" />
                                                            </div>
                                                            <h4 className="text-base font-semibold text-white mb-3">
                                                                {item.question}
                                                            </h4>
                                                            <p className="text-sm text-zinc-400 leading-relaxed">
                                                                {item.answer}
                                                            </p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        )
                    })}
                </div>

                </div>
            </div>
        </section>
    );
}