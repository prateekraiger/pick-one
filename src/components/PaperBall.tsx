"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaperBallProps {
  className?: string;
  delay?: number;
  size?: number;
  seed?: number;
  tone?: "cream" | "amber" | "sage";
}

interface ColorConfig {
  bgLight: string;
  bgMedium: string;
  bgDark: string;
  shadow: string;
  crease: string;
  border: string;
}

const TONE_COLORS: Record<"cream" | "amber" | "sage", ColorConfig> = {
  cream: {
    bgLight: "#fffdf9",
    bgMedium: "#f5edd6",
    bgDark: "#dfd5b8",
    shadow: "rgba(90, 75, 60, 0.2)",
    crease: "rgba(130, 110, 90, 0.45)",
    border: "#dcd2b9",
  },
  amber: {
    bgLight: "#fefcf0",
    bgMedium: "#f7ebd3",
    bgDark: "#dfcaa0",
    shadow: "rgba(100, 80, 50, 0.22)",
    crease: "rgba(140, 105, 70, 0.5)",
    border: "#dbbe8a",
  },
  sage: {
    bgLight: "#f4faf4",
    bgMedium: "#e2ede2",
    bgDark: "#cddbcd",
    shadow: "rgba(50, 70, 50, 0.18)",
    crease: "rgba(90, 115, 90, 0.4)",
    border: "#b9ccb9",
  },
};

/**
 * A realistic folded paper chit component (re-purposed from PaperBall).
 * Uses SVG designs to draw either a V-fold, Z-fold, or rolled scroll cylinder
 * based on a seed prop, in cream, amber, or sage tones.
 */
export function PaperBall({
  className,
  delay = 0,
  size = 26,
  seed = 0,
  tone = "cream",
}: PaperBallProps) {
  const colors = TONE_COLORS[tone];
  const shapeIndex = seed % 3;

  // Stable random rotation and offset for organic pile alignment
  const rotationAngle = (seed * 47) % 360;
  
  // Staggered pile placement using margin/transform offsets for tighter overlap
  const marginOffset = `${-14 + ((seed * 5) % 9)}px`;
  const offsetY = `${((seed * 13) % 18) - 9}px`;

  return (
    <motion.div
      className={cn("inline-block select-none relative", className)}
      style={{
        width: size,
        height: size,
        marginLeft: marginOffset,
        marginRight: marginOffset,
        top: offsetY,
      }}
      initial={{ y: -180, opacity: 0, scale: 0.4, rotate: rotationAngle - 45 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: rotationAngle,
      }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1], // Natural ease-out decel
      }}
    >
      {shapeIndex === 0 && (
        // V-fold (folded-in-half)
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
          <path
            d="M 12 36 Q 50 18 88 36 L 88 68 Q 50 86 12 68 Z"
            fill="black"
            opacity="0.1"
            filter="blur(2px)"
            transform="translate(2, 3)"
          />
          <path
            d="M 15 38 C 15 38, 30 22, 50 20 L 50 80 C 32 82, 18 78, 15 72 Z"
            fill={colors.bgLight}
            stroke={colors.border}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 50 20 C 65 18, 80 26, 85 32 L 85 68 C 76 72, 62 78, 50 80 Z"
            fill={colors.bgMedium}
            stroke={colors.border}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 50 20 L 50 80"
            stroke={colors.crease}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 22 45 Q 32 40 45 42 M 58 40 Q 70 42 78 39 M 25 60 Q 35 58 45 61 M 55 58 Q 68 56 75 60"
            stroke={colors.border}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      )}

      {shapeIndex === 1 && (
        // Accordion Z-fold (3 sections)
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
          <path
            d="M 15 25 L 45 15 L 75 35 L 88 20 L 88 55 L 70 85 L 40 70 L 10 75 Z"
            fill="black"
            opacity="0.1"
            filter="blur(2px)"
            transform="translate(2, 3)"
          />
          <path
            d="M 15 28 L 45 20 L 40 78 L 12 82 Z"
            fill={colors.bgLight}
            stroke={colors.border}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 45 20 L 75 38 L 70 90 L 40 78 Z"
            fill={colors.bgDark}
            stroke={colors.border}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 75 38 L 88 24 L 92 68 L 70 90 Z"
            fill={colors.bgMedium}
            stroke={colors.border}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 45 20 L 40 78"
            stroke={colors.crease}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 75 38 L 70 90"
            stroke={colors.crease}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 20 40 L 35 36 M 50 48 L 65 52 M 78 52 L 85 46"
            stroke={colors.border}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      )}

      {shapeIndex === 2 && (
        // Rolled cylinder (scroll)
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
          <rect
            x="18"
            y="22"
            width="64"
            height="56"
            rx="12"
            fill="black"
            opacity="0.1"
            filter="blur(2px)"
            transform="translate(2, 3)"
          />
          <rect
            x="20"
            y="20"
            width="60"
            height="50"
            rx="10"
            fill={colors.bgMedium}
            stroke={colors.border}
            strokeWidth="2.5"
          />
          <path
            d="M 28 20 C 35 25, 35 65, 28 70 M 72 20 C 65 25, 65 65, 72 70"
            stroke={colors.border}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 20 32 L 80 32"
            stroke={colors.bgLight}
            strokeWidth="6"
            opacity="0.4"
          />
          <path
            d="M 20 62 L 80 62"
            stroke={colors.bgDark}
            strokeWidth="6"
            opacity="0.3"
          />
          <path
            d="M 38 20 L 38 70"
            stroke={colors.border}
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M 39 20 L 39 70"
            stroke={colors.crease}
            strokeWidth="2.5"
            opacity="0.6"
          />
        </svg>
      )}
    </motion.div>
  );
}
