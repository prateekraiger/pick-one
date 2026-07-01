"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Dices, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Bowl } from "@/components/Bowl";
import { PaperBall } from "@/components/PaperBall";
import { DrawSettingsToggle } from "@/components/DrawSettingsToggle";
import { useDecisionStore } from "@/store/useDecisionStore";
import { playSound } from "@/lib/sounds";

const SHAKE_DURATION_MS = 1500;
const DROP_STAGGER_MS = 180;

/**
 * Step 3 — bowl visual with paper balls dropping in (staggered), then a
 * "Pick Random Option" button that shakes the bowl before drawing.
 */
export function BowlStep(): React.ReactElement {
  const bowlOptions = useDecisionStore((s) => s.bowlOptions);
  const options = useDecisionStore((s) => s.options);
  const draw = useDecisionStore((s) => s.draw);
  const setStep = useDecisionStore((s) => s.setStep);
  const muted = useDecisionStore((s) => s.settings.muted);

  const [ballsDropped, setBallsDropped] = React.useState(0);
  const [allDropped, setAllDropped] = React.useState(false);
  const [shaking, setShaking] = React.useState(false);
  const [drawing, setDrawing] = React.useState(false);

  const total = bowlOptions.length;

  React.useEffect(() => {
    setBallsDropped(0);
    setAllDropped(false);
    if (total === 0) return;
    // Play a soft crumple sound as the first ball drops.
    playSound("crumple", muted);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i += 1) {
      timers.push(
        setTimeout(() => {
          setBallsDropped((n) => n + 1);
        }, i * DROP_STAGGER_MS + 550)
      );
    }
    timers.push(
      setTimeout(() => {
        setAllDropped(true);
      }, total * DROP_STAGGER_MS + 700)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  function handleDraw() {
    if (drawing || total === 0) return;
    setDrawing(true);
    setShaking(true);
    playSound("drumroll", muted);
    setTimeout(() => {
      setShaking(false);
      draw();
      setDrawing(false);
    }, SHAKE_DURATION_MS);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full flex-col items-center gap-8"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-handwriting text-4xl font-bold sm:text-5xl">
          {allDropped ? "Ready to draw!" : "Dropping slips into the bowl..."}
        </h2>
        <p className="text-sm text-muted-foreground">
          {total} option{total === 1 ? "" : "s"} in the bowl
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <Bowl shaking={shaking}>
          {Array.from({ length: ballsDropped }).map((_, i) => (
            <PaperBall key={i} delay={0} size={22 + (i % 3) * 4} seed={i} />
          ))}
        </Bowl>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="gap-2 px-10 text-lg"
          disabled={!allDropped || drawing || total === 0}
          onClick={handleDraw}
        >
          <Dices className={drawing ? "h-6 w-6 animate-spin" : "h-6 w-6"} />
          {drawing ? "Mixing it up..." : "Pick Random Option"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => setStep("options")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Edit options
        </Button>
      </div>

      <DrawSettingsToggle />

      {options.length === 0 && (
        <p className="text-sm text-destructive">No options to draw from.</p>
      )}
    </motion.div>
  );
}
