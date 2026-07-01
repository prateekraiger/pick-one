"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaperSlip } from "@/components/PaperSlip";
import { useDecisionStore } from "@/store/useDecisionStore";
import { validateOptions } from "@/lib/validation";
import { cn } from "@/lib/utils";

const TONES: Array<"cream" | "amber" | "sage"> = ["cream", "amber", "sage"];

/** Deterministic pseudo-random rotation per slip index, stable across renders. */
function rotationFor(index: number): number {
  const values = [-3, 2, -2, 3, -1.5, 1.5, -2.5, 2.5];
  return values[index % values.length];
}

/**
 * Step 2 — dynamically rendered "paper slip" inputs, one per option.
 * Validates for empty/duplicate entries before allowing submission.
 */
export function OptionsStep(): React.ReactElement {
  const options = useDecisionStore((s) => s.options);
  const setOptions = useDecisionStore((s) => s.setOptions);
  const submitOptionsToBowl = useDecisionStore((s) => s.submitOptionsToBowl);
  const setStep = useDecisionStore((s) => s.setStep);
  const title = useDecisionStore((s) => s.title);

  const [touched, setTouched] = React.useState<Set<number>>(new Set());
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const { valid, errors } = validateOptions(options);

  function handleChange(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  function handleBlur(index: number) {
    setTouched((prev) => new Set(prev).add(index));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) {
        next.focus();
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setStep("setup");
    }
  }

  function markAllTouched() {
    setTouched(new Set(options.map((_, i) => i)));
  }

  function handleSubmit() {
    if (!valid) {
      markAllTouched();
      return;
    }
    submitOptionsToBowl();
  }

  const filledCount = options.filter((o) => o.trim().length > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-handwriting text-4xl font-bold sm:text-5xl">
          {title || "Write your options"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {filledCount} / {options.length} slips filled — fill them all in, no duplicates
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((value, index) => {
          const showError = touched.has(index) && errors[index];
          return (
            <div key={index} className="flex flex-col gap-1">
              <PaperSlip
                rotation={rotationFor(index)}
                tone={TONES[index % TONES.length]}
                className={cn(
                  "p-0",
                  showError && "border-destructive/70 ring-2 ring-destructive/30"
                )}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onBlur={() => handleBlur(index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={60}
                  aria-label={`Option ${index + 1}`}
                  aria-invalid={Boolean(showError)}
                  className="w-full bg-transparent px-4 py-3 text-center font-handwriting text-xl outline-none placeholder:text-muted-foreground/60"
                />
              </PaperSlip>
              {showError && (
                <p className="pl-2 text-xs text-destructive">{errors[index]}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex w-full max-w-2xl flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        <Button variant="ghost" onClick={() => setStep("setup")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={handleSubmit} className="w-full gap-2 sm:w-auto">
          <PackageOpen className="h-5 w-5" />
          Drop into bowl
        </Button>
      </div>
    </motion.div>
  );
}
