"use client";

import React from "react";
import { motion } from "motion/react";
import { instrumentSerif } from "@/app/fonts";

export default function PrivacySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.10 }
    }
  };

  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
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
          Data & Security
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={popUpVariants} className="w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1] mb-4 tracking-tight">
            Privacy <span className={`${instrumentSerif.className} text-red-300 pr-2`}>Policy</span>
          </h1>
          <p className="text-sm md:text-base text-white/60 mb-12 font-medium">
            Last Updated: May 27, 2026
          </p>
        </motion.div>

        {/* Content Body */}
        <motion.div 
          variants={popUpVariants}
          className="w-full bg-black/20 backdrop-blur-xl border border-white/10 p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-2xl flex flex-col gap-10 text-left"
        >
          
          <div>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              Welcome to Loomingo. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our Instagram automation platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium mb-4">
              To provide our automation services, we collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium">
              <li><strong className="text-white">Account Information:</strong> When you sign up for Early Access, we collect your name, email address, and account credentials.</li>
              <li><strong className="text-white">Instagram/Meta Data:</strong> To automate your DMs and comments, you must connect your Instagram profile. We receive an official access token from Meta. <strong className="text-red-300">We never see, collect, or store your Instagram password.</strong> We only retrieve the permissions necessary to read comments and send messages on your behalf.</li>
              <li><strong className="text-white">Usage Data:</strong> We collect basic analytics on how you interact with our platform to help us identify bugs, scale our backend infrastructure, and improve the service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium">
              <li>To execute the keyword triggers, comment replies, and DM automations you configure.</li>
              <li>To manage your account and provide customer support.</li>
              <li>To send you important administrative emails, such as updates to our infrastructure, changes in pricing as we transition out of Early Access, or security alerts.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-3">
              3. Meta Platform <span className={`${instrumentSerif.className} text-red-400 text-3xl`}>Compliance</span>
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              Loomingo operates using the official Meta/Instagram APIs. We strictly adhere to Meta’s Developer Policies. Your data is passed securely between Instagram and our servers solely for the purpose of executing the automations you authorize. We do not sell your Instagram data, nor do we use it to train external AI models.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security and Storage</h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              As a backend-focused platform, security is our top priority. We implement robust, industry-standard security measures to protect your personal information and Meta access tokens from unauthorized access, alteration, or disclosure. However, please remember that no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated data not linked to any personal information with trusted third-party service providers solely to help us operate our business (such as secure cloud hosting and database management).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Data Rights</h2>
            <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-white/80 leading-relaxed font-medium">
              <li>Access, update, or delete your Loomingo account at any time.</li>
              <li>Revoke Loomingo's access to your Instagram account directly from your Instagram settings.</li>
              <li>Request a complete deletion of your data from our servers by contacting us.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              We may update this Privacy Policy as Loomingo evolves and new features are added. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 mt-2">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              If you have questions or comments about this Privacy Policy, please reach out. <br />
              <strong className="text-white inline-block mt-2">Email:</strong> support@loomingo.com
            </p>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}