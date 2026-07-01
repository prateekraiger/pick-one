"use client";

import * as React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RefreshCw, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaperSlip } from "@/components/PaperSlip";
import { useDecisionStore } from "@/store/useDecisionStore";
import { playSound } from "@/lib/sounds";

/** Fires a warm-toned confetti burst themed to the paper/bowl palette. */
function fireConfetti() {
  const colors = ["#d99a44", "#c17f30", "#f0d29a", "#7a9c6a", "#e8b785"];
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.55 },
    colors,
    scalar: 1.1,
  });
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.6 },
    colors,
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.6 },
    colors,
  });
}

/**
 * Step 3b — winning-option reveal: a paper ball "flies out" and unfurls
 * into a slip showing the result, with a confetti burst.
 */
export function ResultReveal(): React.ReactElement {
  const lastResult = useDecisionStore((s) => s.lastResult);
  const remainingOptions = useDecisionStore((s) => s.remainingOptions);
  const resetDraws = useDecisionStore((s) => s.resetDraws);
  const startOver = useDecisionStore((s) => s.startOver);
  const muted = useDecisionStore((s) => s.settings.muted);
  const removeAfterDraw = useDecisionStore((s) => s.settings.removeAfterDraw);

  React.useEffect(() => {
    if (!lastResult) return;
    const t = setTimeout(() => {
      fireConfetti();
      playSound("ding", muted);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  const canDrawAgain = remainingOptions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col items-center gap-8 text-center"
    >
      <p className="font-handwriting text-2xl text-muted-foreground">
        The bowl has decided...
      </p>

      <motion.div
        initial={{ scale: 0.2, rotate: -50, y: -80, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
      >
        <PaperSlip
          rotation={-2}
          tone="amber"
          className="min-w-[280px] max-w-md px-10 py-8 shadow-paper-hover sm:min-w-[380px]"
        >
          <span className="break-words text-3xl font-bold leading-snug sm:text-5xl">
            {lastResult}
          </span>
        </PaperSlip>
      </motion.div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          size="lg"
          className="gap-2"
          disabled={!canDrawAgain}
          onClick={resetDraws}
        >
          <RefreshCw className="h-5 w-5" />
          Draw Again
        </Button>
        <Button variant="outline" size="lg" className="gap-2" onClick={startOver}>
          <RotateCcw className="h-5 w-5" />
          Start Over
        </Button>
      </div>

      {!canDrawAgain && removeAfterDraw && (
        <p className="text-sm text-muted-foreground">
          All options have been drawn! Start over to try again.
        </p>
      )}
    </motion.div>
  );
}
