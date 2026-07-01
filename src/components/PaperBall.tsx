"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaperBallProps {
  className?: string;
  delay?: number;
  size?: number;
  seed?: number;
}

/**
 * A small crumpled paper ball, animated dropping into the bowl with a
 * staggered delay. Purely decorative — represents an option once it has
 * been "dropped in".
 */
export function PaperBall({ className, delay = 0, size = 26, seed = 0 }: PaperBallProps) {
  const wiggle = (seed % 5) - 2; // -2..2 deg variety per ball
  return (
    <motion.div
      className={cn(
        "rounded-full bg-gradient-to-br from-paper-100 to-paper-300 shadow-paper border border-paper-400/60",
        className
      )}
      style={{
        width: size,
        height: size,
        boxShadow:
          "inset -2px -2px 4px rgba(120,80,30,0.25), inset 2px 2px 3px rgba(255,255,255,0.5), 2px 3px 6px rgba(90,55,25,0.3)",
      }}
      initial={{ y: -120, opacity: 0, scale: 0.4, rotate: -30 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: [0, wiggle, -wiggle, 0],
      }}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.34, 1.56, 0.64, 1],
        rotate: { delay: delay + 0.55, duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}
