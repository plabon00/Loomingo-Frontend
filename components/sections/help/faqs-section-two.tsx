'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does the Instagram DM automation work?',
            answer: 'Loomin connects to your Instagram account via official APIs. Once set up, you can define specific triggers—like a user commenting a keyword on your post—and our system will automatically send a pre-configured DM to that user.',
        },
        {
            id: 'item-2',
            question: 'Is this safe for my Instagram account?',
            answer: 'Absolutely. Loomin operates entirely within Instagram’s official guidelines. We prioritize your account safety by adhering to rate limits and ensuring all automated interactions mimic natural behavior.',
        },
        {
            id: 'item-3',
            question: 'Can I customize the automated DM responses?',
            answer: 'Yes! You have full control over your messaging. You can create multiple response templates, use dynamic placeholders for personalization, and A/B test your messages to see what converts best.',
        },
        {
            id: 'item-4',
            question: 'Will it work if I have multiple Instagram accounts?',
            answer: "Loomin is built for creators and agencies. You can easily manage and switch between multiple connected Instagram accounts from a single dashboard to automate growth across your entire portfolio.",
        },
        {
            id: 'item-5',
            question: 'Do I need to keep the app open to run automations?',
            answer: 'Not at all. Once you have configured your automation rules in the Loomin dashboard, our cloud-based infrastructure handles the rest 24/7, even when you are offline or sleeping.',
        },
    ]

    return (
        <section className="relative py-16 md:py-32 bg-white overflow-hidden w-full flex justify-center">
            
            {/* Background Glow Effect */}
            <div 
                className="absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] bg-red-400 rounded-full opacity-30 md:opacity-20 blur-[120px] md:blur-[160px] pointer-events-none z-0"
                aria-hidden="true"
            />

            <div className="w-full max-w-6xl px-4 relative z-10">
                <div className="grid gap-10 md:grid-cols-12 md:gap-12 items-start">
                    
                    {/* LEFT SIDE: Header & Support Link */}
                    <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left md:sticky md:top-32">
                        
                        <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-zinc-200 bg-white/50 text-red-950 text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm shadow-sm">
                            Support
                        </div>
                        
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-red-950 leading-[1.1] tracking-tight">
                            Common <br className="hidden md:block" />
                            <span className="text-red-600 italic font-serif">questions</span>
                        </h2>
                        
                        <p className="text-sm md:text-lg text-red-950/70 mt-4 md:mt-6 max-w-xs md:max-w-sm">
                            Everything you need to know about Loomin, how it works, and how it keeps your account safe.
                        </p>

                        <div className="hidden md:flex items-center gap-2 mt-8 px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl w-full max-w-sm">
                            <div className="text-2xl">👋</div>
                            <div>
                                <p className="text-sm font-medium text-red-950">Still have questions?</p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Reach out to our{' '}
                                    <Link href="#" className="text-red-600 font-medium hover:underline">
                                        support team
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Separated Accordion Cards */}
                    <div className="md:col-span-7">
                        {/* Adding gap-4 separates the items into individual cards */}
                        <Accordion type="single" collapsible className="w-full flex flex-col gap-3 md:gap-4">
                            {faqItems.map((item) => (
                                <AccordionItem 
                                    key={item.id} 
                                    value={item.id} 
                                    // Removes the default bottom border and creates a solid white card
                                    className="bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-2xl px-5 md:px-6 shadow-sm data-[state=open]:bg-white data-[state=open]:shadow-md transition-all duration-300"
                                >
                                    <AccordionTrigger className="cursor-pointer text-left text-red-950 text-sm md:text-base font-semibold hover:no-underline py-5 md:py-6">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-600 text-sm md:text-base leading-relaxed pb-6 md:pb-8 pr-4 md:pr-8">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Mobile Support Link */}
                    <div className="md:hidden flex items-center justify-center gap-2 mt-2 px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl w-full">
                        <div className="text-2xl">👋</div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-red-950">Still have questions?</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Reach out to our{' '}
                                <Link href="#" className="text-red-600 font-medium hover:underline">
                                    support team
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}