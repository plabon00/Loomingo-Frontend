"use client";

import React from "react";
import { motion } from "motion/react";
import { instrumentSerif } from "@/app/fonts";

export default function TermsSection() {
  // Stagger container: triggers children sequentially
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // Slightly faster stagger for reading
    },
  };

  // Item variant: bottom-to-top pop up
  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative w-full pt-8 pb-24 md:pt-12 md:pb-32 bg-transparent flex justify-center min-h-[80vh]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center md:items-start text-center md:text-left"
      >
        {/* Top Badge */}
        <motion.div
          variants={popUpVariants}
          className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm shadow-sm tracking-wider uppercase"
        >
          Legal Information
        </motion.div>

        {/* Main Heading & Date Row */}
        <motion.div 
          variants={popUpVariants} 
          className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <h1 className="text-4xl mb-8 sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] tracking-tight">
            Terms and{" "}
            <span className={`${instrumentSerif.className} text-red-300 pr-2`}>
              Conditions
            </span>
          </h1>

          <motion.div
            variants={popUpVariants}
            className="inline-flex shrink-0 self-start md:self-auto items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-xs sm:text-sm font-extralight backdrop-blur-sm shadow-sm tracking-wider"
          >
            Last Updated on 27th June 2026
          </motion.div>
        </motion.div>

        {/* Content Body - Encased in a dark glassmorphic card for legibility over the red gradient */}
        <motion.div
          variants={popUpVariants}
          // FIX: Changed 'w-full' to 'w-[92%] md:w-full max-w-4xl mx-auto my-8 sm:my-12' 
          // This ensures it always has a margin on mobile, stays centered, and leaves space on top/bottom.
          className="w-[92%] md:w-full max-w-4xl mx-auto my-8 sm:my-12 bg-black/20 backdrop-blur-xl border border-white/10 p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-2xl flex flex-col gap-10 text-left"
        >
          <div>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              Welcome to Loomingo! These Terms and Conditions ("Terms") govern
              your use of the Loomingo website and our Instagram automation
              platform (collectively, the "Service"). By accessing or using
              Loomingo, you agree to be bound by these Terms. If you do not
              agree with any part of these Terms, you may not use our Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Description of Service
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              Loomingo provides social media automation tools designed to help
              creators and businesses automate Instagram Direct Messages (DMs),
              reply to comments, capture leads, and manage engagement based on
              keyword triggers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Early Access and Future Billing
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-base md:text-lg text-white/80 leading-relaxed font-medium">
              <li>
                <strong className="text-white">Early Access Phase:</strong>{" "}
                Loomingo is currently operating in an "Early Access" phase.
                During this period, the core features of the Service are
                provided free of charge.
              </li>
              <li>
                <strong className="text-white">Changes to Pricing:</strong> We
                reserve the right to transition from a free model to a paid
                subscription model as the platform grows. We will provide users
                with reasonable advance notice before any mandatory charges are
                applied. You will not be charged automatically without your
                explicit consent and billing information.
              </li>
              <li>
                <strong className="text-white">Service Availability:</strong>{" "}
                During Early Access, the Service is actively being developed. We
                strive for maximum uptime, but you acknowledge that features may
                be updated, modified, or temporarily suspended as we improve the
                infrastructure.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. User Accounts and Security
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium">
              <li>
                You must provide accurate and complete information when creating
                an account.
              </li>
              <li>
                You are responsible for safeguarding the password and
                credentials used to access Loomingo.
              </li>
              <li>
                You are responsible for any activities or actions under your
                account, whether your account is connected to your own Instagram
                profile or a client's profile.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Acceptable Use and Instagram Compliance
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium mb-4">
              Loomingo connects to Instagram via official APIs, but your use of
              our Service must comply with both our rules and Meta's policies.
              You agree <strong className="text-white">NOT</strong> to:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium mb-6">
              <li>
                Use Loomingo for spam, harassment, or sending unsolicited
                messages that violate Instagram’s Community Guidelines.
              </li>
              <li>
                Violate any of Meta’s or Instagram’s Terms of Service, Platform
                Policies, or Developer Policies.
              </li>
              <li>
                Use the Service to distribute malicious software, phishing
                links, or fraudulent offers.
              </li>
              <li>
                Attempt to bypass our rate limits or abuse the infrastructure.
              </li>
            </ul>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-medium">
                <strong className="text-white">Account Risk:</strong> While
                Loomingo is designed with account safety and rate limits in
                mind, you acknowledge that you use automation tools at your own
                risk. Loomingo is not responsible for any temporary or permanent
                bans, suspensions, or restrictions placed on your Instagram
                account by Meta.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              All original content, features, and functionality of the Loomingo
              platform are and will remain the exclusive property of Loomingo.
              You may not copy, modify, or distribute our code, design, or
              branding without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium mb-4">
              To the maximum extent permitted by applicable law, Loomingo and
              its founder shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium mb-6">
              <li>
                Your access to or use of or inability to access or use the
                Service;
              </li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>
                Any issues arising directly from Meta/Instagram platform changes
                or API deprecations.
              </li>
            </ul>
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-medium italic">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis,
              without warranties of any kind.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Termination
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason, including without
              limitation if you breach these Terms or Meta's Terms of Service.
              Upon termination, your right to use the Service will immediately
              cease.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Changes to These Terms
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect. By continuing to access or use our Service after those
              revisions become effective, you agree to be bound by the revised
              terms.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 mt-2">
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Contact Us
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              If you have any questions about these Terms, please contact us at:{" "}
              <br />
              <strong className="text-white inline-block mt-2">
                Email:
              </strong>{" "}
              support@loomingo.com
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
