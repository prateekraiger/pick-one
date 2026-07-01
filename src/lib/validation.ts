/**
 * Validation helpers for the options-entry step.
 */

export interface ValidationResult {
  valid: boolean;
  /** Map of option index -> error message, only for invalid entries. */
  errors: Record<number, string>;
}

/**
 * Validates a list of option strings: none may be empty (after trim), and
 * no two (case-insensitive, trimmed) may be duplicates.
 */
export function validateOptions(options: readonly string[]): ValidationResult {
  const errors: Record<number, string> = {};
  const seen = new Map<string, number>();

  options.forEach((raw, index) => {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      errors[index] = "This slip can't be blank";
      return;
    }
    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      errors[index] = "Duplicate option";
      const firstIndex = seen.get(key)!;
      // Mark the first occurrence too, if not already flagged.
      if (!(firstIndex in errors)) {
        errors[firstIndex] = "Duplicate option";
      }
    } else {
      seen.set(key, index);
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Clamp the requested option count to the supported [2, 20] range. */
export function clampOptionCount(value: number): number {
  if (Number.isNaN(value)) return 2;
  return Math.min(20, Math.max(2, Math.floor(value)));
}
