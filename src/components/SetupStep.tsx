"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDecisionStore } from "@/store/useDecisionStore";
import { clampOptionCount } from "@/lib/validation";
import { cn } from "@/lib/utils";

/** Custom animated vector logo showing a pleated paper bowl with a floating paper chit. */
function Logo() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-paper-100 to-paper-300 border border-paper-300 shadow-[inset_-2px_-2px_6px_rgba(139,115,85,0.15),_2px_4px_12px_rgba(139,115,85,0.22)]">
      <svg
        viewBox="0 0 100 100"
        className="h-16 w-16 drop-shadow-[0_2px_4px_rgba(139,94,60,0.15)]"
      >
        {/* Bowl back interior */}
        <ellipse cx="50" cy="55" rx="30" ry="6" fill="#8c7053" />

        {/* Small chit floating above the bowl */}
        <motion.g
          animate={{
            y: [0, -3, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Sparkles */}
          <path d="M 32 30 Q 32 34 28 34 Q 32 34 32 38 Q 32 34 36 34 Q 32 34 32 30 Z" fill="#e5b56a" />
          <path d="M 68 24 Q 68 27 65 27 Q 68 27 68 30 Q 68 27 71 27 Q 68 27 68 24 Z" fill="#e5b56a" />

          {/* Folded slip (Chit) */}
          <polygon points="42,34 58,28 58,40 42,40" fill="#fdfbf7" stroke="#cf9e5d" strokeWidth="0.5" />
          <polygon points="58,28 72,32 72,42 58,40" fill="#f8e5c0" stroke="#cf9e5d" strokeWidth="0.5" />
          <line x1="58" y1="28" x2="58" y2="40" stroke="#fff" strokeWidth="0.75" opacity="0.6" />
        </motion.g>

        {/* Pleated Bowl Front */}
        {/* Panel 1 */}
        <path d="M 20 53 Q 35 55 50 56 L 62 82 Q 47 84 32 82 Z" fill="#ebd6b9" stroke="#d5bba1" strokeWidth="0.5" />
        {/* Panel 2 */}
        <path d="M 50 56 Q 65 55 80 53 L 68 82 Q 62 84 50 82 Z" fill="#dfc09c" stroke="#cfa67d" strokeWidth="0.5" />
        {/* Pleat Crease */}
        <line x1="50" y1="56" x2="50" y2="82" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="56" x2="50" y2="82" stroke="#8a6943" strokeWidth="0.5" opacity="0.15" />

        {/* Rolled rim */}
        <ellipse cx="50" cy="53" rx="30.5" ry="5.5" fill="none" stroke="#faecd8" strokeWidth="2.5" />
        <ellipse cx="50" cy="53" rx="30" ry="5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Step 1 — ask how many options the user wants to add, and optionally
 * name the session. Continue is disabled until a valid count is entered.
 */
export function SetupStep(): React.ReactElement {
  const optionCount = useDecisionStore((s) => s.optionCount);
  const title = useDecisionStore((s) => s.title);
  const setOptionCount = useDecisionStore((s) => s.setOptionCount);
  const setTitle = useDecisionStore((s) => s.setTitle);
  const setOptions = useDecisionStore((s) => s.setOptions);
  const setStep = useDecisionStore((s) => s.setStep);

  const [rawCount, setRawCount] = React.useState<string>(String(optionCount));

  const parsedCount = Number(rawCount);
  const isValid =
    rawCount.trim() !== "" &&
    !Number.isNaN(parsedCount) &&
    parsedCount >= 2 &&
    parsedCount <= 20 &&
    Number.isInteger(parsedCount);

  function handleContinue() {
    if (!isValid) return;
    const count = clampOptionCount(parsedCount);
    setOptionCount(count);
    setOptions(Array.from({ length: count }, () => ""));
    setStep("options");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleContinue();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full flex-col items-center gap-8 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, -2, 2, -1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-2"
        >
          <Logo />
        </motion.div>
        <h1 className="font-handwriting text-5xl font-bold text-foreground sm:text-6xl tracking-wide">
          Pick One
        </h1>
        <p className="max-w-md text-muted-foreground font-sans text-sm sm:text-base leading-relaxed">
          Can&apos;t decide? Write your options on paper slips, drop them in
          the bowl, and let fate pick for you.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card/85 p-6 pr-6 pl-2 shadow-paper backdrop-blur-sm relative overflow-hidden bg-paper-texture">
        {/* Top paper accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-paper-300 via-primary/45 to-paper-400" />

        {/* Notebook vertical red margin line */}
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-400/20 pointer-events-none" />

        <div className="space-y-2 text-left pl-6 relative z-10">
          <label
            htmlFor="session-title"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 font-sans"
          >
            Name this decision (optional)
          </label>
          <Input
            id="session-title"
            placeholder='e.g. "Where to eat tonight?"'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={80}
            className="bg-card/50 border-paper-300/80 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-all font-sans"
          />
        </div>

        <div className="space-y-2 text-left pl-6 relative z-10">
          <label
            htmlFor="option-count"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 font-sans"
          >
            How many options do you want to add?
          </label>
          <Input
            id="option-count"
            type="number"
            inputMode="numeric"
            min={2}
            max={20}
            placeholder="2 - 20"
            value={rawCount}
            onChange={(e) => setRawCount(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={!isValid}
            className={cn(
              "bg-card/50 border-paper-300/80 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-all font-sans",
              !isValid && rawCount !== "" ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
          />
          {rawCount !== "" && !isValid && (
            <p className="text-xs text-destructive mt-1 font-sans">
              Please enter a whole number between 2 and 20.
            </p>
          )}
        </div>

        <div className="pl-6 relative z-10">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-md hover:shadow-lg transition-all font-sans duration-200"
            disabled={!isValid}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
