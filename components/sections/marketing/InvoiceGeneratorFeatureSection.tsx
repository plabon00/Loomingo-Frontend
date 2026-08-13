"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Receipt,
  DollarSign,
  FileText,
  Calendar,
  Mail,
  Calculator,
  FileCheck,
  CheckCircle,
  CreditCard,
  Bell,
  Clock,
  PieChart
} from "lucide-react";

const integrations = [
  { icon: Receipt, bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { icon: DollarSign, bg: "bg-blue-500/10", text: "text-blue-500" },
  { icon: FileText, bg: "bg-indigo-500/10", text: "text-indigo-500" },
  { icon: Mail, bg: "bg-pink-500/10", text: "text-pink-500" },
  { icon: Calculator, bg: "bg-orange-500/10", text: "text-orange-500" },
  { icon: Calendar, bg: "bg-rose-500/10", text: "text-rose-500" },
  { icon: FileCheck, bg: "bg-amber-500/10", text: "text-amber-500" },
  { icon: CheckCircle, bg: "bg-zinc-500/10", text: "text-zinc-400" },
];

const features = [
  {
    icon: Receipt,
    title: "Instant Invoicing",
    desc: "Generate professional, branded invoices with a single click after closing a deal.",
  },
  {
    icon: Clock,
    title: "Automated Reminders",
    desc: "Never chase a payment again. Loomingo sends gentle, automated follow-ups.",
  },
  {
    icon: DollarSign,
    title: "Multi-Currency Support",
    desc: "Bill clients globally with automatic currency conversion and local payment methods.",
  },
  {
    icon: Calculator,
    title: "Tax Automation",
    desc: "Calculate taxes and custom discounts automatically based on client location.",
  },
  {
    icon: PieChart,
    title: "Revenue Tracking",
    desc: "Monitor paid, pending, and overdue invoices from a centralized dashboard.",
  },
  {
    icon: Bell,
    title: "Payment Notifications",
    desc: "Get instant alerts the moment a client views your invoice or makes a payment.",
  },
];

export default function InvoiceGeneratorFeatureSection() {
  return (
    <section className="relative w-full py-6 lg:py-8 px-4 md:px-8 max-w-[1400px] mx-auto font-sans">
      <div className="relative w-full">
        {/* Blocks grid behind section & casts a feathered shadow to smoothly fade the grid OUTSIDE the section */}
        <div className="absolute inset-0 bg-[#0A0C10] shadow-[0_0_100px_80px_#0A0C10] rounded-[40px] z-0" />

        <div className="relative z-10 w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-[40px] text-white py-12 lg:py-16 rounded-[40px] overflow-hidden border border-white/20 flex flex-col items-center">
          {/* TOP HALF: Hero (Side by Side) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-16">
          
          {/* LEFT: Text Content */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs md:text-sm font-medium mb-6">
              Invoice Generator
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.15]">
              Get paid faster without lifting a finger
            </h2>
            
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Automate your billing process. Create professional invoices in seconds, send them automatically, and let Loomingo handle the payment tracking and follow-ups.
            </p>

            <button className="px-6 py-2.5 text-sm md:text-base md:px-8 md:py-3.5 rounded-lg md:rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-600/20">
              Create an Invoice
            </button>
          </div>

          {/* RIGHT: Floating Icons (Orbital Arrangement) */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center min-h-[250px] sm:min-h-[300px]">
            {/* Subtle faint grid background for the integration icons */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-[0.08] z-0"
              style={{ 
                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
                backgroundSize: '80px 80px',
                maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 80%)'
              }}
            />

            {/* Orbital Layout */}
            <div className="relative z-10 size-64 flex items-center justify-center scale-75 sm:scale-90 md:scale-100 mt-[-20px] md:mt-0">
              {/* Center Main Icon */}
              <div className="absolute z-20 flex items-center justify-center size-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl hover:scale-105 transition-transform">
                <Receipt className="w-10 h-10 text-emerald-400" />
              </div>
              
              {/* Orbiting Icons */}
              <div className="absolute top-0 right-4 flex items-center justify-center size-12 rounded-full bg-white/[0.05] border border-white/10 shadow-lg backdrop-blur-md animate-[bounce_3s_ease-in-out_infinite]">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div className="absolute bottom-4 right-0 flex items-center justify-center size-14 rounded-2xl bg-white/[0.05] border border-white/10 shadow-lg backdrop-blur-md animate-[bounce_4s_ease-in-out_infinite]">
                <Calculator className="w-6 h-6 text-orange-400" />
              </div>
              <div className="absolute bottom-0 left-4 flex items-center justify-center size-12 rounded-full bg-white/[0.05] border border-white/10 shadow-lg backdrop-blur-md animate-[bounce_3.5s_ease-in-out_infinite]">
                <CheckCircle className="w-5 h-5 text-zinc-300" />
              </div>
              <div className="absolute top-8 left-0 flex items-center justify-center size-14 rounded-2xl bg-white/[0.05] border border-white/10 shadow-lg backdrop-blur-md animate-[bounce_4.5s_ease-in-out_infinite]">
                <Mail className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
