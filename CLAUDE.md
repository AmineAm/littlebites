# Little Bites, Big World — AI Coding Context

This file is read by Claude Code at the start of every session.
It is the single source of truth for all architectural decisions.
Do not generate code that contradicts anything written here.

---

## Project identity

**App name:** Little Bites, Big World
**Codename:** LittleBites
**Type:** Cross-platform mobile app (iOS + Android)
**Stack:** React Native + Expo (managed workflow) + TypeScript + Firebase
**Design system:** P01 — Contemporary World
**Status:** Phase 3 — Active build

---

## What this app does

A children's meal prep companion for parents. Core value:
- Personalised recipe suggestions based on each child's food preferences
- Weekly meal planner with auto-generated shopping list
- Global cuisine exploration with culture story cards per recipe
- Passport stamp reward system (kids collect stamps per country cooked)
- Static illustrated character pairs that appear throughout the app
- Character unlock system — users earn new character pairs through cooking milestones

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
9. **Images always use `<FastImage>`** from `react-native-fast-image` — never `<Image>`
10. **All character assets come from `src/assets/characters/`** — never from a URL
11. **prefers-reduced-motion must be respected** — wrap all animations in the `useReducedMotion` hook
12. **No calorie counts, no macro tracking, no weight references** — anywhere in the app

---

## Tech stack — exact versions

```
expo: ~54.0.33
react-native: 0.81.5
typescript: ~5.9.2
expo-router: ~6.0.23
react-native-fast-image: ^8.6.3  (installed with --legacy-peer-deps for React 19 compat)
zustand: ^5.0.13
firebase: ^12.13.0
nativewind: ^4.2.4  (Tailwind for React Native)
tailwindcss: ^4.3.0
expo-notifications: ~0.32.17
expo-haptics: ~15.0.8
react-native-reanimated: ~4.1.1
react-native-gesture-handler: ~2.28.0
@shopify/flash-list: ^2.3.1  (replaces FlatList everywhere)
expo-auth-session: ~7.0.11
expo-web-browser: ~15.0.11
```

> Note: Project was initialised in 2026 with Expo 54 (not 51 as originally specced).
> All architectural decisions in this file remain unchanged.

---

## Folder structure

```
/
├── CLAUDE.md                    ← this file — always read first
├── app/                         ← Expo Router screens (file-based routing)
│   ├── (auth)/
│   │   ├── index.tsx            ← S1 Splash & sign up
│   │   ├── profile.tsx          ← S2 Child profile setup
│   │   ├── taste-quiz.tsx       ← S3 Taste preference quiz
│   │   └── adventure.tsx        ← S4 Adventure level
│   ├── (tabs)/
│   │   ├── index.tsx            ← S5 Home dashboard
│   │   ├── plan.tsx             ← S6 Meal planner
│   │   ├── explore.tsx          ← S10 Passport & rewards
│   │   ├── shop.tsx             ← S8 Shopping list
│   │   └── profile.tsx          ← Profile & settings
│   ├── recipe/[id].tsx          ← S7 Recipe detail
│   ├── cook/[id].tsx            ← S9 Guided prep mode
│   ├── adventure/[cuisine].tsx  ← S11 Adventure mode
│   └── unlock/[character].tsx   ← Character unlock reveal
├── src/
│   ├── assets/
│   │   ├── characters/          ← Character PNG files (see ASSETS.md)
│   │   ├── stamps/              ← Passport stamp PNGs
│   │   ├── recipes/             ← Recipe photography PNGs
│   │   ├── cuisine-cards/       ← Culture story card illustrations
│   │   └── icons/               ← App icon, splash variants
│   ├── components/              ← Reusable UI components
│   │   ├── ui/                  ← Primitive components (Button, Card, Tag)
│   │   ├── recipe/              ← Recipe-specific components
│   │   ├── planner/             ← Meal planner grid components
│   │   ├── passport/            ← Stamp, map, badge components
│   │   ├── character/           ← Character display + wave animation
│   │   └── shopping/            ← Shopping list components
│   ├── constants/
│   │   ├── tokens.ts            ← ALL design tokens (colours, spacing, type, radius)
│   │   ├── cuisines.ts          ← Cuisine definitions + accent colours
│   │   ├── characters.ts        ← Character roster definitions
│   │   └── routes.ts            ← Route name constants
│   ├── hooks/
│   │   ├── useReducedMotion.ts  ← Accessibility: disable animations
│   │   ├── useCharacter.ts      ← Active character pair state
│   │   ├── useUnlock.ts         ← Character unlock milestone tracking
│   │   └── useMealPlan.ts       ← Current week's plan state
│   ├── navigation/
│   │   └── TabBar.tsx           ← Custom bottom tab bar component
│   ├── services/
│   │   ├── firebase.ts          ← Firebase initialisation
│   │   ├── auth.ts              ← Authentication service
│   │   ├── recipes.ts           ← Recipe data fetching
│   │   ├── planner.ts           ← Meal plan CRUD
│   │   └── unlock.ts            ← Unlock milestone tracking
│   ├── store/
│   │   ├── auth.store.ts        ← User + child profiles (Zustand)
│   │   ├── planner.store.ts     ← Meal plan state (Zustand)
│   │   ├── character.store.ts   ← Active character + unlocked pairs (Zustand)
│   │   └── preferences.store.ts ← Child food preferences (Zustand)
│   ├── types/
│   │   ├── recipe.ts            ← Recipe, Ingredient, Step types
│   │   ├── child.ts             ← ChildProfile, Allergy, FoodPreference types
│   │   ├── character.ts         ← CharacterPair, OutfitVariant types
│   │   ├── planner.ts           ← WeekPlan, DayPlan, MealSlot types
│   │   └── passport.ts          ← Stamp, Badge, PassportProgress types
│   └── utils/
│       ├── nutrition.ts         ← Food group tag helpers
│       ├── preference.ts        ← Preference matching algorithm
│       └── date.ts              ← Week calculation helpers
├── docs/
│   ├── ASSETS.md                ← Asset naming + folder spec (read before touching assets)
│   ├── SCREENS.md               ← All 11 screens spec (read before building a screen)
│   ├── DATA-SCHEMA.md           ← Firebase schema (read before writing any data layer)
│   ├── CHARACTERS.md            ← Character roster + unlock rules
│   └── DEEPSEEK.md              ← Tasks routed to DeepSeek vs Claude Code
└── .claude/
    └── settings.json            ← Claude Code workspace settings
```

---

## Design tokens — quick reference

Full tokens are in `src/constants/tokens.ts`. This is the abbreviated version for quick reference during coding sessions.

### Core colours
```typescript
colors.coral[400]   // #D85A30  — primary action, CTAs
colors.coral[50]    // #FAECE7  — coral backgrounds
colors.coral[800]   // #712B13  — coral text
colors.teal[400]    // #1D9E75  — familiar meals, success
colors.teal[50]     // #E1F5EE  — teal backgrounds
colors.purple[400]  // #534AB7  — adventure, culture, passport
colors.purple[50]   // #EEEDFE  — purple backgrounds
colors.amber[200]   // #EF9F27  — rewards, stars, unlock
colors.amber[50]    // #FAEEDA  — amber backgrounds
colors.linen        // #F1EFE8  — ALL screen backgrounds
colors.white        // #FFFFFF  — card surfaces only
colors.gray[900]    // #2C2C2A  — primary text
colors.gray[600]    // #5F5E5A  — secondary text
colors.gray[400]    // #888780  — tertiary / placeholder text
colors.gray[100]    // #D3D1C7  — borders (always 0.5px)
```

### Spacing
```typescript
spacing[1]  // 4px
spacing[2]  // 8px
spacing[3]  // 12px
spacing[4]  // 16px
spacing[5]  // 20px
spacing[6]  // 24px  — screen edge margin
spacing[8]  // 32px
spacing[12] // 48px  — nav bar height
```

### Border radius
```typescript
radius.sm   // 4px   — small tags, planner cells
radius.md   // 8px   — inputs, small cards
radius.lg   // 12px  — recipe cards, main cards
radius.pill // 999   — buttons, chips, progress bars
radius.full // 9999  — circles (face icons, avatars)
```

### Typography
```typescript
typography.display    // 22px, weight 500
typography.h1         // 18px, weight 500
typography.h2         // 15px, weight 500
typography.bodyLg     // 14px, weight 400
typography.body       // 13px, weight 400
typography.bodySm     // 12px, weight 400
typography.label      // 11px, weight 500
typography.overline   // 10px, weight 500, letterSpacing 0.08
typography.cultureCard // 13px, weight 400, italic — culture story cards only
```

---

## Screens — quick reference

Full spec in `docs/SCREENS.md`. Screen IDs match the design file.

| ID | Route | Screen name | Auth required |
|----|-------|-------------|---------------|
| S1 | `/(auth)/` | Splash & sign up | No |
| S2 | `/(auth)/profile` | Child profile setup | No |
| S3 | `/(auth)/taste-quiz` | Taste preference quiz | No |
| S4 | `/(auth)/adventure` | Adventure level | No |
| S5 | `/(tabs)/` | Home dashboard | Yes |
| S6 | `/(tabs)/plan` | Meal planner | Yes |
| S7 | `/recipe/[id]` | Recipe detail | Yes |
| S8 | `/(tabs)/shop` | Shopping list | Yes |
| S9 | `/cook/[id]` | Guided prep mode | Yes |
| S10 | `/(tabs)/explore` | Passport & rewards | Yes |
| S11 | `/adventure/[cuisine]` | Adventure mode | Yes |

---

## Character system

Full spec in `docs/CHARACTERS.md`.

Four static character pairs — The Wanderers:
- **Marco & Lily** — Caribbean dad + daughter (5yo) — pair ID: `marco-lily`
- **Mei & Theo** — East Asian mum + son (11yo) — pair ID: `mei-theo`
- **Nour & Boo** — North African grandma + toddler (2yo, gender-open) — pair ID: `nour-boo`
- **Elsa, Kit & Finn** — Caucasian sister (14) + twins (7) — pair ID: `elsa-kit-finn`

**Unlock rules:**
- 1 pair chosen at onboarding (free, no earn required)
- Cook 5 meals → unlock pair 2
- Cook from 3 different cuisines → unlock pair 3
- Earn 10 passport stamps → unlock pair 4

**Active character** is stored in `character.store.ts` and used across all screens.
The `useCharacter()` hook returns the active pair and all asset paths.

---

## Asset loading pattern

Always use this pattern for character and recipe images:

```typescript
import FastImage from 'react-native-fast-image'

// Character hero (full body)
<FastImage
  source={require('@/assets/characters/marco-lily/italian/hero@2x.png')}
  style={styles.characterHero}
  resizeMode={FastImage.resizeMode.contain}
/>

// Character face icon (32px circle)
<FastImage
  source={require('@/assets/characters/marco-lily/face@2x.png')}
  style={styles.faceIcon}
  resizeMode={FastImage.resizeMode.cover}
/>
```

Never use `uri:` for local assets. Never use `<Image>` from react-native.

---

## Animation rules

```typescript
import { useReducedMotion } from '@/hooks/useReducedMotion'

const reducedMotion = useReducedMotion()

// Always gate animations
const animDuration = reducedMotion ? 0 : 240
```

Named durations from tokens:
- `animation.fast` = 120ms
- `animation.default` = 240ms
- `animation.slow` = 400ms
- `animation.stampDrop` = 500ms
- `animation.unlockReveal` = 600ms
- `animation.waveLoop` = 2000ms

---

## Firebase collections — quick reference

Full schema in `docs/DATA-SCHEMA.md`.

```
users/{userId}
users/{userId}/children/{childId}
users/{userId}/preferences/{childId}
users/{userId}/mealPlans/{weekId}
users/{userId}/passport/{userId}
users/{userId}/unlocks/{userId}
recipes/{recipeId}
cuisines/{cuisineId}
```

---

## What to do when stuck

1. Check `docs/SCREENS.md` for the screen spec before building any screen
2. Check `docs/DATA-SCHEMA.md` before writing any Firebase query
3. Check `docs/ASSETS.md` before referencing any image file
4. Check `src/constants/tokens.ts` before using any colour or spacing value
5. If the answer isn't in these files, ask — do not invent a convention

---

## Known constraints

- Expo managed workflow — no bare React Native, no custom native modules outside Expo SDK
- Firebase Firestore only — no REST API calls to third-party services in MVP
- All recipe data loaded from Firestore — no local JSON files for recipe content
- Character assets are static PNGs — no SVG, no dynamic generation
- No calorie data stored or displayed anywhere
- Shopping list substitution suggestions are stored in Firestore with the recipe — not computed client-side
- Passport stamp unlock is server-validated via Cloud Function — not client-side only
