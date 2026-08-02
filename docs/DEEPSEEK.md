# AI Workflow — Task Routing

This file tells the team which AI tool to use for which task.
The goal is to use each tool where it performs best, not to use one for everything.

---

## The principle

**Claude Code** = architecture, context, debugging, multi-file reasoning
**DeepSeek** = high-volume generation, boilerplate, repetitive patterns

Think of Claude Code as the senior engineer who holds the full picture.
Think of DeepSeek as a fast pair-programmer for well-defined, contained tasks.

---

## Claude Code — use for these tasks

### Architecture decisions
- Any decision that affects more than one file
- Folder structure choices
- State management patterns
- Data fetching strategy
- Navigation flow changes

### Complex component logic
- The meal planner grid (drag-and-drop, auto-fill logic)
- The preference matching algorithm (`src/utils/preference.ts`)
- The unlock milestone tracking system (`src/hooks/useUnlock.ts`)
- The character wave animation component
- The passport world map interaction

### Firebase integration
- Schema design and Firestore queries
- Cloud Function logic
- Authentication flows
- Real-time listener setup

### Debugging
- Any runtime crash or unexpected behaviour
- TypeScript errors that span multiple files
- Performance issues (re-render loops, slow screens)
- Build errors from Expo / Metro

### Multi-file features
- Any feature that touches 3+ files
- New screen creation (always touches route, store, service, component files)
- New character pair addition (touches constants, assets manifest, store)

### Start every Claude Code session with
```
Read CLAUDE.md first. Then read docs/[RELEVANT-DOC].md.
Here is the task: [describe task]
```

---

## DeepSeek — use for these tasks

### Boilerplate screen shells
Generate the initial file for each of the 11 screens.
Provide this prompt:

```
Generate a React Native TypeScript screen component for [Screen Name].
Stack: Expo Router, NativeWind, react-native-fast-image.
Import colors and spacing from '@/constants/tokens'.
The screen has a SafeAreaView with backgroundColor colors.linen.
Screen padding is 24px on left and right.
Include a ScrollView where content exceeds one screen.
Include placeholder sections for: [list the sections from SCREENS.md].
Do not add any logic — placeholder comments only for data fetching.
```

### Repetitive UI components
- Shopping list items (once you have one, ask DeepSeek to produce variants)
- Planner day cells (familiar, adventure, empty — same structure, different tokens)
- Cuisine tag chips (one template, 14 variants)
- Nutrition badge chips (one template, 5 food group variants)
- Passport stamp grid items (earned vs locked)

### Data type definitions
Generate TypeScript interfaces from the schema in `docs/DATA-SCHEMA.md`:

```
Generate TypeScript interfaces for the following Firestore documents.
Use the exact field names from the schema.
All optional fields should be typed as T | undefined, not T | null.
[paste the relevant schema section]
```

### Content data files
- Recipe lookup table (`src/assets/recipes/index.ts`) — the static require map
- Character asset manifest (`src/assets/characters/index.ts`)
- Cuisine definitions (`src/constants/cuisines.ts`)

### Test data
- Mock recipe objects for development
- Mock child profiles for Storybook / testing
- Mock meal plan week for planner testing

---

## Do NOT use DeepSeek for

- Anything involving Firebase rules or Cloud Functions
- The preference matching algorithm
- The unlock system logic
- Any file that already has substantial Claude Code output
  (DeepSeek will not understand the existing patterns and will contradict them)
- Debugging — DeepSeek lacks the context window to reason across files
- Architecture decisions of any kind

---

## Handoff protocol between tools

When Claude Code produces a file that DeepSeek will later work on:

1. Claude Code produces the file with clear section comments:
   ```typescript
   // ── DEEPSEEK: generate list item component here ──
   // Props: { item: ShoppingItem; onToggle: (id: string) => void }
   // Uses: colors.teal[400] for checked state, colors.gray[100] border
   ```

2. DeepSeek fills in the marked section only — it does not touch other parts of the file

3. Human developer reviews the output and verifies it matches the token system

---

## Context to paste at the start of every DeepSeek session

```
Project: Little Bites, Big World — a React Native + Expo mobile app.
Stack: Expo Router, TypeScript, NativeWind, react-native-fast-image, Zustand, Firebase.

Design rules (non-negotiable):
- All colors from: colors object in src/constants/tokens.ts
- All spacing from: spacing object — spacing[6] = 24 is the screen edge margin
- All font sizes from: typography object — font is Nunito, weights 400 and 500 only
- All border radius from: radius object
- Background color of every screen: colors.linen = #F1EFE8 (never pure white)
- All images via FastImage, not Image
- No hardcoded hex values, pixel values, or font sizes anywhere

Current task: [describe task]
```

---

## Current status (2026-06-08)

### Done

| Screen | File | Status |
|--------|------|--------|
| S1 Splash & Sign Up | `app/(auth)/index.tsx` | ✅ Built (ScrollView + keyboard fix applied) |
| S2 + S4 Profile + Adventure | `app/(auth)/profile.tsx` | ✅ Merged into single screen |
| S3 Taste Quiz | `app/(auth)/taste-quiz.tsx` | ✅ Built, skippable |
| S5 Home Dashboard | `app/(tabs)/index.tsx` | 🔧 In progress (uncommitted, ~476 lines) |

| Infrastructure | File | Status |
|----------------|------|--------|
| Design tokens | `src/constants/tokens.ts` | ✅ |
| Cuisine definitions | `src/constants/cuisines.ts` | ✅ |
| Character definitions | `src/constants/characters.ts` | ✅ |
| Route constants | `src/constants/routes.ts` | ✅ |
| App layout / auth routing | `app/_layout.tsx` | ✅ |
| Firebase init | `src/services/firebase.ts` | ✅ |
| Auth service | `src/services/auth.ts` | ✅ |
| Firestore rules + indexes | `firestore.rules` + `firestore.indexes.json` | ✅ |
| Type definitions | `src/types/*.ts` (5 files) | ✅ |

| UI Components | File | Status |
|---------------|------|--------|
| PrimaryButton | `src/components/ui/PrimaryButton.tsx` | ✅ |
| GhostButton | `src/components/ui/GhostButton.tsx` | ✅ |
| SocialLoginButton | `src/components/ui/SocialLoginButton.tsx` | ✅ |
| ProgressDots | `src/components/ui/ProgressDots.tsx` | ✅ |
| AllergyChip | `src/components/ui/AllergyChip.tsx` | ✅ |
| Toggle | `src/components/ui/Toggle.tsx` | ✅ |
| PlaceholderImage | `src/components/ui/PlaceholderImage.tsx` | ✅ |
| CharacterPickerCard | `src/components/character/CharacterPickerCard.tsx` | ✅ |
| ChildCard | `src/components/profile/ChildCard.tsx` | ✅ |
| AddChildField | `src/components/profile/AddChildField.tsx` | ✅ |
| AdventureLevelSelector | `src/components/profile/AdventureLevelSelector.tsx` | ✅ |
| CuisinePickerChip | `src/components/profile/CuisinePickerChip.tsx` | ✅ |

### Not started

| Area | What's needed |
|------|---------------|
| S6 Meal Planner | `app/(tabs)/plan.tsx` |
| S7 Recipe Detail | `app/recipe/[id].tsx` |
| S8 Shopping List | `app/(tabs)/shop.tsx` |
| S9 Guided Prep | `app/cook/[id].tsx` |
| S10 Passport & Rewards | `app/(tabs)/explore.tsx` |
| S11 Adventure Mode | `app/adventure/[cuisine].tsx` |
| Stores | `auth.store.ts`, `planner.store.ts`, `character.store.ts`, `preferences.store.ts` |
| Services | `recipes.ts`, `planner.ts`, `unlock.ts` |
| Hooks | `useReducedMotion.ts`, `useCharacter.ts`, `useUnlock.ts`, `useMealPlan.ts` |
| Utils | `nutrition.ts`, `preference.ts`, `date.ts` |
| Recipe/cuisine/cooking UI components | ~25 components listed in SCREENS.md |

---

## Next steps (priority order)

### 1. Finish S5 Home Dashboard
The home screen is the anchor — everything else orbits it. The diff is already ~476 lines.
Complete the remaining sections (character hero, stat cards, unlock progress, adventure teaser),
wire up Firebase listeners, and commit.

### 2. Build the Zustand stores
Before building more screens, put the state layer in place:
- `auth.store.ts` — user + child profile state
- `character.store.ts` — active character pair + unlock tracking
- `preferences.store.ts` — child food preferences
- `planner.store.ts` — current week meal plan

These are the data backbone for S5–S11.

### 3. Build the hooks
- `useReducedMotion.ts` — accessibility gate (needed by every animated component)
- `useCharacter.ts` — wraps `character.store` for screen-level consumption
- `useMealPlan.ts` — wraps `planner.store` + Firestore sync
- `useUnlock.ts` — milestone tracking + unlock trigger detection

### 4. Build remaining screens in order: S6 → S7 → S8 → S9 → S10 → S11
Each screen lists its required sub-components in `docs/SCREENS.md`. Build the sub-components
first, then assemble the screen. PlaceholderImage is available for all asset spots — no artwork blocker.

### 5. Firebase service layer
- `recipes.ts` — Firestore reads for recipe data
- `planner.ts` — meal plan CRUD
- `unlock.ts` — milestone tracking + Cloud Function trigger

### 6. Utility functions
- `preference.ts` — the preference matching algorithm (high-complexity, Claude Code only)
- `nutrition.ts` — food group tag helpers
- `date.ts` — week calculation helpers

### 7. Custom TabBar
The bottom nav component in `src/navigation/TabBar.tsx` — character face icon on the active tab.

---

## Session log

Keep a brief log of which AI produced which files.
This helps when debugging — you know whose output to inspect.

| Date | File | AI | Notes |
|------|------|----|-------|
| 2026-06 | `src/constants/tokens.ts` | Claude Code | Design token file — do not edit without full review |
| 2026-06 | `src/constants/cuisines.ts` | Claude Code | 14 cuisines with accent colours |
| 2026-06 | `src/constants/characters.ts` | Claude Code | 4 character pairs with unlock milestones |
| 2026-06 | `app/(auth)/index.tsx` | Claude Code | S1 Splash & Sign Up |
| 2026-06 | `app/(auth)/profile.tsx` | Claude Code | S2+S4 merged — child profile + adventure |
| 2026-06 | `app/(auth)/taste-quiz.tsx` | Claude Code | S3 Taste quiz — skippable |
| 2026-06 | `app/_layout.tsx` | Claude Code | Auth gate routing |
| 2026-06 | `app/(tabs)/index.tsx` | Claude Code | S5 Home dashboard — in progress |
| 2026-06 | `src/types/*.ts` (5 files) | Claude Code | Recipe, child, character, planner, passport |
| 2026-06 | `src/services/firebase.ts` | Claude Code | Firebase init |
| 2026-06 | `src/services/auth.ts` | Claude Code | Auth service |
| 2026-06 | `src/components/ui/PlaceholderImage.tsx` | Claude Code | All 5 asset type placeholders |
| 2026-06 | All other UI/profile components | Claude Code | Buttons, chips, cards, selectors |
