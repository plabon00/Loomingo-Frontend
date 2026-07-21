"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleAlert } from "lucide-react";

const footerLinks = {
  Product: [
    { title: "DM Automation", href: "/autodm" },
    { title: "Storefront", href: "/store" },
    { title: "Invoice Generator", href: "/apps/invoice-generator" },
  ],
  Company: [
    { title: "About Us", href: "/about" },
    { title: "Pricing", href: "#", note: true },
    { title: "Help Center", href: "/help" },
    { title: "Careers", href: "#", badge: "Hiring" },
  ],
  Legal: [
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Cookie Policy", href: "/privacy-policy" },
  ],
} as const;

const socials = [
  {
    label: "LinkedIn",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z",
  },
  {
    label: "Facebook",
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95",
  },
  {
    label: "Instagram",
    path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3",
  },
];

/* "!" info affordance next to Pricing — tooltip on hover/focus, tap-toggle on touch. */
function PricingNote() {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="About pricing"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex items-center justify-center text-[var(--apple-gray-2)] hover:text-[var(--apple-blue)] transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-2 rounded-full"
      >
        <CircleAlert className="size-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl border border-[var(--apple-hairline)] bg-white p-3 text-left text-[12px] leading-relaxed text-[var(--apple-gray)] shadow-lg z-10"
        >
          We&apos;re currently in the development phase. Pricing arrives soon. For now, enjoy everything free.
        </span>
      )}
    </span>
  );
}

export default function DashboardFooter() {
  return (
    <footer className="font-apple w-full border-t border-[var(--apple-hairline)] bg-[var(--apple-surface-alt)]">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-[var(--apple-hairline)]">
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" aria-label="go home" className="mb-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-2 rounded">
              <img
                src="/icon.png"
                alt="Loomingo Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[17px] font-semibold tracking-tight text-[var(--apple-ink)]">
              Automate. Sell. Grow.
            </p>
            <p className="text-[14px] text-[var(--apple-gray)] leading-relaxed max-w-xs mt-1.5">
              Turn comments into conversations and scale your revenue
              effortlessly.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-gray-2)] mb-4">
                  {category}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.title} className="flex items-center gap-2">
                      <Link
                        href={link.href}
                        className="text-[14px] text-[var(--apple-gray)] hover:text-[var(--apple-ink)] transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-2 rounded"
                      >
                        {link.title}
                      </Link>
                      {"note" in link && link.note && <PricingNote />}
                      {"badge" in link && link.badge && (
                        <span className="rounded-full bg-[#eaf3fd] px-2 py-0.5 text-[10px] font-semibold text-[var(--apple-blue)]">
                          {link.badge}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <span className="text-[12px] font-medium text-[var(--apple-gray-2)]">
            © 2026 Loomingo, All rights reserved
          </span>
          <div className="flex gap-2.5">
            {socials.map((s) => (
              <Link
                key={s.label}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border border-[var(--apple-hairline)] text-[var(--apple-gray-2)] hover:text-[var(--apple-ink)] hover:border-[var(--apple-gray-2)] transition-colors duration-[240ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--apple-blue)] focus-visible:outline-offset-2"
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={s.path} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
