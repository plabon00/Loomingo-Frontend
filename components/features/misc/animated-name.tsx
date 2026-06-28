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
        staggerChildren: 0.1, 
        delayChildren: 0.3,   
      },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
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