"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CallToActionSection() {
    return (
        <section className="relative w-full py-12 lg:py-24 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
            <div className="relative w-full">
                {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
                <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

                <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-16 lg:py-24 rounded-[40px] overflow-hidden border border-white/20">
                
                <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl xl:text-6xl text-white">
                        Ready to put your <br className="hidden sm:block" />
                        <span className="font-editorial text-red-400">Instagram on autopilot?</span>
                    </h2>

                    <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
                        Join thousands of creators and agencies using Loomingo to automatically reply to comments, engage followers in DMs, and drive sales 24/7.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="bg-red-600 hover:bg-red-500 text-white border-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] px-8 h-12 text-base font-semibold rounded-full"
                        >
                            <Link href="#">Get Started</Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="bg-white/[0.05] border-white/10 text-white hover:bg-white/10 hover:text-white px-8 h-12 text-base font-semibold backdrop-blur-sm rounded-full"
                        >
                            <Link href="#">Get a Demo</Link>
                        </Button>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}
