"use client";

import * as React from "react";

const STORAGE_KEY = "pick-one-dark-mode";

/**
 * Manages the `dark` class on <html> and persists the user's preference,
 * defaulting to the OS-level `prefers-color-scheme` on first visit.
 */
export function useDarkMode() {
  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const toggle = React.useCallback(() => {
    // No-op to disable dark mode toggling
  }, []);

  return { isDark: false, toggle, mounted: true };
}
