# Pick One 🥣

A decision-helper / lucky-draw web app built around a "paper slips in a bowl" metaphor. Write your options on hand-drawn paper slips, drop them into a wooden bowl, shake it up, and let the app randomly pick one for you.

## Project Overview
- **Name**: Pick One
- **Goal**: Give people a warm, playful, physically-metaphorical way to make a random choice between 2–20 options, entirely client-side (no backend/DB).
- **Core flow**: Setup (how many options?) → Write options (paper slips) → Drop into bowl (animated) → Draw (shake + reveal + confetti).

## Features Implemented
- ✅ 3-step flow: Setup → Options → Bowl/Draw, with `AnimatePresence` cross-fade transitions
- ✅ Numeric option-count input (2–20), disabled Continue until valid
- ✅ Optional session title used as the page heading
- ✅ Dynamically rendered "paper slip" inputs (dashed border, handwriting font via Google Fonts Caveat/Kalam, slight per-slip rotation)
- ✅ Validation: no empty or duplicate options (case-insensitive), inline error messages, Enter-to-next-field, Escape-to-back
- ✅ SVG wooden bowl with staggered paper-ball "drop in" animation (Framer Motion)
- ✅ "Pick Random Option" button: 1.5s shake/jiggle animation, then a cryptographically uniform random draw (`crypto.getRandomValues` with rejection sampling, `Math.random` fallback)
- ✅ Winning slip "flies out" and unfurls with a spring animation + warm-toned `canvas-confetti` burst
- ✅ "Draw Again" (redraw from remaining pool) and "Start Over" (reset to Step 1)
- ✅ Settings toggle: "Remove picked option after draw" vs "keep all options"; "No immediate repeats" mode (excludes the most recent pick(s) from the next draw)
- ✅ Collapsible history panel (slide-in sidebar) listing past picks with timestamps, clearable, persisted in `localStorage`
- ✅ Shareable state: setup (title + options + noRepeat) is base64url-encoded into a `?s=` query param; a "copy link" button in the top bar copies it, and loading that URL hydrates the same setup
- ✅ Sound effects (AI-generated): paper crumple on drop, drumroll on shake, ding on reveal — with a global mute toggle
- ✅ Dark mode (class-based, persisted, defaults to OS preference)
- ✅ Fully responsive single-column mobile layout, touch-friendly buttons
- ✅ Keyboard accessible: Enter advances focus/submits, Escape returns to the previous step
- ✅ SEO metadata: title, description, keywords, Open Graph + Twitter card with a generated illustration as the OG image
- ✅ Pure, unit-tested random-pick utility (`pickRandomOption`) — 12 passing Vitest tests covering uniformity, exclusion, no-mutation, and crypto-fallback behavior

## Tech Stack
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom warm "paper/bowl" palette, dark mode via `class` strategy)
- **Framer Motion** for all micro-interactions and step/element animations
- **Zustand** (`useDecisionStore`) for all client state, with `persist` middleware for settings + history
- **shadcn/ui**-style primitives (Button, Input, Card, Dialog) built on Radix + `class-variance-authority`
- **canvas-confetti** for the reveal celebration
- **Vitest** for unit tests

## Project Structure
```
src/
  app/
    layout.tsx        # Root layout, fonts, SEO metadata
    page.tsx           # Server wrapper (Suspense boundary for useSearchParams)
    globals.css        # CSS variables (light/dark theme), paper texture, drop-in keyframes
  components/
    HomeClient.tsx      # Client page composition + AnimatePresence + share-link hydration
    SetupStep.tsx       # Step 1
    OptionsStep.tsx     # Step 2
    BowlStep.tsx        # Step 3 (drop-in + shake + draw trigger)
    ResultReveal.tsx    # Step 3b (winner reveal + confetti)
    Bowl.tsx            # SVG bowl illustration + shake animation
    PaperBall.tsx        # Crumpled paper ball (in-bowl)
    PaperSlip.tsx        # Reusable "paper slip" visual wrapper
    DrawSettingsToggle.tsx # Remove-after-draw / no-repeat switches
    HistoryPanel.tsx     # Collapsible draw history sidebar
    SettingsBar.tsx      # Dark mode / mute / share buttons
    ui/                  # Button, Input, Card, Dialog (shadcn-style primitives)
  store/
    useDecisionStore.ts  # Zustand store: step, options, settings, history, draw logic
  lib/
    pickRandomOption.ts  # Pure random-pick + secure RNG + shuffle utilities (unit tested)
    pickRandomOption.test.ts
    validation.ts        # Empty/duplicate validation, option-count clamping
    share.ts              # base64url encode/decode of shareable setup
    sounds.ts              # Sound-effect playback helper (mute-aware, cached Audio elements)
    utils.ts                # `cn()` class-merge helper
  hooks/
    useDarkMode.ts          # Dark-mode class + localStorage persistence
public/
  sounds/                    # paper-crumple.mp3, drumroll.mp3, ding.mp3 (AI-generated SFX)
  og-image.png                # AI-generated OG/social share image
```

## Data Model (all client-side, no backend)
- `useDecisionStore` (Zustand, persisted to `localStorage` under key `pick-one-decision-store`):
  - `step`: `"setup" | "options" | "bowl" | "result"`
  - `title`, `optionCount`, `options: string[]`, `remainingOptions: string[]`, `bowlOptions: string[]`
  - `settings: { removeAfterDraw, noRepeat, muted }` — persisted
  - `history: { id, option, timestamp }[]` — persisted
  - `lastResult`, `recentPicks` — transient draw state
- Shareable setup is a separate, independent encoding (`{ title, options, noRepeat }` → base64url) carried in the URL, not the persisted store.

## User Guide
1. Enter how many options you're deciding between (2–20) and optionally name the decision.
2. Fill in each paper slip with an option — no blanks, no duplicates.
3. Click "Drop into bowl" and watch the slips crumple into balls and land in the bowl.
4. Click "Pick Random Option" — the bowl shakes, then a slip flies out and unfurls to reveal the winner, with confetti.
5. Click "Draw Again" to pick again from the (optionally reduced) pool, or "Start Over" to reset completely.
6. Use the top-left icons to toggle dark mode / mute sound, and (on the options/bowl screens) copy a shareable link. Use the bottom-right clock icon to view your draw history.

## Testing
```bash
npm run test    # Vitest — 12 tests covering pickRandomOption, getSecureRandomInt, shuffleArray
npm run build   # Next.js production build
```

## Deployment
- **Target platform**: Vercel (or any Next.js-compatible host)
- **Status**: Ready to deploy — `npm run build` succeeds cleanly, verified locally via PM2 on port 3000
- **Deploy command**: `vercel --prod` (or connect the GitHub repo to Vercel for automatic deploys)
- No environment variables or external services are required — this app is 100% client-side state.

## Not Yet Implemented / Next Steps
- No true "Dialog" usage yet (the shadcn `Dialog` primitive is included but unused — a confirm-before-Start-Over modal would be a nice addition)
- No automated end-to-end/browser tests (manual Playwright smoke-testing was done during development, but there's no CI test suite for the UI flows)
- No PWA/offline support
- No multi-language (i18n) support
- Sound effects are short single AI-generated clips; a richer sound design (multiple ding variants, longer drumroll synced exactly to shake duration) could be layered in
- Could add animated bowl "lid" or particle dust effects for extra flourish
