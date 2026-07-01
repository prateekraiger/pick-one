"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pickRandomOption } from "@/lib/pickRandomOption";

export type Step = "setup" | "options" | "bowl" | "result";

export interface HistoryEntry {
  id: string;
  option: string;
  timestamp: number;
}

export interface DecisionSettings {
  /** When true, a picked option is removed from the pool for future draws. */
  removeAfterDraw: boolean;
  /** When true, avoid repeating the most recent pick(s) until pool exhausted. */
  noRepeat: boolean;
  /** Mute all sound effects. */
  muted: boolean;
}

interface DecisionState {
  step: Step;
  title: string;
  optionCount: number;
  /** Full original set of options as entered by the user (Step 2). */
  options: string[];
  /** Options still eligible to be drawn (shrinks if removeAfterDraw is on). */
  remainingOptions: string[];
  /** The options currently visible/animating in the bowl (paper balls). */
  bowlOptions: string[];
  settings: DecisionSettings;
  history: HistoryEntry[];
  lastResult: string | null;
  recentPicks: string[];

  // Actions
  setStep: (step: Step) => void;
  setTitle: (title: string) => void;
  setOptionCount: (count: number) => void;
  setOptions: (options: string[]) => void;
  loadSharedSetup: (title: string, options: string[], noRepeat?: boolean) => void;
  submitOptionsToBowl: () => void;
  toggleRemoveAfterDraw: () => void;
  toggleNoRepeat: () => void;
  toggleMuted: () => void;
  draw: () => { option: string; index: number } | null;
  resetDraws: () => void;
  startOver: () => void;
  clearHistory: () => void;
}

const DEFAULT_SETTINGS: DecisionSettings = {
  removeAfterDraw: false,
  noRepeat: true,
  muted: false,
};

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useDecisionStore = create<DecisionState>()(
  persist(
    (set, get) => ({
      step: "setup",
      title: "",
      optionCount: 3,
      options: [],
      remainingOptions: [],
      bowlOptions: [],
      settings: DEFAULT_SETTINGS,
      history: [],
      lastResult: null,
      recentPicks: [],

      setStep: (step) => set({ step }),

      setTitle: (title) => set({ title }),

      setOptionCount: (count) => set({ optionCount: count }),

      setOptions: (options) => set({ options }),

      loadSharedSetup: (title, options, noRepeat) =>
        set((state) => ({
          title,
          options,
          optionCount: options.length,
          settings: {
            ...state.settings,
            noRepeat: noRepeat ?? state.settings.noRepeat,
          },
          step: "options",
        })),

      submitOptionsToBowl: () => {
        const { options } = get();
        set({
          remainingOptions: [...options],
          bowlOptions: [...options],
          step: "bowl",
          lastResult: null,
          recentPicks: [],
        });
      },

      toggleRemoveAfterDraw: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            removeAfterDraw: !state.settings.removeAfterDraw,
          },
        })),

      toggleNoRepeat: () =>
        set((state) => ({
          settings: { ...state.settings, noRepeat: !state.settings.noRepeat },
        })),

      toggleMuted: () =>
        set((state) => ({
          settings: { ...state.settings, muted: !state.settings.muted },
        })),

      draw: () => {
        const { remainingOptions, settings, recentPicks, history } = get();
        if (remainingOptions.length === 0) return null;

        const exclude = settings.noRepeat ? recentPicks : [];
        const result = pickRandomOption(remainingOptions, exclude);

        const entry: HistoryEntry = {
          id: makeId(),
          option: result.option,
          timestamp: Date.now(),
        };

        const nextRecent = [result.option, ...recentPicks].slice(
          0,
          Math.max(1, remainingOptions.length - 1)
        );

        const nextRemaining = settings.removeAfterDraw
          ? remainingOptions.filter((_, i) => i !== result.index)
          : remainingOptions;

        set({
          lastResult: result.option,
          history: [entry, ...history],
          recentPicks: nextRecent,
          remainingOptions: nextRemaining,
          bowlOptions: nextRemaining,
          step: "result",
        });

        return result;
      },

      resetDraws: () => {
        set({ step: "bowl", lastResult: null });
      },

      startOver: () =>
        set({
          step: "setup",
          title: "",
          optionCount: 3,
          options: [],
          remainingOptions: [],
          bowlOptions: [],
          lastResult: null,
          recentPicks: [],
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "pick-one-decision-store",
      partialize: (state) => ({
        settings: state.settings,
        history: state.history,
      }),
    }
  )
);
