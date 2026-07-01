"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDecisionStore } from "@/store/useDecisionStore";
import { cn } from "@/lib/utils";

function formatTime(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Collapsible sidebar panel showing past picks in this session with
 * timestamps. Slides in from the right; toggled via a floating button.
 */
export function HistoryPanel(): React.ReactElement {
  const history = useDecisionStore((s) => s.history);
  const clearHistory = useDecisionStore((s) => s.clearHistory);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Toggle history panel"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-paper-hover",
          history.length > 0 && "ring-2 ring-primary/50"
        )}
      >
        <History className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card p-5 shadow-bowl"
            >
              <div className="flex items-center justify-between pb-3">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <History className="h-5 w-5" />
                  Draw History
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close history"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {history.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  No draws yet. Once you pick an option, it&apos;ll show up
                  here.
                </p>
              ) : (
                <ul className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-1">
                  {history.map((entry, i) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                          {history.length - i}
                        </span>
                        <span className="font-medium">{entry.option}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(entry.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 gap-2 self-start text-muted-foreground"
                  onClick={clearHistory}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear history
                </Button>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
