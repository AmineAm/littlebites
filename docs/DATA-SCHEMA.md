# Little Bites, Big World — Firebase Data Schema

Read this before writing any Firestore query, Cloud Function, or data type.

---

## Collections overview

```
users/{userId}
  └── children/{childId}
  └── preferences/{childId}
  └── mealPlans/{weekId}
  └── passport/{userId}      ← single document, userId == parent doc id
  └── unlocks/{userId}       ← single document

recipes/{recipeId}
cuisines/{cuisineId}
```

---

## `users/{userId}`

```typescript
interface User {
  uid:          string        // Firebase Auth UID
  email:        string
  displayName:  string | undefined
  createdAt:    Timestamp
  updatedAt:    Timestamp
  activeCharacter: string    // character pair ID: 'marco-lily' | 'mei-theo' | 'nour-boo' | 'elsa-kit-finn'
  onboardingComplete: boolean
  adventureLevel: 'cautious' | 'curious' | 'adventurous'
  homeCuisine:  string        // cuisine ID: 'lebanese', 'italian', etc.
  notificationsEnabled: boolean
}
```

---

## `users/{userId}/children/{childId}`

```typescript
interface ChildProfile {
  childId:     string         // auto-generated Firestore ID
  name:        string
  age:         number         // integer, years
  allergies:   Allergy[]
  createdAt:   Timestamp
}

type Allergy = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'shellfish' | 'fish' | 'sesame'
```

---

## `users/{userId}/preferences/{childId}`

One document per child. Updated as the child's taste profile develops.

```typescript
interface ChildPreferences {
  childId:   string
  updatedAt: Timestamp

  // Foods the child has explicitly liked or disliked during the taste quiz
  // and updated over time as meals are accepted/rejected
  liked:    string[]   // food item IDs e.g. ['pasta', 'rice', 'chicken', 'eggs']
  disliked: string[]   // food item IDs e.g. ['mushrooms', 'spicy-food']

  // Cuisine acceptance — updated when recipes are cooked
  // 'accepted' = child ate it, 'rejected' = child refused, undefined = not tried
  cuisineHistory: Record<string, 'accepted' | 'rejected'>

  // Match score cache — updated by Cloud Function after each meal
  // Key: recipeId, Value: 0–100 match score
  recipeScores: Record<string, number>
}
```

---

## `users/{userId}/mealPlans/{weekId}`

`weekId` format: `YYYY-WNN` e.g. `2025-W32`

```typescript
interface WeekPlan {
  weekId:    string      // 'YYYY-WNN'
  userId:    string
  childId:   string      // which child this plan is for
  updatedAt: Timestamp

  days: {
    monday:    DayPlan
    tuesday:   DayPlan
    wednesday: DayPlan
    thursday:  DayPlan
    friday:    DayPlan
    saturday:  DayPlan
    sunday:    DayPlan
  }
}

interface DayPlan {
  breakfast: string | undefined  // recipeId or undefined if empty
  lunch:     string | undefined
  dinner:    string | undefined
}
```

---

## `users/{userId}/passport/{userId}`

Single document. `userId` matches the parent document ID.

```typescript
interface Passport {
  userId:    string
  updatedAt: Timestamp

  // Cuisines with at least one completed recipe
  // Key: cuisineId, Value: number of recipes cooked from that cuisine
  stamps: Record<string, number>

  // Earned badge IDs
  badges: string[]   // e.g. ['first-bite', 'explorer', 'little-chef']

  // Total meals cooked (used for unlock milestone tracking)
  totalMealsCooked: number

  // Distinct cuisines cooked (used for unlock milestone)
  distinctCuisinesCooked: number
}
```

---

## `users/{userId}/unlocks/{userId}`

Single document. Tracks which character pairs are unlocked.

```typescript
interface Unlocks {
  userId:    string
  updatedAt: Timestamp

  // Which character pairs are unlocked
  // All start locked except the one chosen at onboarding
  unlockedPairs: string[]   // e.g. ['marco-lily', 'mei-theo']

  // The pair chosen at onboarding — always in unlockedPairs
  starterPair: string

  // Milestone progress (Cloud Function writes these)
  milestones: {
    mealsCooked:      number   // unlock pair 2 at 5
    cuisinesTried:    number   // unlock pair 3 at 3 distinct cuisines
    passportStamps:   number   // unlock pair 4 at 10
  }
}
```

---

## `recipes/{recipeId}`

```typescript
interface Recipe {
  recipeId:    string
  title:       string
  cuisineId:   string          // matches cuisines collection
  ageRange:    { min: number; max: number }  // e.g. { min: 4, max: 12 }
  prepMinutes: number
  difficulty:  'easy' | 'medium' | 'hard'
  servings:    number

  // Allergen flags — recipe contains these
  allergens:   Allergy[]

  // Food group tags for nutrition visual
  nutritionTags: NutritionTag[]

  // Ingredients
  ingredients: Ingredient[]

  // Step-by-step instructions
  steps: RecipeStep[]

  // Culture story card
  cultureCard: CultureCard

  // Match score factors (used by preference engine)
  coreFlavours:  string[]   // e.g. ['savoury', 'mild', 'sweet']
  textures:      string[]   // e.g. ['soft', 'crunchy']
  mainProteins:  string[]   // e.g. ['chicken', 'egg']
  mainVeg:       string[]   // e.g. ['broccoli', 'edamame']

  // Substitution hints for hard-to-find ingredients
  substitutions: Record<string, string>  // { 'soy-sauce': 'coconut aminos' }

  // Wave 1 or later launch wave
  launchWave: 1 | 2 | 3

  createdAt:  Timestamp
  updatedAt:  Timestamp
}

type NutritionTag = 'protein' | 'veg' | 'carbs' | 'dairy' | 'fruit'

interface Ingredient {
  name:     string
  amount:   number
  unit:     string   // 'g' | 'ml' | 'tbsp' | 'tsp' | 'cup' | 'piece' | 'bunch'
  notes:    string | undefined  // e.g. 'finely chopped'
  isGlobal: boolean  // true if this ingredient may be hard to source
}

interface RecipeStep {
  stepNumber:       number
  instruction:      string
  timerSeconds:     number | undefined  // undefined if no timer
  kidParticipation: string | undefined  // e.g. 'Leila can do the mixing!'
}

interface CultureCard {
  countryName: string
  flagEmoji:   string
  facts: {
    age2to4: string   // max 1 sentence, concrete and sensory
    age5to8: string   // max 1 sentence, surprising number or comparison
    age9to12: string  // max 1 sentence, historical or geographic depth
  }
}
```

---

## `cuisines/{cuisineId}`

```typescript
interface Cuisine {
  cuisineId:   string     // e.g. 'japanese', 'italian'
  name:        string     // e.g. 'Japanese', 'Italian'
  country:     string     // e.g. 'Japan', 'Italy'
  flagEmoji:   string     // e.g. '🇯🇵'
  launchWave:  1 | 2 | 3
  accentBg:    string     // hex — matches cuisineColors in tokens.ts
  accentText:  string     // hex — matches cuisineColors in tokens.ts
  adventureTeaser: string // short teaser text for adventure mode reveal
}
```

---

## Security rules — summary

Full rules file at `firestore.rules`. Key principles:

- Users can only read/write their own documents (`userId == request.auth.uid`)
- Children subcollection: only the parent user can read/write
- `recipes` collection: authenticated read, admin write only
- `cuisines` collection: authenticated read, admin write only
- Milestone unlock validation happens in a Cloud Function — client cannot write directly to `unlocks/{userId}.milestones`
- Passport stamp counts are incremented by Cloud Function on meal completion — client cannot write directly

---

## Firestore indexes required

These must be created in Firebase Console before queries will work:

| Collection | Fields | Order |
|---|---|---|
| `recipes` | `cuisineId`, `launchWave` | ASC, ASC |
| `recipes` | `ageRange.min`, `allergens` | ASC, ASC |
| `recipes` | `cuisineId`, `difficulty` | ASC, ASC |
| `users/{u}/mealPlans` | `childId`, `weekId` | ASC, DESC |
