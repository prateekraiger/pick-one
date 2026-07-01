/**
 * Lightweight sound-effects player. Lazily creates and caches HTMLAudioElement
 * instances so repeated plays don't re-fetch audio, and respects a global
 * mute flag controlled by the Zustand store.
 */

export type SoundName = "crumple" | "drumroll" | "ding";

const SOUND_SRC: Record<SoundName, string> = {
  crumple: "/sounds/paper-crumple.mp3",
  drumroll: "/sounds/drumroll.mp3",
  ding: "/sounds/ding.mp3",
};

const cache = new Map<SoundName, HTMLAudioElement>();

function getAudio(name: SoundName): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(SOUND_SRC[name]);
    audio.preload = "auto";
    cache.set(name, audio);
  }
  return audio;
}

/** Play a sound effect unless `muted` is true. Fire-and-forget; ignores errors
 * (e.g. autoplay restrictions before the first user gesture). */
export function playSound(name: SoundName, muted: boolean): void {
  if (muted) return;
  const audio = getAudio(name);
  if (!audio) return;
  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      /* autoplay may be blocked; ignore */
    });
  } catch {
    /* ignore */
  }
}

/** Preload all sound effects (call once on mount for snappier first play). */
export function preloadSounds(): void {
  if (typeof window === "undefined") return;
  (Object.keys(SOUND_SRC) as SoundName[]).forEach((name) => getAudio(name));
}
