"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PaperSlipProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Deterministic rotation so slips look hand-torn but stay stable across renders. */
  rotation?: number;
  children?: React.ReactNode;
  tone?: "cream" | "amber" | "sage";
}

const TONE_CLASSES: Record<NonNullable<PaperSlipProps["tone"]>, string> = {
  cream: "bg-paper-50 dark:bg-paper-900/40 border-paper-400/70",
  amber: "bg-paper-100 dark:bg-paper-800/40 border-paper-500/70",
  sage: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400/60",
};

/**
 * A single "paper slip" — styled to look like a small torn piece of paper
 * with a dashed border and handwriting font, slightly rotated at rest.
 */
export const PaperSlip = React.forwardRef<HTMLDivElement, PaperSlipProps>(
  ({ className, rotation = 0, children, tone = "cream", style, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        style={{ rotate: rotation, ...style }}
        className={cn(
          "relative flex items-center justify-center rounded-md border-2 border-dashed px-4 py-3 shadow-paper font-handwriting text-lg",
          TONE_CLASSES[tone],
          className
        )}
        {...props}
      >
        {/* torn-edge notches for a physical paper feel */}
        <span
          aria-hidden
          className="absolute -left-1 top-1/2 h-3 w-2 -translate-y-1/2 rounded-full bg-background"
        />
        <span
          aria-hidden
          className="absolute -right-1 top-1/2 h-3 w-2 -translate-y-1/2 rounded-full bg-background"
        />
        {children}
      </motion.div>
    );
  }
);
PaperSlip.displayName = "PaperSlip";
