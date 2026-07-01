"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDecisionStore } from "@/store/useDecisionStore";
import { clampOptionCount } from "@/lib/validation";

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
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>
        <h1 className="font-handwriting text-5xl font-bold text-foreground sm:text-6xl">
          Pick One
        </h1>
        <p className="max-w-md text-muted-foreground">
          Can&apos;t decide? Write your options on paper slips, drop them in
          the bowl, and let fate pick for you.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card/70 p-6 shadow-paper backdrop-blur-sm">
        <div className="space-y-2 text-left">
          <label
            htmlFor="session-title"
            className="text-sm font-medium text-muted-foreground"
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
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="option-count"
            className="text-sm font-medium text-muted-foreground"
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
            className={!isValid && rawCount !== "" ? "border-destructive" : ""}
          />
          {rawCount !== "" && !isValid && (
            <p className="text-xs text-destructive">
              Please enter a whole number between 2 and 20.
            </p>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!isValid}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
