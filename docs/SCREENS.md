# Little Bites, Big World — Screen Specifications

Read the relevant section before building any screen.
Each screen spec includes: route, auth requirement, data sources, components needed, and key UX rules.

---

## S1 — Splash & Sign Up
**Route:** `/(auth)/`  **Auth required:** No  **Figma:** P01-S1

### Layout
- Full screen, no scroll
- Hero area (top 40%): amber-to-coral gradient, character silhouettes (4 pairs, partially visible)
- App logo + tagline centred in hero
- Bottom area (60%): white card, sign up options

### Data
- None — no Firestore reads

### Components needed
- `<GradientHero />` — gradient background with character silhouettes
- `<AuthCard />` — bottom card with social login and email options
- `<SocialLoginButton variant="google" />`
- `<EmailSignUpButton />`

### Key rules
- Do not show the app name in ALL CAPS — sentence case always
- Google sign-in uses `expo-auth-session` — not a custom WebView
- On successful auth, check `user.onboardingComplete`:
  - `false` → navigate to `/(auth)/profile`
  - `true` → navigate to `/(tabs)/`

---

## S2 — Child Profile Setup
**Route:** `/(auth)/profile`  **Auth required:** Yes  **Figma:** P01-S2

### Layout
- Scroll view — content may exceed one screen
- Header: "Who are we cooking for?"
- Child cards (add/remove)
- Allergy selector (multi-select chips)
- Character pair selector (2×2 grid)
- Primary CTA: "Next"
- Progress dots (3 steps)

### Data
- Writes to `users/{userId}/children/{childId}` on save
- Writes starter pair to `users/{userId}/unlocks/{userId}`

### Components needed
- `<ChildCard />` — name, age, check icon
- `<AddChildField />` — dashed border, + label
- `<AllergyChip allergen={} selected={} onToggle={} />`
- `<CharacterPickerGrid />` — 2×2 grid of character pairs
- `<CharacterPickerCard pairId={} selected={} onSelect={} />`
- `<ProgressDots total={3} current={1} />`

### Key rules
- At least one child required before proceeding
- Allergy selection filters all future recipe suggestions — this is safety-critical
- Character selection is the starter pair — stored immediately, cannot be empty

---

## S3 — Taste Preference Quiz
**Route:** `/(auth)/taste-quiz`  **Auth required:** Yes  **Figma:** P01-S3

### Layout
- Scroll view
- Header + progress bar (12 of 20 foods rated)
- 2-column grid of food chips — like / dislike / neutral
- Primary CTA: "Continue"

### Data
- Writes to `users/{userId}/preferences/{childId}` on complete
- Food items are a fixed list — hardcoded in `src/constants/foods.ts`

### Components needed
- `<FoodPreferenceChip food={} state={'liked'|'disliked'|'neutral'} onTap={} />`
- `<QuizProgressBar current={} total={} />`

### Key rules
- Child can do this step themselves — font sizes must be large enough (min 14px for food names)
- Liked chips: teal[50] bg, teal[400] border, teal heart icon
- Disliked chips: coral[50] bg, coral[400] border, coral X icon
- Neutral chips: white bg, gray[100] border, gray circle icon
- Minimum 8 foods rated before Continue is active

---

## S4 — Adventure Level
**Route:** `/(auth)/adventure`  **Auth required:** Yes  **Figma:** P01-S4

### Layout
- No scroll (fits one screen)
- Adventure level selector (3 options: cautious, curious, adventurous)
- Home cuisine dropdown
- Unlock teaser card (amber, shows first milestone)
- Primary CTA: "Start exploring!"
- Progress dots (step 3 of 3)

### Data
- Writes `adventureLevel` and `homeCuisine` to `users/{userId}`
- Writes `onboardingComplete: true` to `users/{userId}` on complete
- Navigates to `/(tabs)/` on complete

### Components needed
- `<AdventureLevelOption level={} selected={} onSelect={} />`
- `<CuisineDropdown value={} onChange={} />`
- `<UnlockTeaserCard milestone="cook5Meals" />`

### Key rules
- "Curious" is the default selected state
- Home cuisine pre-fills based on device locale if possible
- On complete: mark onboarding done in Firestore, then navigate

---

## S5 — Home Dashboard
**Route:** `/(tabs)/`  **Auth required:** Yes  **Figma:** P01-S5

### Layout
- Not a scroll view — fixed sections
- Character hero area (top ~30%): active character in current cuisine outfit + wave animation
- Stats row: meals planned this week, passport stamps
- Tonight's suggestion card (hero recipe card)
- Unlock progress card (amber, shows next milestone)
- Adventure teaser card (purple, this week's new cuisine)
- Bottom: nav bar

### Data
- Real-time listener: `users/{userId}/unlocks/{userId}` — for unlock trigger
- Real-time listener: `users/{userId}/passport/{userId}` — stamp count
- Read: current week's meal plan from `users/{userId}/mealPlans/{weekId}`
- Read: tonight's suggested recipe (first non-empty dinner slot, or preference-matched suggestion)

### Components needed
- `<CharacterHero pairId={} cuisineId={} />` — hero + wave layer
- `<StatCard label={} value={} accentColor={} />`
- `<RecipeSuggestionCard recipe={} matchScore={} />`
- `<UnlockProgressCard pairId={} current={} required={} type={} />`
- `<AdventureTeaserCard cuisineId={} />`

### Key rules
- Character outfit matches the adventure cuisine for the current week
- If no adventure cuisine set, use the user's home cuisine
- Match score shown as "98% match" — never show raw score
- Unlock progress card only shows if ≥1 pair still locked

---

## S6 — Meal Planner
**Route:** `/(tabs)/plan`  **Auth required:** Yes  **Figma:** P01-S6

### Layout
- Scroll view
- Header: week label + "Auto-fill" button
- 3 meal rows (Breakfast, Lunch, Dinner) × 7 day columns
- Each cell: cuisine-coloured if filled, dashed if empty
- Nutrition week summary (4 food group badges)
- Legend: familiar (teal dot) vs adventure (purple dot)

### Data
- Read + write: `users/{userId}/mealPlans/{weekId}`
- Read: recipe data for filled slots (to show cuisine colour)

### Components needed
- `<PlannerGrid weekPlan={} onCellTap={} />`
- `<PlannerCell recipe={} mealType={} day={} onTap={} />` — familiar / adventure / empty variants
- `<NutritionWeekSummary weekPlan={} />`
- `<NutritionBadge tag={'protein'|'veg'|'carbs'|'dairy'} status={'met'|'partial'|'missing'} />`
- `<RecipePickerSheet cuisineId={} onSelect={} onDismiss={} />` — bottom sheet for slot filling

### Key rules
- Tapping a filled cell opens recipe detail (S7)
- Tapping an empty cell opens the recipe picker sheet
- Familiar cells: teal[50] bg, teal[800] text
- Adventure cells: purple[50] bg, purple[800] text
- Empty cells: linen bg, dashed gray[200] border, "+" text
- Auto-fill uses the preference engine — never fills adventure slots without checking adventure level

---

## S7 — Recipe Detail
**Route:** `/recipe/[id]`  **Auth required:** Yes  **Figma:** P01-S7

### Layout
- Scroll view with sticky header image
- Recipe image (120px tall, full width)
- Character face icon (top right corner of image)
- Title + info chips (time, age, healthy)
- Culture card (teal left-border accent)
- Nutrition badges row (3 food group pills)
- Ingredients list (preview: 3 shown, expandable)
- Primary CTA: "Start cooking" → navigates to S9

### Data
- Read: `recipes/{recipeId}` — all recipe data
- Read: active character face icon from assets

### Components needed
- `<RecipeHeroImage recipeId={} />`
- `<CharacterFaceIcon pairId={} size={32} />`
- `<InfoChip icon={} label={} />`
- `<CultureCard cuisineId={} ageGroup={} />` — shows the right age-tier fact
- `<NutritionBadges tags={} />`
- `<IngredientsList ingredients={} />` — collapsible
- `<PrimaryButton label="Start cooking" onPress={} />`

### Key rules
- Culture card shows the fact for the child's age group (from child profile)
- "Healthy" chip always shown (all recipes in library are nutritionist-reviewed)
- No calorie count anywhere on this screen
- Substitution notes shown inline next to relevant ingredients (orange info icon)

---

## S8 — Shopping List
**Route:** `/(tabs)/shop`  **Auth required:** Yes  **Figma:** P01-S8

### Layout
- Scroll view
- Header: "This week's list" + "Order all" link
- Subtitle: item count
- Grouped by category: Produce, Pantry, Protein, etc.
- Each item: checkbox, name + quantity, cuisine flag, substitution note if applicable
- Character face icon next to items linked to adventure recipes

### Data
- Derived from current week's meal plan — aggregated client-side from recipe ingredients
- Persists checked state to AsyncStorage (local only — no Firestore write)

### Components needed
- `<ShoppingCategory category={} items={} />`
- `<ShoppingItem item={} checked={} onToggle={} />`
- `<SubstitutionNote original={} substitute={} />`
- `<OrderAllLink />` — placeholder for future grocery integration

### Key rules
- Items are deduplicated and quantities summed across recipes
- Checked items move to bottom of their category (or show strike-through)
- Category grouping: Produce, Protein, Pantry, Dairy, Bakery
- Global ingredients (hard-to-source) show an orange info icon with substitution

---

## S9 — Guided Prep Mode
**Route:** `/cook/[id]`  **Auth required:** Yes  **Figma:** P01-S9

### Layout
- No scroll — single screen per step
- Header bar: recipe name, step N of M, progress bar
- Step card: instruction text, kid participation prompt (if applicable), character face icon
- Timer block (if step has timer)
- Navigation: "← Back" and "Next step →"
- Tip bar at bottom (amber)

### Data
- Read: `recipes/{recipeId}` — steps array
- Write: on final step complete → calls `MealCompleteService.recordCompletion()`

### Components needed
- `<PrepHeader recipeName={} stepNumber={} totalSteps={} progress={} />`
- `<StepCard instruction={} kidPrompt={} characterPairId={} />`
- `<PrepTimer seconds={} onComplete={} />` — countdown with start button
- `<StepNavigation onBack={} onNext={} isFirst={} isLast={} />`
- `<TipBar tip={} />`

### Key rules
- "Next step" on final step shows a "Meal complete 🎉" confirmation
- Meal complete triggers Cloud Function via `MealCompleteService`
- Kid participation prompt is shown with purple background + character face icon + star icon
- Timer is optional — only shown if `step.timerSeconds` is defined
- Back button on step 1 shows a "Leave cooking?" confirmation dialog

---

## S10 — Passport & Rewards
**Route:** `/(tabs)/explore`  **Auth required:** Yes  **Figma:** P01-S10

### Layout
- Scroll view
- World map area (top, non-interactive map illustration with dot markers)
- Character face icon + "Leila's world" label
- Country count + "X to go" link
- Stamps collected: 2×4 grid (earned and locked)
- Badges earned: horizontal chip row

### Data
- Real-time listener: `users/{userId}/passport/{userId}`

### Components needed
- `<WorldMapDisplay stamps={} activeCharacterPairId={} />`
- `<StampCount earned={} total={} />`
- `<StampGrid stamps={} allCuisines={} />`
- `<PassportStamp cuisineId={} earned={} />`
- `<BadgeChip badge={} />`

### Key rules
- Locked stamps show dark silhouette + lock icon
- Tapping an earned stamp navigates to adventure mode for that cuisine (S11)
- Tapping a locked stamp shows "Cook a [cuisine] recipe to unlock!"
- Badge chips: first-bite (teal star), explorer (purple globe), little-chef (amber chef-hat)

---

## S11 — Adventure Mode
**Route:** `/adventure/[cuisine]`  **Auth required:** Yes  **Figma:** P01-S11

### Layout
- Scroll view
- Adventure hero bar: purple bg, planet icon, "New cuisine unlocked" label, cuisine name
- Culture fact card (blue left-border accent)
- "Try this week" section + recipe card
- Character outfit teaser (amber card)
- "Not ready?" note
- Primary CTA: "Add to this week's plan"
- Ghost CTA: "Skip for now — no pressure"

### Data
- Read: `cuisines/{cuisineId}` — culture fact, teaser text
- Read: one matching recipe from `recipes` collection (filtered by cuisineId)
- Write: adds recipe to meal plan if "Add to plan" tapped

### Components needed
- `<AdventureHeroBar cuisineId={} />`
- `<CultureFactCard cuisineId={} ageGroup={} />`
- `<RecipeTeaser recipe={} />`
- `<CharacterOutfitTeaser pairId={} cuisineId={} />`
- `<AddToPlanButton recipe={} onPress={} />`
- `<SkipButton onPress={} />`

### Key rules
- Culture fact always shown before the recipe — this is the "curiosity first" principle
- Recipe shown is matched to the child's preferences from that cuisine
- "Skip for now" simply navigates back — no negative state recorded
- Character outfit teaser shows the character pair in that cuisine's outfit (if asset exists)
- If cuisine outfit asset does not exist yet, hide the teaser card entirely
