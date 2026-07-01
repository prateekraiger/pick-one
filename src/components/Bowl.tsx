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
 * A realistic pleated paper bowl design.
 * Uses split SVG layers to allow children (paper chits) to drop
 * behind the front rim and pleated panels, creating a true 3D containment effect.
 */
export function Bowl({ className, shaking = false, children }: BowlProps) {
  return (
    <motion.div
      className={cn("relative mx-auto w-full max-w-md", className)}
      animate={shaking ? { rotate: [0, -3, 3, -4, 4, -3, 3, -2, 2, 0] } : { rotate: 0 }}
      transition={
        shaking
          ? { duration: 1.5, ease: "easeInOut" }
          : { duration: 0.3 }
      }
    >
      <div className="relative w-full aspect-[320/220]">
        {/* Layer 1: Background SVG (Interior Cavity & Back Rim) */}
        <svg
          viewBox="0 0 320 220"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Interior cavity gradient (deep and hollow) */}
            <radialGradient id="cavityGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#9c8063" />
              <stop offset="50%" stopColor="#82664a" />
              <stop offset="100%" stopColor="#5d452f" />
            </radialGradient>
          </defs>

          {/* Interior Cavity (Back half inside of the bowl) */}
          <ellipse cx="160" cy="68" rx="138" ry="24" fill="url(#cavityGrad)" />

          {/* Subtle interior rim reflection */}
          <ellipse cx="160" cy="69" rx="136" ry="22" fill="none" stroke="#bfa68a" strokeWidth="1" opacity="0.35" />
        </svg>

        {/* Layer 2: Middle Layer for Paper Chits (positioned inside the cavity) */}
        <div className="absolute inset-x-0 top-[26%] bottom-[16%] z-10 flex flex-wrap items-end justify-center px-10 pointer-events-none">
          {children}
        </div>

        {/* Layer 3: Foreground SVG (Front Pleated Body & Rim) */}
        <svg
          viewBox="0 0 320 220"
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_16px_24px_rgba(120,85,55,0.22)]"
        >
          <defs>
            {/* Gradients for each panel to simulate lighting and folds */}
            <linearGradient id="p0Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dcbfa0" />
              <stop offset="100%" stopColor="#c5a685" />
            </linearGradient>
            <linearGradient id="p1Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8d5bc" />
              <stop offset="100%" stopColor="#d3b694" />
            </linearGradient>
            <linearGradient id="p2Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f5edd6" />
              <stop offset="100%" stopColor="#dfc09c" />
            </linearGradient>
            <linearGradient id="p3Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dfc09c" />
              <stop offset="100%" stopColor="#d0ac85" />
            </linearGradient>
            <linearGradient id="p4Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d0ac85" />
              <stop offset="100%" stopColor="#bd9871" />
            </linearGradient>
            <linearGradient id="p5Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#bd9871" />
              <stop offset="100%" stopColor="#a37e58" />
            </linearGradient>

            {/* Paper texture overlay pattern */}
            <pattern id="paperTexturePattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.75" fill="#8c7050" opacity="0.06" />
              <circle cx="10" cy="10" r="0.5" fill="#8c7050" opacity="0.04" />
            </pattern>
          </defs>

          {/* Pleated Panels (Front of the bowl) */}
          {/* Panel 0 (leftmost) */}
          <path d="M 20 60 Q 40 64 60 68 L 110 189 Q 100 187 90 185 Z" fill="url(#p0Grad)" />
          {/* Panel 1 */}
          <path d="M 60 68 Q 85 71 110 74 L 135 192 Q 122.5 190.5 110 189 Z" fill="url(#p1Grad)" />
          {/* Panel 2 */}
          <path d="M 110 74 Q 135 75 160 76 L 160 193 Q 147.5 192.5 135 192 Z" fill="url(#p2Grad)" />
          {/* Panel 3 */}
          <path d="M 160 76 Q 185 75 210 74 L 185 192 Q 172.5 192.5 160 193 Z" fill="url(#p3Grad)" />
          {/* Panel 4 */}
          <path d="M 210 74 Q 235 71 260 68 L 210 189 Q 197.5 190.5 185 192 Z" fill="url(#p4Grad)" />
          {/* Panel 5 (rightmost) */}
          <path d="M 260 68 Q 280 64 300 60 L 230 185 Q 220 187 210 189 Z" fill="url(#p5Grad)" />

          {/* Crease line overlays (for distinct folding edges) */}
          <line x1="60" y1="68" x2="110" y2="189" stroke="#fff" strokeWidth="1.5" opacity="0.25" />
          <line x1="60" y1="68" x2="110" y2="189" stroke="#8a6943" strokeWidth="1" opacity="0.12" />

          <line x1="110" y1="74" x2="135" y2="192" stroke="#fff" strokeWidth="1.5" opacity="0.35" />
          <line x1="110" y1="74" x2="135" y2="192" stroke="#8a6943" strokeWidth="1" opacity="0.12" />

          <line x1="160" y1="76" x2="160" y2="193" stroke="#fff" strokeWidth="1.5" opacity="0.45" />
          <line x1="160" y1="76" x2="160" y2="193" stroke="#8a6943" strokeWidth="1" opacity="0.12" />

          <line x1="210" y1="74" x2="185" y2="192" stroke="#fff" strokeWidth="1.5" opacity="0.25" />
          <line x1="210" y1="74" x2="185" y2="192" stroke="#8a6943" strokeWidth="1.5" opacity="0.15" />

          <line x1="260" y1="68" x2="210" y2="189" stroke="#fff" strokeWidth="1.5" opacity="0.18" />
          <line x1="260" y1="68" x2="210" y2="189" stroke="#8a6943" strokeWidth="1.5" opacity="0.3" />

          {/* Bottom base plate */}
          <path
            d="M 90 185 Q 160 195 230 185 L 226 193 Q 160 203 94 193 Z"
            fill="#937554"
          />
          <path
            d="M 94 193 Q 160 203 226 193 Q 223 198 220 200 Q 160 208 100 200 Z"
            fill="#755a3d"
          />

          {/* Paper texture overlay for organic look */}
          <rect x="15" y="55" width="290" height="150" fill="url(#paperTexturePattern)" pointerEvents="none" style={{ mixBlendMode: "multiply" }} />

          {/* Rolled Paper Rim at the top */}
          {/* Rim shadow underneath */}
          <ellipse cx="160" cy="62" rx="141" ry="25" fill="none" stroke="#8a6745" strokeWidth="3" opacity="0.35" />
          {/* Main rolled rim */}
          <ellipse cx="160" cy="60" rx="140" ry="24" fill="none" stroke="#faecd8" strokeWidth="7" />
          {/* Rim top highlight */}
          <ellipse cx="160" cy="59" rx="139.5" ry="23.5" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.9" />
          {/* Rim inner shadow crease */}
          <ellipse cx="160" cy="61" rx="138" ry="22" fill="none" stroke="#c0a688" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>
    </motion.div>
  );
}
