# Little Bites, Big World — AI Coding Context

This file is read by Claude Code at the start of every session.
It is the single source of truth for all architectural decisions.
Do not generate code that contradicts anything written here.

**Architecture spec:** [littlebites#1](https://github.com/AmineAm/littlebites/issues/1) — the reasoning
and trade-offs behind everything below.

---

## Project identity

**App name:** Little Bites, Big World
**Codename:** LittleBites
**Type:** Cross-platform mobile app (iOS + Android)
**Stack:** React Native + Expo (managed workflow) + TypeScript
**Design system:** P01 — Contemporary World
**Status:** Phase 4 — Simplified architecture

**There is no backend.** No accounts, no database, no network calls. Recipes ship
in the bundle; everything the family creates lives on their device.

---

## What this app does

A children's meal prep companion for parents. Core value:
- Recipe suggestions matched to one child's age, allergies and tastes
- Weekly meal planner with an auto-derived shopping list
- Global cuisine exploration with culture story cards per recipe
- Passport stamp reward system (kids collect stamps per country cooked)
- Four illustrated character pairs that appear throughout the app
- Character unlock system — new pairs earned through cooking milestones

---

## Absolute rules — never break these

1. **Never hardcode colours.** Always use `colors` from `src/constants/tokens.ts`
2. **Never hardcode spacing.** Always use `spacing` from `src/constants/tokens.ts`
3. **Never hardcode font sizes.** Always use `typography` from `src/constants/tokens.ts`
4. **Never use pure black `#000000`.** Use `colors.gray[900]` = `#2C2C2A`
5. **Never use pure white `#FFFFFF` as a background.** Backgrounds use `colors.linen` = `#F1EFE8`
6. **All screens have `backgroundColor: colors.linen`** — not white, not transparent
7. **Border radius always uses `radius` tokens** — never raw pixel values inline
8. **All text uses `typography` tokens** — no raw fontSize/fontWeight inline
9. **Images always use `<Image>` from `expo-image`** — never `react-native`'s `Image`, never `FastImage`
10. **All character assets come from `src/assets/`** — never from a URL
11. **prefers-reduced-motion must be respected** — wrap all animations in the `useReducedMotion` hook
12. **No calorie counts, no macro tracking, no weight references** — anywhere in the app
13. **Never add a network call.** No `fetch`, no SDK, no remote config. The app works in aeroplane mode
14. **Never write to storage from a screen.** All writes go through a store action — this is the seam
    that makes cloud sync addable later
15. **Minimum interactive target is 56px.** Parents tap this with wet hands
16. **Pure logic imports nothing.** Functions in `src/utils/` must not import React, stores, services
    or components. Screens call into them; they call nothing back

---

## Tech stack — exact versions

```
expo: ~54.0.33
react-native: 0.81.5
react: 19.1.0
typescript: ~5.9.2
expo-router: ~6.0.23
expo-image: ~3.0.11              (replaces react-native-fast-image)
expo-linear-gradient: ~15.0.8
expo-haptics: ~15.0.8
@react-native-async-storage/async-storage: 2.2.0
zustand: ^5.0.13
react-native-safe-area-context: ~5.6.0
react-native-screens: ~4.16.0
react-native-gesture-handler: ~2.28.0
vitest: ^3.x                     (dev — pure logic tests only)
```

**Deliberately absent.** Do not re-add without reopening the spec:
`firebase`, `expo-auth-session`, `expo-web-browser`, `nativewind`, `tailwindcss`,
`@shopify/flash-list`, `expo-notifications`, `react-native-fast-image`,
`react-native-reanimated`, `react-native-worklets`.

Use `FlatList`, not FlashList. Use `Animated` from `react-native` with
`useNativeDriver: true`, not Reanimated. Use `StyleSheet`, not Tailwind classes.

**There is no `metro.config.js`.** It existed only for NativeWind and triggered a
Windows ESM path crash. Do not recreate it.

---

## Folder structure

```
/
├── CLAUDE.md                    ← this file — always read first
├── app/                         ← Expo Router screens (file-based routing)
│   ├── _layout.tsx              ← root stack + onboarding gate
│   ├── onboarding.tsx           ← single-screen setup
│   ├── settings.tsx             ← reached from gear icon on Today
│   ├── (tabs)/
│   │   ├── index.tsx            ← Today
│   │   ├── plan.tsx             ← Meal planner
│   │   ├── shop.tsx             ← Shopping list
│   │   └── passport.tsx         ← Passport & rewards
│   ├── recipe/[id].tsx          ← Recipe detail
│   ├── cook/[id].tsx            ← Guided prep + post-cook rating
│   ├── adventure/[cuisine].tsx  ← Adventure mode
│   └── unlock/[character].tsx   ← Character unlock reveal
├── src/
│   ├── assets/
│   │   ├── characters/          ← 12 files: 4 pairs × hero/face/silhouette
│   │   └── recipes/             ← recipe photography
│   ├── components/              ← ui/ recipe/ planner/ passport/ character/ shopping/ profile/
│   ├── constants/               ← tokens · characters · cuisines · foods · routes
│   ├── data/
│   │   └── recipes.json         ← bundled recipe content (generated by scripts/)
│   ├── hooks/                   ← useReducedMotion · useCharacter · useUnlock · useMealPlan
│   ├── store/                   ← profile · character · planner · preferences
│   ├── types/                   ← recipe · child · character · planner · passport
│   └── utils/                   ← PURE FUNCTIONS ONLY — the tested seam
│       ├── preference.ts        ← scoring + ranking
│       ├── milestones.ts        ← unlock evaluation
│       ├── shopping.ts          ← shopping-list derivation
│       ├── nutrition.ts         ← food group roll-up
│       └── date.ts              ← ISO week maths
├── docs/                        ← ASSETS · SCREENS · CHARACTERS · DEEPSEEK · agents/
└── scripts/                     ← CSV → src/data/recipes.json importer
```

---

## Design tokens — quick reference

Full tokens in `src/constants/tokens.ts`.

### Core colours
```typescript
colors.coral[400]   // #D85A30  — primary action, CTAs
colors.coral[50]    // #FAECE7  — coral backgrounds
colors.coral[800]   // #712B13  — coral text
colors.teal[400]    // #1D9E75  — familiar meals, success
colors.purple[400]  // #534AB7  — adventure, culture, passport
colors.amber[200]   // #EF9F27  — rewards, stars, unlock
colors.linen        // #F1EFE8  — ALL screen backgrounds
colors.white        // #FFFFFF  — card surfaces only
colors.gray[900]    // #2C2C2A  — primary text
colors.gray[600]    // #5F5E5A  — secondary text
colors.gray[400]    // #888780  — tertiary / placeholder
colors.gray[100]    // #D3D1C7  — borders
```

### Spacing
```typescript
spacing[1] 4 · spacing[2] 8 · spacing[3] 12 · spacing[4] 16
spacing[5] 20 · spacing[6] 24 (screen edge) · spacing[8] 32 · spacing[12] 48
```

### Border radius
```typescript
radius.sm 4 · radius.md 8 · radius.lg 12 · radius.xl 16
radius.pill 999 · radius.full 9999
```

### Typography — scaled for a phone at arm's length in a kitchen
```typescript
typography.display     // 28px, weight 500
typography.h1          // 22px, weight 500
typography.h2          // 18px, weight 500
typography.bodyLg      // 17px, weight 400
typography.body        // 15px, weight 400
typography.bodySm      // 13px, weight 400
typography.label       // 12px, weight 500
typography.overline    // 11px, weight 500, letterSpacing 0.08
typography.cultureCard // 15px, weight 400, italic — culture story cards only
```

`touchTarget.min` = 56. Every `Pressable` meets it.

---

## Screens

| Route | Screen | Notes |
|---|---|---|
| `/onboarding` | Setup | Character + age band + allergies + optional name. ~3 taps |
| `/(tabs)/` | Today | Default screen. Character, stats, tonight's suggestion, shopping card |
| `/(tabs)/plan` | Meal planner | 7 days × 3 meals |
| `/(tabs)/shop` | Shopping list | Derived from the plan, checked state persisted |
| `/(tabs)/passport` | Passport & rewards | Stamps, badges, unlock progress |
| `/settings` | Settings | Gear icon on Today. Age band, allergies, adventure level, home cuisine |
| `/recipe/[id]` | Recipe detail | |
| `/cook/[id]` | Guided prep | Final step captures 👍/👎 |
| `/adventure/[cuisine]` | Adventure mode | |
| `/unlock/[character]` | Unlock reveal | Full-screen, non-dismissible |

Full specs in `docs/SCREENS.md` — note it still describes the pre-simplification
onboarding flow (S1–S4); `/onboarding` replaces all of it.

---

## Data model — on device, no backend

One child. Everything is a singleton — nothing is keyed by child ID or user ID.

```typescript
// profile.store
child:    { name?: string; ageBand: '2-4' | '5-8' | '9-12'; allergies: Allergy[]; allergiesConfirmed: boolean }
settings: { adventureLevel: 'cautious' | 'curious' | 'adventurous'; homeCuisine?: CuisineId }

// character.store   activePairId, unlockedPairs, milestones
// planner.store     weekPlans by weekId, shopping checked state
// preferences.store liked[], disliked[], cuisineHistory
```

Persistence is Zustand's `persist` middleware over AsyncStorage. There is no
repository layer, no storage interface, no adapters. **Rule 14 is the seam** —
honour it and cloud sync can be added later without touching a screen.

Recipes are read from `src/data/recipes.json`, imported as a module. Never fetched.

---

## Character system

Four pairs — The Wanderers. Full spec in `docs/CHARACTERS.md`.

`marco-lily` · `mei-theo` · `nour-boo` · `elsa-kit-finn`

**One look per pair.** There are no per-cuisine outfits. Each pair has exactly
three images: `hero`, `face`, `silhouette`. Do not reintroduce an outfit matrix.

**Unlock milestones** — evaluated client-side by `evaluateMilestones()` in
`src/utils/milestones.ts`, a pure function. The hook wraps it; the logic lives
outside React so it can be tested.

```
5 meals cooked        → pair 2
3 distinct cuisines   → pair 3
10 passport stamps    → pair 4
```

---

## Assets

`docs/ASSETS.md` describes the original ~300-file specification. **It is superseded.**
The launch requirement is ~36 files:

| Asset | Approach |
|---|---|
| Character hero / face / silhouette | Real illustration — 12 files |
| Recipe images | Real photography — food must look worth cooking |
| Passport stamps | **Rendered** — flag emoji on cuisine accent colour, desaturated + lock when unearned |
| Culture cards | **Rendered** — cuisine accent gradient + flag emoji |

Metro cannot resolve dynamic `require()`. Every image is statically referenced in
a lookup map; adding one is a code change.

---

## Animation rules

```typescript
import { Animated } from 'react-native'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const reducedMotion = useReducedMotion()
const duration = reducedMotion ? 0 : animation.default
```

Always `useNativeDriver: true`. Reanimated is not installed.

Durations: `fast` 120 · `default` 240 · `slow` 400 · `stampDrop` 500 ·
`unlockReveal` 600 · `waveLoop` 2000.

---

## Testing

**One seam: pure logic in `src/utils/`, run by Vitest.** No component tests, no
screen tests, no renderer, no mocks.

```
npm test           # watch
npm run test:run   # once
```

A good test asserts external behaviour — given this input, this output — and
survives a rewrite of the function it covers.

If a function needs mocking to test, it is in the wrong place: extract the pure
part into `src/utils/` and leave the effect in the caller.

---

## What to do when stuck

1. `docs/SCREENS.md` before building a screen (onboarding section is superseded)
2. The data model above before touching state
3. `docs/ASSETS.md` before referencing an image (superseded by the table above)
4. `src/constants/tokens.ts` before using any colour, size or spacing value
5. If the answer isn't in these files, ask — do not invent a convention

---

## Known constraints

- Expo managed workflow — no bare React Native, no native modules outside the Expo SDK
- **No network calls of any kind.** The app works fully offline
- No accounts. Data lives on one device and is lost if the app is deleted
- Adding or editing a recipe requires an app release
- One child profile. Multi-child is explicitly out of scope
- Character assets are static PNGs — no SVG, no dynamic generation
- No calorie data stored or displayed anywhere
- Shopping list substitutions are stored with the recipe, not computed at runtime
- Unlock milestones are evaluated client-side and are trivially cheatable. This is
  accepted: there is no leaderboard and nothing purchasable

### Development environment

Node 24 **breaks** Expo 54 on Windows with `ERR_UNSUPPORTED_ESM_URL_SCHEME`, and
blames `metro.config.js` rather than the real cause. Node 20 is required:

```powershell
$env:PATH = "C:\nvm4w\nodejs;$env:PATH"   # or run start-expo.bat
```

Verify a build without a phone — 200 means it compiles, 500 carries the error:

```powershell
Invoke-WebRequest "http://localhost:8081/index.bundle?platform=android&dev=true" -UseBasicParsing
```

Most installs need `--legacy-peer-deps`. Disconnect any VPN before connecting
Expo Go, or the reported LAN address will be the tunnel's.

---

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `AmineAm/littlebites`, managed with the `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root.
See `docs/agents/domain.md`.
