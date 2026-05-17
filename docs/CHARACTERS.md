# Little Bites, Big World — Character Reference

Read this before touching any character-related code or assets.

---

## The Wanderers — cast overview

Four static character pairs. Characters are app-owned, not user-customised.
No skin tone selection. Characters are fully illustrated as delivered.

| Pair ID | Characters | Background | Personality summary |
|---|---|---|---|
| `marco-lily` | Marco (dad, late 30s) + Lily (daughter, 5) | Caribbean | Joyful chaos + fearless foodie |
| `mei-theo` | Mei (mum, early 40s) + Theo (son, 11) | East Asian | Quiet mastery + secretly obsessed |
| `nour-boo` | Nour (grandma, late 60s) + Boo (toddler, 2, gender-open) | North African | Living memory + pure presence |
| `elsa-kit-finn` | Elsa (sister, 14) + Kit & Finn (twins, 7) | Caucasian | Meticulous leader + competitive delight |

**Kit always has a smudge on his face.** Finn is always spotless.

---

## Character type definitions

```typescript
// src/types/character.ts

export type CharacterPairId =
  | 'marco-lily'
  | 'mei-theo'
  | 'nour-boo'
  | 'elsa-kit-finn'

export type CuisineId =
  | 'italian' | 'japanese' | 'moroccan' | 'mexican'
  | 'indian'  | 'lebanese' | 'korean'   | 'peruvian'
  | 'greek'   | 'ethiopian'| 'thai'     | 'west-african'
  | 'french'  | 'spanish'

export interface CharacterPair {
  id:          CharacterPairId
  displayName: string          // e.g. 'Marco & Lily'
  tagline:     string          // e.g. 'The explorer pair'
  background:  string          // e.g. 'Caribbean'
  accentColor: string          // from tokens — e.g. colors.coral[400]
  accentBg:    string          // e.g. colors.coral[50]
  members: CharacterMember[]
}

export interface CharacterMember {
  name:      string
  role:      'dad' | 'mum' | 'grandma' | 'big-sister' | 'daughter' | 'son' | 'toddler' | 'twin'
  age:       string           // e.g. 'late 30s' | '5 years' | '2 years'
  quote:     string           // signature quote
  trait:     string           // one-word trait
}

export interface CharacterAssets {
  face:       ImageSourcePropType
  silhouette: ImageSourcePropType
  outfits:    Partial<Record<CuisineId, CharacterOutfit>>
}

export interface CharacterOutfit {
  hero:     ImageSourcePropType  // full body
  heroWave: ImageSourcePropType  // arm layer (same canvas, arm only)
  stamp:    ImageSourcePropType  // oval stamp version
}
```

---

## Character definitions

```typescript
// src/constants/characters.ts

import { colors } from './tokens'
import { CharacterPair } from '@/types/character'

export const CHARACTER_PAIRS: Record<string, CharacterPair> = {
  'marco-lily': {
    id:          'marco-lily',
    displayName: 'Marco & Lily',
    tagline:     'The explorer pair',
    background:  'Caribbean',
    accentColor: colors.coral[400],
    accentBg:    colors.coral[50],
    members: [
      {
        name:  'Marco',
        role:  'dad',
        age:   'late 30s',
        quote: "I have absolutely no idea what we're making — let's start!",
        trait: 'Joyful chaos',
      },
      {
        name:  'Lily',
        role:  'daughter',
        age:   '5 years',
        quote: 'Does this one come in purple?',
        trait: 'Fearless foodie',
      },
    ],
  },

  'mei-theo': {
    id:          'mei-theo',
    displayName: 'Mei & Theo',
    tagline:     'The slow-burn pair',
    background:  'East Asian',
    accentColor: colors.teal[400],
    accentBg:    colors.teal[50],
    members: [
      {
        name:  'Mei',
        role:  'mum',
        age:   'early 40s',
        quote: 'Watch. Not everything needs words.',
        trait: 'Quiet mastery',
      },
      {
        name:  'Theo',
        role:  'son',
        age:   '11 years',
        quote: "I'm not excited. I'm just… standing here. Near the food.",
        trait: 'Secretly obsessed',
      },
    ],
  },

  'nour-boo': {
    id:          'nour-boo',
    displayName: 'Nour & Boo',
    tagline:     'The wisdom pair',
    background:  'North African',
    accentColor: colors.purple[400],
    accentBg:    colors.purple[50],
    members: [
      {
        name:  'Nour',
        role:  'grandma',
        age:   'late 60s',
        quote: 'My mother made this. Her mother made this. Now you will make this.',
        trait: 'Living memory',
      },
      {
        name:  'Boo',
        role:  'toddler',
        age:   '2 years',
        quote: '[intense staring at the food]',
        trait: 'Pure presence',
      },
    ],
  },

  'elsa-kit-finn': {
    id:          'elsa-kit-finn',
    displayName: 'Elsa, Kit & Finn',
    tagline:     'The chaos trio',
    background:  'Caucasian',
    accentColor: colors.amber[200],
    accentBg:    colors.amber[50],
    members: [
      {
        name:  'Elsa',
        role:  'big-sister',
        age:   '14 years',
        quote: "I've already pre-measured everything. You're welcome.",
        trait: 'Meticulous leader',
      },
      {
        name:  'Kit',
        role:  'twin',
        age:   '7 years',
        quote: 'What if we added more?',
        trait: 'The instigator',
        // NOTE: Kit always has a smudge on his face. Always.
      },
      {
        name:  'Finn',
        role:  'twin',
        age:   '7 years',
        quote: 'We already added more.',
        trait: 'The builder',
        // NOTE: Finn is always spotless.
      },
    ],
  },
}

export const CHARACTER_PAIR_ORDER: string[] = [
  'marco-lily',
  'mei-theo',
  'nour-boo',
  'elsa-kit-finn',
]
```

---

## Unlock system

### Rules

```typescript
// Milestone thresholds — do not change without updating Cloud Function
export const UNLOCK_MILESTONES = {
  /** Cook this many meals to unlock pair 2 */
  mealsForPair2:     5,
  /** Cook from this many distinct cuisines to unlock pair 3 */
  cuisinesForPair3:  3,
  /** Earn this many passport stamps to unlock pair 4 */
  stampsForPair4:    10,
} as const
```

### How unlock is triggered

1. User completes a recipe (all steps done, confirmed by "Meal complete" tap)
2. `MealCompleteService.recordCompletion()` calls a Firebase Cloud Function
3. Cloud Function increments `passport.totalMealsCooked` and `passport.distinctCuisinesCooked`
4. Cloud Function checks milestones and writes to `unlocks/{userId}`
5. App listens to `unlocks/{userId}` via real-time Firestore listener
6. When a new pair appears in `unlockedPairs`, the unlock reveal screen is triggered

### Unlock reveal screen

Route: `/unlock/[character]` where `character` is the newly unlocked pair ID.
This screen is full-screen, non-dismissible until the user taps "Meet them".
It shows:
- The character silhouette filling with colour (CSS animation on opacity/transform)
- Character name large
- Signature quote from the first member
- "Meet [name]" button that sets them as the active character and navigates to S5

### useUnlock hook

```typescript
// src/hooks/useUnlock.ts
// Returns:
// - unlockedPairs: string[]
// - isUnlocked: (pairId: string) => boolean
// - milestoneProgress: { mealsCooked: number; cuisinesTried: number; stampsEarned: number }
// - nextUnlockTarget: { pairId: string; type: 'meals' | 'cuisines' | 'stamps'; current: number; required: number } | null
```

---

## Active character — how it works across the app

The active character pair is stored in `character.store.ts` and persisted to Firestore.
Every screen that shows a character reads from `useCharacter()`.

```typescript
// src/hooks/useCharacter.ts
// Returns:
// - activePair: CharacterPair
// - activeAssets: CharacterAssets
// - getCuisineOutfit: (cuisineId: string) => CharacterOutfit | undefined
// - setActivePair: (pairId: string) => void

// Usage in any screen:
const { activePair, activeAssets, getCuisineOutfit } = useCharacter()

// The character shown on the home dashboard hero uses the current week's cuisine
const currentCuisine = useMealPlan().activeAdventureCuisine
const outfit = getCuisineOutfit(currentCuisine) ?? getCuisineOutfit('italian')
```

---

## Wave 1 cuisine outfits — launch delivery status

Track here as assets arrive from the illustrator.

| Pair | Italian | Greek | Japanese | Moroccan | Mexican | Lebanese | Thai | French | Spanish |
|---|---|---|---|---|---|---|---|---|---|
| Marco & Lily | ✅ | ✅ | — | — | — | — | — | — | — |
| Mei & Theo | ✅ | ✅ | — | — | — | — | — | — | — |
| Nour & Boo | — | — | — | — | — | — | — | — | — |
| Elsa, Kit & Finn | — | — | — | — | — | — | — | — | — |

✅ = Delivered and integrated · — = Pending
