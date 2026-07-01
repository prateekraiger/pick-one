"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { SetupStep } from "@/components/SetupStep";
import { OptionsStep } from "@/components/OptionsStep";
import { BowlStep } from "@/components/BowlStep";
import { ResultReveal } from "@/components/ResultReveal";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsBar } from "@/components/SettingsBar";
import { useDecisionStore } from "@/store/useDecisionStore";
import { decodeSetup } from "@/lib/share";
import { preloadSounds } from "@/lib/sounds";

/**
 * Top-level page composition. Renders the current step with AnimatePresence
 * for smooth cross-step transitions, and hydrates shared setups from the
 * `?s=` URL query param on first load.
 */
export function HomeClient(): React.ReactElement {
  const step = useDecisionStore((s) => s.step);
  const loadSharedSetup = useDecisionStore((s) => s.loadSharedSetup);
  const searchParams = useSearchParams();
  const hydratedFromUrl = React.useRef(false);

  React.useEffect(() => {
    preloadSounds();
  }, []);

  React.useEffect(() => {
    if (hydratedFromUrl.current) return;
    const shared = searchParams.get("s");
    if (!shared) return;
    const setup = decodeSetup(shared);
    if (setup && setup.options.length >= 2) {
      loadSharedSetup(setup.title, setup.options, setup.noRepeat);
    }
    hydratedFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-20 sm:py-24">
      <SettingsBar />
      <HistoryPanel />

      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === "setup" && <SetupStep key="setup" />}
          {step === "options" && <OptionsStep key="options" />}
          {step === "bowl" && <BowlStep key="bowl" />}
          {step === "result" && <ResultReveal key="result" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
