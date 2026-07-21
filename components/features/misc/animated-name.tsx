"use client";

import { motion, Variants } from "motion/react";

interface AnimatedNameProps {
  name: string;
  className?: string;
}

export default function AnimatedName({ name, className = "" }: AnimatedNameProps) {
  const letters = Array.from(name);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 2.5,   
      },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    hidden: {
      opacity: 0,
      y: 8,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={`flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span 
          variants={child} 
          key={index}
          // THE FIX: Added 'inline-block' so the CSS transform works!
          className={`inline-block ${letter === " " ? "w-2" : ""}`}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
}