"use client";

import * as React from "react";
import { Volume2, VolumeX, Moon, Sun, Share2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDecisionStore } from "@/store/useDecisionStore";
import { useDarkMode } from "@/hooks/useDarkMode";
import { buildShareUrl } from "@/lib/share";
import { cn } from "@/lib/utils";

/**
 * Top utility bar: dark mode toggle, mute toggle, and (during options/bowl
 * steps) a share-link button that encodes the current setup into the URL.
 */
export function SettingsBar(): React.ReactElement {
  const { isDark, toggle } = useDarkMode();
  const muted = useDecisionStore((s) => s.settings.muted);
  const toggleMuted = useDecisionStore((s) => s.toggleMuted);
  const step = useDecisionStore((s) => s.step);
  const title = useDecisionStore((s) => s.title);
  const options = useDecisionStore((s) => s.options);
  const noRepeat = useDecisionStore((s) => s.settings.noRepeat);

  const [copied, setCopied] = React.useState(false);

  const canShare = (step === "options" || step === "bowl") && options.some((o) => o.trim());

  async function handleShare() {
    const url = buildShareUrl({ title, options, noRepeat });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable; no-op */
    }
  }

  return (
    <div className="fixed left-5 top-5 z-40 flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
        onClick={toggleMuted}
        className="h-11 w-11 rounded-full shadow-paper"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      {canShare && (
        <Button
          variant="secondary"
          size="icon"
          aria-label="Copy shareable link"
          onClick={handleShare}
          className={cn(
            "h-11 w-11 rounded-full shadow-paper transition-colors",
            copied && "bg-accent text-accent-foreground"
          )}
        >
          {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
}
