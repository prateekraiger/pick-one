"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";

import { useDecisionStore } from "@/store/useDecisionStore";
import { cn } from "@/lib/utils";

/**
 * Small inline switch control used by DrawSettingsToggle.
 */
function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/60"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-1"
          )}
          style={{ height: 18, width: 18 }}
        />
      </span>
    </button>
  );
}

/**
 * Collapsible settings toggle for the Bowl step: "remove picked option
 * after draw" vs "keep all options" and "no repeat" mode.
 */
export function DrawSettingsToggle(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const removeAfterDraw = useDecisionStore((s) => s.settings.removeAfterDraw);
  const noRepeat = useDecisionStore((s) => s.settings.noRepeat);
  const toggleRemoveAfterDraw = useDecisionStore((s) => s.toggleRemoveAfterDraw);
  const toggleNoRepeat = useDecisionStore((s) => s.toggleNoRepeat);

  return (
    <div className="w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Draw settings
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-card/80 p-1 shadow-paper backdrop-blur-sm">
          <Switch
            checked={removeAfterDraw}
            onChange={toggleRemoveAfterDraw}
            label="Remove after draw"
            description={
              removeAfterDraw
                ? "Picked options are taken out of the bowl"
                : "All options stay for future draws"
            }
          />
          <Switch
            checked={noRepeat}
            onChange={toggleNoRepeat}
            label="No immediate repeats"
            description="Avoid picking the same option twice in a row"
          />
        </div>
      )}
    </div>
  );
}
