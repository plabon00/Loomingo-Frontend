"use client";

import React from "react";
import { motion } from "motion/react";

export default function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      
      {/* Huge floating, rotating geometric outlines */}
      <motion.div 
        animate={{ 
          rotate: [12, 180, 12],
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] border-[1px] border-indigo-500/20 rounded-[80px]" 
      />

      <motion.div 
        animate={{ 
          rotate: [-12, -180, -12],
          scale: [1, 1.2, 1],
          x: [0, -100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] border-[2px] border-rose-500/10 rounded-[120px]" 
      />

      <motion.div 
        animate={{ 
          rotate: [0, 360, 0],
          scale: [1, 1.05, 1],
          x: [0, 60, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="absolute -bottom-[10%] left-[20%] w-[35vw] h-[35vw] border-[1px] border-purple-500/20 rounded-full" 
      />

      {/* Colorful, glowing floating orbs for dynamic color depth */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[140px] mix-blend-screen"
      />

      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 80, -120, 0],
        }}
        transition={{ duration: 35, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-[50%] right-[20%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[140px] mix-blend-screen"
      />

      <motion.div
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{ duration: 45, ease: "easeInOut", repeat: Infinity }}
        className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-[140px] mix-blend-screen"
      />

    </div>
  );
}
