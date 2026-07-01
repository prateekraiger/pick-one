"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BowlProps {
  className?: string;
  /** Trigger the shake/jiggle "mixing" animation. */
  shaking?: boolean;
  children?: React.ReactNode;
}

/**
 * A hand-drawn-style wooden bowl rendered in SVG, with a slot for the paper
 * ball children to be layered on top (absolutely positioned by the caller).
 */
export function Bowl({ className, shaking = false, children }: BowlProps) {
  return (
    <motion.div
      className={cn("relative mx-auto", className)}
      animate={shaking ? { rotate: [0, -3, 3, -4, 4, -3, 3, -2, 2, 0] } : { rotate: 0 }}
      transition={
        shaking
          ? { duration: 1.5, ease: "easeInOut" }
          : { duration: 0.3 }
      }
    >
      {/* Paper balls / result layer sits above the bowl rim visually */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[38%] z-10 flex flex-wrap items-end justify-center gap-1 px-6">
        {children}
      </div>

      <svg
        viewBox="0 0 320 220"
        className="w-full h-auto drop-shadow-[0_20px_35px_rgba(90,55,25,0.35)]"
        role="img"
        aria-label="A wooden bowl"
      >
        <defs>
          <linearGradient id="bowlGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9895a" />
            <stop offset="55%" stopColor="#a8663c" />
            <stop offset="100%" stopColor="#7a4728" />
          </linearGradient>
          <linearGradient id="bowlInsideGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c3a22" />
            <stop offset="100%" stopColor="#3f2716" />
          </linearGradient>
          <radialGradient id="rimHighlight" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#f3cd9c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f3cd9c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bowl body */}
        <path
          d="M20 70 Q20 190 160 200 Q300 190 300 70 Q300 60 290 60 L30 60 Q20 60 20 70 Z"
          fill="url(#bowlGradient)"
          stroke="#5c3a22"
          strokeWidth="2"
        />

        {/* Inner shadow / cavity */}
        <ellipse cx="160" cy="66" rx="140" ry="26" fill="url(#bowlInsideGradient)" />

        {/* Rim */}
        <ellipse
          cx="160"
          cy="60"
          rx="142"
          ry="24"
          fill="none"
          stroke="#e8b785"
          strokeWidth="6"
        />
        <ellipse cx="160" cy="56" rx="130" ry="18" fill="url(#rimHighlight)" />

        {/* Wood grain lines */}
        <path
          d="M45 95 Q160 130 275 95"
          fill="none"
          stroke="#8a5a35"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M55 130 Q160 160 265 130"
          fill="none"
          stroke="#8a5a35"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  );
}
